import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import {
  ArrowDownRight, ArrowUpRight, Bell, Building2, CalendarDays, ChevronDown,
  ChevronRight, CircleHelp, ClipboardList, Home, LayoutDashboard, Plus,
  Search, Settings2, Users,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()
// Use an explicit rupee prefix so the display never depends on locale currency symbols.
const inr = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default async function Dashboard() {
  const [contacts, deals, properties, tasks] = await Promise.all([
    prisma.contact.count(),
    prisma.deal.findMany({ include: { contact: true, property: true }, orderBy: { updatedAt: 'desc' } }),
    prisma.property.count(),
    prisma.task.findMany({ include: { contact: true }, where: { completed: false }, take: 4, orderBy: { dueDate: 'asc' } }),
  ])
  const pipeline = deals.reduce((sum, deal) => sum + Number(deal.value), 0)

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link href="#" className="brand"><span className="brand-mark"><Home size={20} strokeWidth={1.7}/></span><span className="brand-copy"><strong>GHARANA</strong><small>REALTY PARTNERS</small></span></Link>
        <div className="workspace"><span className="workspace-dot"/> Mumbai office <ChevronDown size={14}/></div>
        <p className="nav-label">WORKSPACE</p>
        <nav>
          <Link className="nav-item active" href="#"><LayoutDashboard size={18}/>Overview</Link>
          <Link className="nav-item" href="#contacts"><Users size={18}/>Clients<span className="nav-count">{contacts}</span></Link>
          <Link className="nav-item" href="#properties"><Building2 size={18}/>Properties</Link>
          <Link className="nav-item" href="#deals"><ClipboardList size={18}/>Transactions</Link>
          <Link className="nav-item" href="#tasks"><CalendarDays size={18}/>Follow-ups</Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><div className="tip-icon">✦</div><strong>Your next deal is one call away.</strong><span>Keep every client conversation moving.</span><a href="#tasks">View follow-ups <ChevronRight size={13}/></a></div>
          <Link className="nav-item" href="#"><Settings2 size={18}/>Settings</Link>
          <div className="profile"><div className="profile-avatar">RK</div><div><strong>Rahul Kulkarni</strong><span>Property consultant</span></div><ChevronDown size={15}/></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Gharana Realty <ChevronRight size={14}/> <span>Overview</span></div>
          <div className="top-actions"><label className="search"><Search size={16}/><input aria-label="Search" placeholder="Search clients, properties..."/><kbd>⌘ K</kbd></label><button className="bell" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">RK</div></div>
        </header>
        <div className="content">
          <div className="welcome-row"><div><p className="eyebrow">WEDNESDAY, 25 NOVEMBER 2026 <span className="live-dot"/> MARKET IS OPEN</p><h1>Good morning, Rahul <span>☀</span></h1><p className="welcome-sub">Here’s what’s happening across your Mumbai portfolio today.</p></div><button className="primary-button"><Plus size={17}/> Add new lead</button></div>
          <div className="stats">
            <article className="stat-card"><div className="stat-top"><span>ACTIVE CLIENTS</span><span className="stat-icon sage"><Users size={17}/></span></div><strong>{contacts.toLocaleString('en-IN')}</strong><div className="stat-foot"><span className="trend"><ArrowUpRight size={14}/> 12.5%</span><span>vs last month</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>PIPELINE VALUE</span><span className="stat-icon gold"><ClipboardList size={17}/></span></div><strong>{inr(pipeline)}</strong><div className="stat-foot"><span className="trend"><ArrowUpRight size={14}/> 8.4%</span><span>weighted opportunity</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>ACTIVE LISTINGS</span><span className="stat-icon blue"><Building2 size={17}/></span></div><strong>{properties.toLocaleString('en-IN')}</strong><div className="stat-foot"><span className="muted-foot">Across Mumbai &amp; suburbs</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>FOLLOW-UPS DUE</span><span className="stat-icon rose"><CalendarDays size={17}/></span></div><strong>{tasks.length.toLocaleString('en-IN')}</strong><div className="stat-foot"><span className="urgent"><ArrowDownRight size={14}/> 2 overdue</span><span>needs your attention</span></div></article>
          </div>
          <div className="dashboard-grid">
            <section className="panel transactions" id="deals">
              <div className="panel-heading"><div><p className="eyebrow">KEEP THE MOMENTUM</p><h2>Deal pipeline</h2></div><Link href="#deals" className="text-link">All transactions <ChevronRight size={15}/></Link></div>
              <div className="pipeline-summary"><div><span className="summary-label">TOTAL OPPORTUNITY</span><strong>{inr(pipeline)}</strong></div><div className="summary-rule"/><div><span className="summary-label">OPEN DEALS</span><strong>{deals.length} <small>transactions</small></strong></div><div className="summary-graphic"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div>
              <div className="table-head"><span>CLIENT / PROPERTY</span><span>STAGE</span><span>DEAL VALUE (INR)</span><span>PROBABILITY</span></div>
              <div className="deal-list">{deals.map((deal) => <div className="deal-row" key={deal.id}><div className="deal-client"><div className="deal-avatar">{(deal.contact?.name ?? 'G').split(' ').map(part => part[0]).slice(0,2).join('')}</div><div><strong>{deal.contact?.name ?? 'New enquiry'}</strong><span>{deal.property?.title ?? deal.title}</span></div></div><div><span className={`stage stage-${deal.stage.toLowerCase().replace(/\s+/g,'-')}`}>{deal.stage}</span></div><strong className="deal-amount">{inr(Number(deal.value))}</strong><div className="probability"><div className="progress"><i style={{width:`${deal.probability}%`}}/></div><span>{deal.probability}%</span></div></div>)}</div>
              {deals.length === 0 && <div className="empty-state">Your pipeline is ready for its first opportunity.</div>}
            </section>
            <section className="panel follow-ups" id="tasks">
              <div className="panel-heading"><div><p className="eyebrow">STAY ONE STEP AHEAD</p><h2>Today’s follow-ups</h2></div><button className="round-plus" aria-label="Add follow-up"><Plus size={17}/></button></div>
              <div className="task-list">{tasks.map(task => <div className="task" key={task.id}><span className={`task-check ${task.priority === 'High' ? 'high' : ''}`}/><div className="task-details"><strong>{task.title}</strong><span>{task.contact?.name ?? 'General follow-up'}</span><small><CalendarDays size={12}/>{new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short'}).format(task.dueDate)} <i/> {task.priority} priority</small></div></div>)}</div>
              {tasks.length === 0 && <div className="empty-state">All caught up. Enjoy the breathing room.</div>}
              <Link className="all-tasks" href="#tasks">View all follow-ups <ChevronRight size={15}/></Link>
            </section>
            <section className="market-card" id="properties"><div className="market-content"><span className="market-kicker">LOCAL MARKET SNAPSHOT</span><h2>Know your<br/>neighbourhood.</h2><p>Insights for the places your clients call home.</p><a href="#properties">Explore property insights <ChevronRight size={15}/></a></div><div className="market-art"><div className="sun"/><div className="building building-one"/><div className="building building-two"/><div className="building building-three"/><div className="building building-four"/><div className="ground"/></div></section>
            <section className="tip-card"><div className="tip-top"><CircleHelp size={17}/><span>GHARANA NOTE</span></div><p>Great service is remembered long after the keys are handed over.</p><span className="tip-author">A little reminder for today</span></section>
          </div>
          <footer className="footer"><span>Made for people who find the right place.</span><span>GHARANA REALTY PARTNERS <i/> MUMBAI</span></footer>
        </div>
      </section>
    </main>
  )
}
