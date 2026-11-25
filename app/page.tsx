import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Building2, CalendarDays, ChevronRight, ContactRound, LayoutDashboard, Settings, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function Dashboard() {
  const [contacts, deals, properties, tasks] = await Promise.all([
    prisma.contact.count(), prisma.deal.findMany({ include: { contact: true } }), prisma.property.count(), prisma.task.findMany({ include: { contact: true }, where: { completed: false }, take: 5, orderBy: { dueDate: 'asc' } }),
  ])
  const pipeline = deals.reduce((sum, deal) => sum + Number(deal.value), 0)
  const pipelineLabel = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pipeline)

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">H</div><span>HAVEN</span></div>
        <nav>
          <Link className="nav-item active" href="#"><LayoutDashboard size={19}/>Overview</Link>
          <Link className="nav-item" href="#contacts"><Users size={19}/>Contacts</Link>
          <Link className="nav-item" href="#properties"><Building2 size={19}/>Properties</Link>
          <Link className="nav-item" href="#deals"><ContactRound size={19}/>Deals</Link>
          <Link className="nav-item" href="#tasks"><CalendarDays size={19}/>Appointments</Link>
        </nav>
        <Link className="nav-item settings" href="#"><Settings size={19}/>Settings</Link>
      </aside>

      <section className="content">
        <header className="topbar"><div><p className="eyebrow">TUESDAY, NOVEMBER 25</p><h1>Good morning, Alex</h1></div><button className="avatar">AJ</button></header>

        <div className="stats">
          <article><p>Active leads</p><strong>{contacts}</strong><span className="positive">+12% this month</span></article>
          <article><p>Pipeline value</p><strong>{pipelineLabel}</strong><span className="positive">+8.4% this month</span></article>
          <article><p>Properties</p><strong>{properties}</strong><span>Across 3 markets</span></article>
          <article><p>Tasks due</p><strong>{tasks.length}</strong><span className="warning">2 require attention</span></article>
        </div>

        <div className="grid">
          <section className="panel pipeline" id="deals">
            <div className="panel-heading"><div><p class="eyebrow">PERFORMANCE</p><h2>Sales pipeline</h2></div><button>View report</button></div>
            <div className="deal-list">
              {deals.map(deal => (
                <div className="deal-row" key={deal.id}><div className="deal-avatar">{deal.contact?.name?.[0] ?? 'D'}</div><div className="deal-name"><strong>{deal.title}</strong><span>{deal.contact?.name ?? 'Unassigned'} · {deal.stage}</span></div><div className="deal-value"><strong>{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(deal.value))}</strong><div className="progress"><i style={{width:`${deal.probability}%`}} /></div></div><ChevronRight size={18}/></div>
              ))}
            </div>
          </section>

          <section className="panel follow-ups" id="tasks">
            <div className="panel-heading"><div><p className="eyebrow">TODAY</p><h2>Follow-ups</h2></div><button className="icon-button">+</button></div>
            <div className="task-list">
              {tasks.map(task => <div className="task" key={task.id}><span className={`check ${task.priority === 'High' ? 'high' : ''}`} /><div><strong>{task.title}</strong><span>{task.contact?.name ?? 'General task'} · {task.priority}</span></div></div>)}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
