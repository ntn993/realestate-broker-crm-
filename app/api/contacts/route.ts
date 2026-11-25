import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const contacts = await prisma.contact.findMany({ orderBy: { updatedAt: 'desc' }, include: { deals: true } })
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const contact = await prisma.contact.create({ data: { name: body.name, email: body.email, phone: body.phone, type: body.type, status: body.status, source: body.source, notes: body.notes } })
  return NextResponse.json(contact, { status: 201 })
}
