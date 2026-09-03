import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar'
import VideoSection from './VideoSection'

export default function Hero({ poster, location, mobileNav, onToggleMenu, onRequestLocation, onExplore }) {
  return <section className="hero" aria-label="Discover your next journey"><VideoSection poster={poster} /><div className="hero-shade" /><Navbar location={location} mobileNav={mobileNav} onToggleMenu={onToggleMenu} onRequestLocation={onRequestLocation} /><div className="hero-content"><p className="eyebrow light"><span /> Curated for the curious</p><h1>Go somewhere<br /><em>that stays with you.</em></h1><p className="hero-copy">A more considered way to travel. Find places with a pulse, plan with intention, and leave room for the unexpected.</p><div className="hero-ctas"><button className="button button-light" onClick={onExplore}>Explore destinations <ArrowRight size={17} /></button></div></div><div className="hero-bottom"><span>01 <i /> 04</span><span className="scroll-cue">Scroll to wander <ArrowRight size={15} /></span><span>© 2025 wayfarer studio</span></div></section>
}
