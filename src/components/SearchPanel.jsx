import { Search } from 'lucide-react'

export default function SearchPanel({ query, category, categories, onQueryChange, onCategoryChange }) {
  return <div className="explorer-toolbar"><div className="search"><Search size={18} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search destinations" aria-label="Search destinations" /></div><div className="filters">{categories.map((filter) => <button key={filter} className={`filter ${category === filter ? 'active' : ''}`} onClick={() => onCategoryChange(filter)}>{filter}</button>)}</div></div>
}
