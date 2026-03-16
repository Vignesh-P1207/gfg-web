import { useState } from 'react'
import Footer from '../components/Footer'

const CATEGORIES = ['All', 'Paths', 'Videos', 'Cheat Sheets', 'Tools']

const resources = [
  // Paths
  { id: 1, type: 'Paths', icon: 'account_tree', color: 'bg-[#2f8e47]', title: 'Data Structures & Algorithms', desc: 'Arrays, Trees, Graphs, DP — the complete interview prep roadmap.', meta: '16 weeks · 64 lessons', level: 'Beginner → Pro', progress: 0, link: 'https://practice.geeksforgeeks.org/courses/dsa-self-paced' },
  { id: 2, type: 'Paths', icon: 'web', color: 'bg-blue-600', title: 'Full-Stack Web Development', desc: 'HTML, CSS, JS, React, Node.js, databases, and deployment.', meta: '12 weeks · 48 lessons', level: 'Intermediate', progress: 45, link: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
  
  // Videos
  { id: 3, type: 'Videos', icon: 'play_circle', color: 'bg-red-500', title: 'Dynamic Programming Masterclass', desc: 'Learn how to identify and solve DP problems with memoization and tabulation.', meta: '45 min · YouTube', img: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&q=80', link: 'https://www.youtube.com/watch?v=oBt53YbR9Kk' },
  { id: 4, type: 'Videos', icon: 'play_circle', color: 'bg-purple-500', title: 'System Design: Top 10 Patterns', desc: 'Key architectural patterns needed for L5/Senior SWE interviews.', meta: '1h 20m · YouTube', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80', link: 'https://www.youtube.com/watch?v=bUHFg8Cj-Ro' },
  
  // Cheat Sheets
  { id: 5, type: 'Cheat Sheets', icon: 'description', color: 'bg-amber-500', title: 'Big-O Time Complexity', desc: 'Quick reference for time and space complexities of all major data structures and algorithms.', meta: '1 page · PDF', downloadable: true, link: 'https://www.bigocheatsheet.com/' },
  { id: 6, type: 'Cheat Sheets', icon: 'description', color: 'bg-gray-600', title: 'Git & GitHub Essentials', desc: 'The most commonly used Git commands, branching strategies, and merge conflict resolution.', meta: '2 pages · PDF', downloadable: true, link: 'https://education.github.com/git-cheat-sheet-education.pdf' },
  { id: 7, type: 'Cheat Sheets', icon: 'description', color: 'bg-sky-500', title: 'PostgreSQL Quick Reference', desc: 'Essential SQL queries, joins, window functions, and indexing strategies.', meta: '1 page · PDF', downloadable: true, link: 'https://www.postgresqltutorial.com/postgresql-cheat-sheet/' },
  
  // Tools
  { id: 8, type: 'Tools', icon: 'build', color: 'bg-blue-400', title: 'VS Code Extensions for React', desc: 'Top 10 recommended extensions to speed up your React development workflow.', meta: 'Configuration', link: 'https://code.visualstudio.com/' },
  { id: 9, type: 'Tools', icon: 'palette', color: 'bg-pink-500', title: 'Color Palette Generators', desc: 'Curated list of the best tools for generating beautiful UI color schemes.', meta: 'Design Tools', link: 'https://coolors.co/' },
]

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [bookmarks, setBookmarks] = useState(new Set([2, 5])) // Initially bookmarked

  const handleBookmark = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = resources.filter(r => 
    (activeCategory === 'All' || activeCategory === 'Bookmarks' ? (activeCategory === 'Bookmarks' ? bookmarks.has(r.id) : true) : r.type === activeCategory) &&
    (r.title.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20">

      {/* Hero */}
      <section className="bg-[#032014] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2f8e47] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="mx-auto max-w-7xl relative z-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7]">DevEdu Hub</p>
          <h1 className="serif-headline text-5xl md:text-7xl font-normal mt-4 mb-6">Learning Resources</h1>
          <p className="text-slate-300/80 text-lg max-w-2xl mx-auto mb-10">Curated paths, video courses, downloadable cheat sheets, and essential tools to master modern technology.</p>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 max-w-2xl mx-auto shadow-2xl focus-within:border-[#a3e6b7] focus-within:bg-white/15 transition-all">
            <span className="material-symbols-outlined text-white/60 text-2xl">search</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/50 text-base focus:outline-none"
              placeholder="Search resource titles, descriptions, or tags..."
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-white/40 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Left Sidebar: Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#0d1a10] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">filter_alt</span> Categories
              </h3>
              
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeCategory === c ? 'bg-[#2f8e47] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">
                        {c === 'All' ? 'grid_view' : c === 'Paths' ? 'route' : c === 'Videos' ? 'smart_display' : c === 'Cheat Sheets' ? 'receipt_long' : 'handyman'}
                      </span>
                      {c}
                    </span>
                    {c !== 'All' && c !== 'Bookmarks' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === c ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'}`}>
                        {resources.filter(r => r.type === c).length}
                      </span>
                    )}
                  </button>
                ))}
                
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
                
                <button
                  onClick={() => setActiveCategory('Bookmarks')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeCategory === 'Bookmarks' ? 'bg-[#2f8e47] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-yellow-500">bookmark</span>
                    My Bookmarks
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === 'Bookmarks' ? 'bg-white/20' : 'bg-yellow-500/10 text-yellow-600'}`}>
                    {bookmarks.size}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Area: Results Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 text-slate-900 dark:text-white">
              <h2 className="text-2xl font-bold">{activeCategory} Resources</h2>
              <span className="text-sm text-slate-500 font-semibold">{filtered.length} found</span>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-[#0d1a10] border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 block">search_off</span>
                <h3 className="text-xl font-bold mb-2">No resources found</h3>
                <p className="text-slate-500">Try adjusting your search query or switching categories.</p>
                <button onClick={() => { setQuery(''); setActiveCategory('All'); }} className="mt-6 px-6 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(r => (
                  <div key={r.id} className="group flex flex-col bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all hover:border-[#2f8e47]/30">
                    
                    {/* Visual Header depending on type */}
                    {r.img ? (
                      <div className="h-40 relative">
                        <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all drop-shadow-lg">play_circle</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`h-2 relative bg-gradient-to-r ${r.color === 'bg-[#2f8e47]' ? 'from-[#032014] to-[#2f8e47]' : `from-slate-800 to-[${r.color.replace('bg-','')}]`}`}></div>
                    )}

                    <div className="p-6 flex flex-col flex-1 relative">
                      {/* Bookmark Toggle */}
                      <button 
                        onClick={(e) => handleBookmark(e, r.id)}
                        className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${bookmarks.has(r.id) ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: bookmarks.has(r.id) ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                      </button>

                      <div className="flex items-center gap-3 mb-4 pr-10">
                        {!r.img && (
                          <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center text-white flex-shrink-0 shadow-inner`}>
                            <span className="material-symbols-outlined textxl">{r.icon}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{r.type}</span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{r.title}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">{r.desc}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                        <span className="text-xs font-semibold text-slate-500">{r.meta}</span>
                        
                        {r.downloadable ? (
                          <a href={r.link} download target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[#2f8e47] bg-[#2f8e47]/10 hover:bg-[#2f8e47] hover:text-white px-4 py-2 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-[16px]">download</span> PDF
                          </a>
                        ) : r.type === 'Paths' ? (
                          <a href={r.link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-colors">
                            Launch Course <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>
                        ) : r.type === 'Videos' ? (
                          <a href={r.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600">
                            Watch Now <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                          </a>
                        ) : (
                          <a href={r.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-600">
                            Visit Site <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
