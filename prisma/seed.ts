import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.task.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.property.deleteMany()
  await prisma.contact.deleteMany()

  const contacts = await Promise.all([
    prisma.contact.create({ data: { name: 'Ananya Mehta', email: 'ananya@example.in', phone: '+91 98201 44128', type: 'Buyer', status: 'Qualified', source: 'Property Portal' } }),
    prisma.contact.create({ data: { name: 'Vikram Shah', email: 'vikram@example.in', phone: '+91 98204 77831', type: 'Seller', status: 'Negotiation', source: 'Referral' } }),
    prisma.contact.create({ data: { name: 'Priya Iyer', email: 'priya@example.in', phone: '+91 98190 32654', type: 'Buyer', status: 'New', source: 'Walk-in' } }),
  ])

  const property = await prisma.property.create({ data: { title: 'Sea View 3 BHK · Bandra West', address: '14 Carter Road', city: 'Mumbai', state: 'Maharashtra', zip: '400050', price: 42500000, beds: 3, baths: 3, area: 1680, status: 'Available', type: 'Residential' } })

  await prisma.deal.create({ data: { title: 'Bandra West · Sea View Residence', stage: 'Proposal', value: 42500000, probability: 70, contactId: contacts[0].id, propertyId: property.id } })
  await prisma.deal.create({ data: { title: 'Juhu Bungalow · Seller Mandate', stage: 'Negotiation', value: 31500000, probability: 85, contactId: contacts[1].id } })
  await prisma.deal.create({ data: { title: 'Powai First Home', stage: 'Lead', value: 18500000, probability: 20, contactId: contacts[2].id } })

  await prisma.task.createMany({ data: [
    { title: 'Call about Bandra site visit', dueDate: new Date(Date.now() + 86400000), priority: 'High', contactId: contacts[0].id },
    { title: 'Share Juhu valuation report', dueDate: new Date(Date.now() + 2 * 86400000), priority: 'Medium', contactId: contacts[1].id },
    { title: 'Arrange Powai property viewing', dueDate: new Date(Date.now() + 3 * 86400000), priority: 'High', contactId: contacts[2].id },
  ] })
}

main().finally(() => prisma.$disconnect())
