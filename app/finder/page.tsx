import Link from 'next/link'
import { ArrowUpRight, MapPin, Search } from 'lucide-react'
import './finder.css'

export const metadata = {
  title: 'Flat Finder | Gharana Realty',
  description: 'Explore apartment communities and compare homes on an interactive map.',
}

export default function FlatFinderPage() {
  return (
    <main className="finder-shell">
      <header className="finder-header">
        <Link className="finder-brand" href="/">
          <span className="finder-brand-mark">G</span>
          <span>GHARANA <small>REALTY PARTNERS</small></span>
        </Link>
        <div className="finder-location"><MapPin size={15}/> NCR HOME SEARCH</div>
        <a className="finder-open" href="https://flat-finder.pages.dev/?city=gurgaon" target="_blank" rel="noreferrer">
          Open Flat Finder <ArrowUpRight size={15}/>
        </a>
      </header>

      <section className="finder-intro">
        <div>
          <p className="finder-kicker">COMMUNITY DISCOVERY · POWERED BY FLAT FINDER</p>
          <h1>Find a home that fits.</h1>
          <p className="finder-description">Explore housing societies on a map, compare listings, and filter by budget, BHK, amenities, and more.</p>
        </div>
        <a className="finder-search-cta" href="https://flat-finder.pages.dev/?city=gurgaon" target="_blank" rel="noreferrer"><Search size={16}/> Start exploring</a>
      </section>

      <div className="finder-notice" role="note">
        <MapPin size={16}/>
        <span><strong>Current dataset: Gurugram.</strong> The upstream Flat Finder project currently publishes housing data for Gurugram; Delhi, Noida, Greater Noida, and Yamuna Expressway coverage is not included yet. The map can be opened full-screen if your browser blocks embedding.</span>
      </div>

      <section className="finder-frame-wrap" aria-label="Interactive housing map">
        <iframe
          className="finder-frame"
          src="https://flat-finder.pages.dev/?city=gurgaon"
          title="Flat Finder interactive housing map for Gurugram"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="fullscreen"
        />
        <div className="finder-frame-fallback">Map not loading? <a href="https://flat-finder.pages.dev/?city=gurgaon" target="_blank" rel="noreferrer">Open Flat Finder in a new tab <ArrowUpRight size={13}/></a></div>
      </section>

      <footer className="finder-footer">
        <span>Map, society data, and filters are provided by the Flat Finder project.</span>
        <a href="https://github.com/kairothq/flat-finder" target="_blank" rel="noreferrer">View source &amp; data coverage</a>
      </footer>
    </main>
  )
}
