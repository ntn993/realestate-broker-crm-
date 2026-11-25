import Link from 'next/link'
import {
  Bell, Building2, CalendarDays, ChevronDown, ChevronRight, ClipboardList,
  Crown, LayoutDashboard, Megaphone, PhoneCall, Search, Settings2, ShieldCheck,
  UserRound, Users, WalletCards, Landmark, FileCheck2, Headphones,
  House, TrendingUp, Plus, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

const roles = {
  'super-admin': { label: 'Super Admin', name: 'Rahul Kulkarni', icon: Crown, accent: 'gold' },
  'admin': { label: 'Admin', name: 'Neha Sharma', icon: ShieldCheck, accent: 'green' },
  'sales-manager': { label: 'Sales Manager', name: 'Arjun Mehta', icon: TrendingUp, accent: 'green' },
  'sales-executive': { label: 'Sales Executive', name: 'Vikram Rao', icon: UserRound, accent: 'blue' },
  'telecaller': { label: 'Telecaller', name: 'Pooja Singh', icon: PhoneCall, accent: 'rose' },
  'marketing': { label: 'Marketing', name: 'Isha Kapoor', icon: Megaphone, accent: 'gold' },
  'back-office': { label: 'Back Office', name: 'Anita Joshi', icon: FileCheck2, accent: 'blue' },
  'accounts': { label: 'Accounts', name: 'Karan Patel', icon: WalletCards, accent: 'gold' },
  'documentation': { label: 'Documentation', name: 'Meera Iyer', icon: Landmark, accent: 'blue' },
  'property-manager': { label: 'Property Manager', name: 'Sanjay Nair', icon: House, accent: 'green' },
  'crm-support': { label: 'CRM Support', name: 'Tanya Das', icon: Headphones, accent: 'rose' },
} as const

type RoleKey = keyof typeof roles

export default async function Dashboard({ searchParams }: { searchParams?: { role?: string } }) {
  const roleKey: RoleKey = (searchParams?.role && searchParams.role in roles) ? searchParams.role as RoleKey : 'super-admin'
  const role = roles[roleKey]
  const RoleIcon = role.icon

  const isTeamRole = ['super-admin','admin','sales-manager','marketing'].includes(roleKey)
  const isFinance = roleKey === 'accounts'
  const isOperations = ['back-office','documentation','property-manager','crm-support'].includes(roleKey)
  const isSales = ['sales-executive','telecaller','sales-manager'].includes(roleKey)

  const metrics = isFinance
    ? [
      ['TOTAL RECEIPTS','₹4,82,50,000','This month', 'sage'],
      ['PENDING INVOICE','₹68,40,000','18 invoices', 'gold'],
      ['BROKERAGE PAYABLE','₹12,65,000','After TDS', 'blue'],
      ['OVERDUE','₹21,30,000','7 accounts', 'rose'],
    ]
    : isOperations
      ? [
        ['OPEN REQUESTS','42','Needs action', 'sage'],
        ['DOCUMENTS PENDING','18','This week', 'gold'],
        ['APPROVALS DUE','9','Requires review', 'blue'],
        ['COMPLETED','126','This month', 'rose'],
      ]
      : isSales
        ? [
          ['ASSIGNED LEADS',roleKey === 'telecaller' ? '86':'24','12 new today', 'sage'],
          ['MY PIPELINE','₹2,18,50,000','Weighted value', 'gold'],
          ['SITE VISITS','11','This week', 'blue'],
          ['FOLLOW-UPS','14','4 overdue', 'rose'],
        ]
        : [
          ['TOTAL CLIENTS','1,284','84 new this month', 'sage'],
          ['OPEN PIPELINE','₹7,35,00,000','Across 3 branches', 'gold'],
          ['ACTIVE LISTINGS','186','Mumbai & suburbs', 'blue'],
          ['OPEN FOLLOW-UPS','38','11 overdue', 'rose'],
        ]

  const leads = [
    {name:'Ananya Mehta', source:'Instagram', status:'Qualified', property:'Flat · Bandra West', time:'18 min'},
    {name:'Vikram Shah', source:'Referral', status:'Proposal', property:'Villa · Juhu', time:'42 min'},
    {name:'Priya Iyer', source:'IVR / Phone', status:'New', property:'Plot · Powai', time:'1 hr'},
    {name:'Kabir Malhotra', source:'99acres', status:'Site visit', property:'Kothi · Thane', time:'2 hr'},
    {name:'Rhea Fernandes', source:'Walk-in', status:'Contacted', property:'Commercial · Andheri', time:'3 hr'},
  ]

  const followUps = [
    ['Call Ananya about Bandra site visit','Ananya Mehta','Today · 11:30 AM','High'],
    ['Share Juhu valuation report','Vikram Shah','Today · 1:00 PM','Medium'],
    ['Arrange Powai plot viewing','Priya Iyer','Tomorrow · 10:00 AM','High'],
    ['Collect KYC documents','Kabir Malhotra','Tomorrow · 4:30 PM','Medium'],
  ]

  const nav = isFinance
    ? [['Leads & deals',Users],['Invoicing',WalletCards],['Receipts',Landmark],['Commissions',TrendingUp],['Reconciliation',ClipboardList]]
    : isOperations
      ? [['Dashboard',LayoutDashboard],['Assigned work',ClipboardList],['Documents',FileCheck2],['Approvals',ShieldCheck],['Activity log',CalendarDays]]
      : isSales
        ? [['Dashboard',LayoutDashboard],['My leads',Users],['Call queue',PhoneCall],['Site visits',CalendarDays],['My deals',ClipboardList],['Performance',TrendingUp]]
        : [['Dashboard',LayoutDashboard],['Leads',Users],['Properties',Building2],['Transactions',ClipboardList],['Team',ShieldCheck],['Reports',TrendingUp]]

  return (
    <main className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand"><span><House size={19}/></span><div><strong>GHARANA</strong><small>REALTY PARTNERS</small></div></Link>
        <button className="office"><span className="status-dot"/>Mumbai office<ChevronDown size={14}/></button>
        <p className="nav-title">{isFinance ? 'ACCOUNTS' : isOperations ? 'OPERATIONS' : 'WORKSPACE'}</p>
        <nav>{nav.map(([item, Icon], index) => { const NavIcon = Icon as typeof LayoutDashboard; return <Link href="#" className={`nav-link ${index === 0 ? 'active':''}`} key={String(item)}><NavIcon size={18}/><span>{String(item)}</span>{index === 1 && <b>18</b>}</Link> })}</nav>
        <div className="sidebar-bottom"><Link className="nav-link" href="#"><Settings2 size={18}/><span>Settings</span></Link><div className="profile"><div className="avatar">{role.name.split(' ').map(n=>n[0]).join('')}</div><div><strong>{role.name}</strong><small>{role.label}</small></div><ChevronDown size={14}/></div></div>
      </aside>

      <section className="workspace-main">
        <header className="topbar"><div className="breadcrumb">Gharana Realty <ChevronRight size={13}/><span>{role.label}</span></div><div className="top-actions"><label><Search size={15}/><input placeholder="Search anything..."/><kbd>⌘ K</kbd></label><button aria-label="Notifications"><Bell size={17}/><i/></button><span className="top-avatar">RK</span></div></header>

        <div className="content">
          <div className="welcome"><div><p>WEDNESDAY, 25 NOVEMBER 2026 <span/> MUMBAI OFFICE</p><h1>{role.label} workspace</h1><small>{role.name} · Role-based business view</small></div><button className="primary"><Plus size={17}/>{isFinance ? 'Create invoice' : isOperations ? 'Create request' : 'Add new lead'}</button></div>

          <div className="role-switcher"><span>VIEW AS</span>{(Object.keys(roles) as RoleKey[]).map(key => {const Icon=roles[key].icon; return <Link href={`/?role=${key}`} className={key===roleKey?'selected':''} key={key}><Icon size={14}/>{roles[key].label}</Link>})}</div>

          <div className="stats">{metrics.map(([label,value,detail,tone]) => <article key={label}><div><span>{label}</span><b className={String(tone)}>{tone === 'sage' ? <Users size={16}/> : tone === 'gold' ? <WalletCards size={16}/> : tone === 'blue' ? <Building2 size={16}/> : <CalendarDays size={16}/>}</b></div><strong>{value}</strong><small><i className="trend"><ArrowUpRight size={12}/></i>{detail}</small></article>)}</div>

          <div className="grid">
            <section className="card pipeline-card">
              <div className="card-head"><div><span>REVENUE &amp; CONVERSION</span><h2>{isFinance?'Payment movement':isOperations?'Operational workload':'Deal pipeline'}</h2></div><a href="#">View report <ChevronRight size={14}/></a></div>
              <div className="pipeline-summary"><div><small>PIPELINE / COLLECTION · INR</small><strong>{isFinance?'₹5,51,90,000':'₹7,35,00,000'}</strong></div><i/><div><small>OPEN ITEMS</small><strong>{isFinance?'43':'18'} <em>{isFinance?'invoices':'deals'}</em></strong></div><div className="bars"><b/><b/><b/><b/><b/><b/><b/><b/><b/><b/><b/><b/></div></div>
              <div className="deal-head"><span>CLIENT / PROPERTY</span><span>STATUS</span><span>VALUE · INR</span><span>PROGRESS</span></div>
              {[
                ['Ananya Mehta','Sea View 3 BHK · Bandra','Qualified','₹4,25,00,000','70'],
                ['Vikram Shah','Juhu Villa · Seller mandate','Negotiation','₹3,15,00,000','85'],
                ['Priya Iyer','Powai plot','Site visit','₹1,85,00,000','55'],
              ].map(row => <div className="deal-row" key={row[0]}><div className="client"><b>{row[0].split(' ').map(n=>n[0]).join('')}</b><div><strong>{row[0]}</strong><small>{row[1]}</small></div></div><span className="status">{row[2]}</span><strong className="amount">{row[3]}</strong><div className="progress"><i><b style={{width:`${row[4]}%`}}/></i><span>{row[4]}%</span></div></div>)}
            </section>

            <section className="card follow-card"><div className="card-head"><div><span>NEXT ACTIONS</span><h2>Follow-ups</h2></div><button><Plus size={16}/></button></div><div className="tasks">{followUps.map((task,index)=><div className="task" key={task[0]}><i className={task[3]==='High'?'high':''}/><div><strong>{task[0]}</strong><small>{task[1]}</small><em><CalendarDays size={11}/>{task[2]} · {task[3]}</em></div></div>)}</div><a className="card-link" href="#">View task list <ChevronRight size={14}/></a></section>

            <section className="card leads-card"><div className="card-head"><div><span>INBOUND &amp; ASSIGNMENT</span><h2>Recent leads</h2></div><b className="count">1,284</b></div><div className="lead-head"><span>CLIENT</span><span>SOURCE</span><span>STATUS</span><span>TIME</span></div>{leads.map(lead=><div className="lead-row" key={lead.name}><div><strong>{lead.name}</strong><small>{lead.property}</small></div><span>{lead.source}</span><b>{lead.status}</b><time>{lead.time}</time></div>)}</section>

            {isTeamRole && <section className="card team-card"><div className="card-head"><div><span>TEAM WORKLOAD</span><h2>{roleKey==='sales-manager'?'Sales team':'Branch performance'}</h2></div><b className="count">5 people</b></div>{[['Anita Joshi','23 assigned','78'],['Vikram Rao','18 assigned','71'],['Pooja Singh','31 assigned','64'],['Arjun Mehta','12 assigned','92']].map(row=><div className="team-row" key={row[0]}><b>{row[0].split(' ').map(n=>n[0]).join('')}</b><div><strong>{row[0]}</strong><small>{row[1]}</small></div><div className="team-bar"><i style={{width:`${row[2]}%`}}/></div><strong>{row[2]}%</strong></div>)}</section>}

            {isFinance && <section className="card team-card"><div className="card-head"><div><span>PAYMENT CONTROL</span><h2>Pending collections</h2></div><b className="count">7 overdue</b></div>{[['Ananya Mehta','₹25,00,000','Due today'],['Vikram Shah','₹18,50,000','2 days overdue'],['Kabir Malhotra','₹12,40,000','5 days overdue']].map(row=><div className="finance-row" key={row[0]}><b>{row[0].split(' ').map(n=>n[0]).join('')}</b><div><strong>{row[0]}</strong><small>{row[2]}</small></div><strong>{row[1]}</strong></div>)}</section>}

            {isOperations && <section className="card team-card"><div className="card-head"><div><span>WORKFLOW QUEUE</span><h2>{roleKey==='back-office'?'Documentation queue':'Active approvals'}</h2></div><b className="count">18 pending</b></div>{[['KYC verification','Kabir Malhotra','Today'],['Sale agreement','Ananya Mehta','Today'],['Registration file','Vikram Shah','Tomorrow'],['Property inspection','Priya Iyer','Friday']].map(row=><div className="finance-row" key={row[0]}><b><FileCheck2 size={14}/></b><div><strong>{row[0]}</strong><small>{row[1]}</small></div><strong>{row[2]}</strong></div>)}</section>}

            <section className="market-card"><div><span>LOCAL MARKET SNAPSHOT</span><h2>Know your<br/>neighbourhood.</h2><p>Insights for every location your clients ask about.</p><a href="#">Explore market insights <ChevronRight size={14}/></a></div><div className="illustration"><i/><b/><b/><b/><b/><em/></div></section>
            <section className="note-card"><div><CircleHelp size={16}/><span>GHARANA NOTE</span></div><p>Great service is remembered long after the keys are handed over.</p><small>A little reminder for today</small></section>
          </div>
        </div>
      </section>
    </main>
  )
}
