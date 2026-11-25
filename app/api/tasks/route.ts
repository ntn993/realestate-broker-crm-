import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  return NextResponse.json(await prisma.task.findMany({ include: { contact: true }, orderBy: { dueDate: 'asc' } }))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const task = await prisma.task.create({ data: { title: body.title, dueDate: new Date(body.dueDate), priority: body.priority, contactId: body.contactId } })
  return NextResponse.json(task, { status: 201 })
}
