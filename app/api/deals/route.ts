import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  return NextResponse.json(await prisma.deal.findMany({ include: { contact: true, property: true }, orderBy: { updatedAt: 'desc' } }))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const deal = await prisma.deal.create({ data: { title: body.title, stage: body.stage, value: body.value, probability: body.probability, closeDate: body.closeDate ? new Date(body.closeDate) : null, contactId: body.contactId, propertyId: body.propertyId } })
  return NextResponse.json(deal, { status: 201 })
}
