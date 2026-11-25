import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  return NextResponse.json(await prisma.property.findMany({ orderBy: { createdAt: 'desc' } }))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const property = await prisma.property.create({ data: { title: body.title, address: body.address, city: body.city, state: body.state, zip: body.zip, price: body.price, beds: body.beds, baths: body.baths, area: body.area, status: body.status, type: body.type, description: body.description } })
  return NextResponse.json(property, { status: 201 })
}
