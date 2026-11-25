import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.task.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.property.deleteMany()
  await prisma.contact.deleteMany()

  const contacts = await Promise.all([
    prisma.contact.create({ data: { name: 'Sophia Carter', email: 'sophia@example.com', phone: '(555) 014-2211', type: 'Buyer', status: 'Qualified', source: 'Website' } }),
    prisma.contact.create({ data: { name: 'Marcus Johnson', email: 'marcus@example.com', phone: '(555) 018-7823', type: 'Seller', status: 'Negotiation', source: 'Referral' } }),
    prisma.contact.create({ data: { name: 'Olivia Davis', email: 'olivia@example.com', phone: '(555) 011-4590', type: 'Buyer', status: 'New', source: 'Social Media' } }),
  ])

  const property = await prisma.property.create({ data: { title: 'Modern Parkside Residence', address: '1847 Willow Avenue', city: 'Austin', state: 'TX', zip: '78703', price: 875000, beds: 4, baths: 3.5, area: 2840, status: 'Available', type: 'Residential' } })

  await prisma.deal.create({ data: { title: 'Carter — Willow Avenue', stage: 'Proposal', value: 875000, probability: 70, contactId: contacts[0].id, propertyId: property.id } })
  await prisma.deal.create({ data: { title: 'Johnson Home Sale', stage: 'Negotiation', value: 642000, probability: 85, contactId: contacts[1].id } })
  await prisma.deal.create({ data: { title: 'Davis First-Time Purchase', stage: 'Lead', value: 410000, probability: 20, contactId: contacts[2].id } })

  await prisma.task.createMany({ data: [
    { title: 'Call Sophia Carter', dueDate: new Date(Date.now() + 86400000), priority: 'High', contactId: contacts[0].id },
    { title: 'Send property brochure', dueDate: new Date(Date.now() + 2 * 86400000), priority: 'Medium', contactId: contacts[1].id },
    { title: 'Schedule property viewing', dueDate: new Date(Date.now() + 3 * 86400000), priority: 'High', contactId: contacts[2].id },
  ] })
}

main().finally(() => prisma.$disconnect())
