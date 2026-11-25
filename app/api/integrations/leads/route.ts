import { NextRequest, NextResponse } from 'next/server'
import { Prisma, PrismaClient } from '@prisma/client'
import { timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'

const prisma = new PrismaClient()
const MAX_BODY_BYTES = 32 * 1024
const validTypes = new Set(['Buyer', 'Seller', 'Tenant', 'Investor', 'Other'])
const propertyTypes = new Set(['Kothi', 'Villa', 'Flat / Apartment', 'Plot', 'Residential Land', 'Commercial Property', 'Office', 'Shop', 'Other'])

function authorized(request: NextRequest) {
  const secret = process.env.LEAD_WEBHOOK_SECRET
  const header = request.headers.get('authorization') ?? ''
  if (!secret || !header.startsWith('Bearer ')) return false
  const supplied = Buffer.from(header.slice(7))
  const expected = Buffer.from(secret)
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

function normalizeSource(value: unknown) {
  const input = typeof value === 'string' ? value.trim() : ''
  const source = input.toLowerCase()
  if (source.includes('instagram')) return 'Instagram'
  if (source.includes('facebook') || source.includes('meta')) return 'Facebook / Meta'
  if (source.includes('whatsapp')) return 'WhatsApp'
  if (source.includes('ivr') || source.includes('call') || source.includes('phone')) return 'IVR / Phone'
  if (source.includes('google')) return 'Google Ads'
  if (source.includes('99acres') || source.includes('magicbricks') || source.includes('housing.com') || source.includes('property portal')) return 'Property Portal'
  if (source.includes('website') || source.includes('web form')) return 'Website'
  if (source.includes('referral')) return 'Referral'
  if (source.includes('walk')) return 'Walk-in'
  if (source.includes('linkedin')) return 'LinkedIn'
  return input || 'Other'
}

const stringValue = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const optionalDecimal = (value: unknown) => {
  if (value === undefined || value === null || value === '') return undefined
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) throw new Error('Budget values must be non-negative numbers.')
  return new Prisma.Decimal(number)
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized integration request.' }, { status: 401 })
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Expected a JSON object.')
  } catch {
    return NextResponse.json({ error: 'Send a valid JSON object.' }, { status: 400 })
  }

  const name = stringValue(body.name) || 'New lead'
  const phoneRaw = stringValue(body.phone)
  const phone = phoneRaw ? phoneRaw.replace(/[\s().-]/g, '') : ''
  const emailRaw = stringValue(body.email)
  const email = emailRaw ? emailRaw.toLowerCase() : ''
  if ((!phone && !email) || (phone && !/^\+?\d{10,15}$/.test(phone)) || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json({ error: 'Provide a valid phone (10–15 digits) or email address.' }, { status: 400 })
  }

  const source = normalizeSource(body.source ?? body.provider ?? body.platform)
  const externalId = stringValue(body.externalId ?? body.leadId) || null
  const typeValue = stringValue(body.type)
  const propertyTypeValue = stringValue(body.preferredPropertyType)
  if (typeValue && !validTypes.has(typeValue)) return NextResponse.json({ error: 'Unsupported client type.' }, { status: 400 })
  if (propertyTypeValue && !propertyTypes.has(propertyTypeValue)) return NextResponse.json({ error: 'Unsupported preferred property type.' }, { status: 400 })

  let budgetMin: Prisma.Decimal | undefined
  let budgetMax: Prisma.Decimal | undefined
  try {
    budgetMin = optionalDecimal(body.budgetMin)
    budgetMax = optionalDecimal(body.budgetMax)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid budget.' }, { status: 400 })
  }
  if (budgetMin && budgetMax && budgetMin.gt(budgetMax)) return NextResponse.json({ error: 'budgetMin cannot exceed budgetMax.' }, { status: 400 })

  const campaign = stringValue(body.campaign ?? body.sourceCampaign)
  const details = stringValue(body.message ?? body.notes)
  const consentToContact = body.consentToContact === true
  const propertyData = {
    name,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    type: typeValue || 'Buyer',
    source,
    ...(campaign ? { sourceCampaign: campaign } : {}),
    ...(externalId ? { externalId } : {}),
    ...(budgetMin ? { budgetMin } : {}),
    ...(budgetMax ? { budgetMax } : {}),
    ...(propertyTypeValue ? { preferredPropertyType: propertyTypeValue } : {}),
    ...(stringValue(body.preferredLocation) ? { preferredLocation: stringValue(body.preferredLocation) } : {}),
    ...(stringValue(body.assignedTo) ? { assignedTo: stringValue(body.assignedTo) } : {}),
    ...(details ? { notes: details } : {}),
    consentToContact,
  }

  try {
    const existing = externalId
      ? await prisma.contact.findUnique({ where: { source_externalId: { source, externalId } } })
      : await prisma.contact.findFirst({ where: { OR: [ ...(phone ? [{ phone }] : []), ...(email ? [{ email }] : []) ] } })

    const result = await prisma.$transaction(async tx => {
      const contact = existing
        ? await tx.contact.update({ where: { id: existing.id }, data: {
            ...(email ? { email } : {}), ...(phone ? { phone } : {}),
            ...(campaign ? { sourceCampaign: campaign } : {}),
            ...(budgetMin ? { budgetMin } : {}), ...(budgetMax ? { budgetMax } : {}),
            ...(propertyTypeValue ? { preferredPropertyType: propertyTypeValue } : {}),
            ...(stringValue(body.preferredLocation) ? { preferredLocation: stringValue(body.preferredLocation) } : {}),
            ...(details ? { notes: details } : {}), consentToContact,
          } })
        : await tx.contact.create({ data: propertyData })

      await tx.activity.create({ data: {
        contactId: contact.id,
        kind: existing ? 'Lead updated' : 'Lead received',
        channel: source,
        summary: existing ? `Lead details received again from ${source}.` : `New lead received from ${source}.`,
        ...(details ? { details } : {}),
      } })
      if (!existing) await tx.task.create({ data: {
        contactId: contact.id,
        title: `First follow-up: ${name}`,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        priority: 'High',
      } })
      return contact
    })
    return NextResponse.json({ ok: true, duplicate: Boolean(existing), contactId: result.id, source }, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('Lead integration failed', error)
    return NextResponse.json({ error: 'Could not save this lead. Check the CRM database and retry.' }, { status: 500 })
  }
}
