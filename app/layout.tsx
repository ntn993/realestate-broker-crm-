import type { Metadata } from 'next'
import './globals.css'
import './dashboard-roles.css'

export const metadata: Metadata = {
  title: 'Gharana Realty CRM',
  description: 'Role-based CRM for Indian real estate brokerages',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-IN"><body>{children}</body></html>
}
