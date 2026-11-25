import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const validTypes = new Set(['Buyer', 'Seller', 'Tenant', 'Investor', 'Other'])

export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { deals: true, tasks: { orderBy: { dueDate: 'asc' } }, activities: { orderBy: { createdAt: 'desc' }, take: 10 } },
  })
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body')
  } catch {
    return NextResponse.json({ error: 'Send a valid JSON object.' }, { status: 400 })
  }
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  if (!name || (!email && !phone)) return NextResponse.json({ error: 'Name and a phone number or email are required.' }, { status: 400 })
  const type = typeof body.type === 'string' && validTypes.has(body.type) ? body.type : 'Buyer'
  const contact = await prisma.contact.create({ data: {
    name, ...(email ? { email } : {}), ...(phone ? { phone } : {}), type,
    status: typeof body.status === 'string' ? body.status : 'New',
    source: typeof body.source === 'string' ? body.source : 'Other',
    ...(typeof body.sourceCampaign === 'string' ? { sourceCampaign: body.sourceCampaign } : {}),
    ...(typeof body.notes === 'string' ? { notes: body.notes } : {}),
    ...(typeof body.preferredPropertyType === 'string' ? { preferredPropertyType: body.preferredPropertyType } : {}),
    ...(typeof body.preferredLocation === 'string' ? { preferredLocation: body.preferredLocation } : {}),
    ...(typeof body.assignedTo === 'string' ? { assignedTo: body.assignedTo } : {}),
    consentToContact: body.consentToContact === true,
  } })
  return NextResponse.json(contact, { status: 201 })
}
