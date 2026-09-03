import { ChevronDown, MapPin, Menu, X } from 'lucide-react'

export default function Navbar({ location, mobileNav, onToggleMenu, onRequestLocation }) {
  return <header className="nav"><a className="brand" href="#top"><span className="brand-mark">✦</span> wayfarer</a><nav className={mobileNav ? 'nav-links open' : 'nav-links'}><a href="#explore">Explore</a><a href="#places">Places</a><a href="#journal">Journal</a></nav><div className="nav-actions"><button className="location-pill" onClick={onRequestLocation} aria-label="Set your location"><MapPin size={15} /> {location} <ChevronDown size={14} /></button><button className="icon-button menu-button" onClick={onToggleMenu} aria-label="Toggle menu">{mobileNav ? <X size={20} /> : <Menu size={20} />}</button></div></header>
}
