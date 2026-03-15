import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || 'Vignesh',
    email: user?.email || 'vignesh@example.com',
    branch: user?.branch || 'Computer Science',
    year: user?.year || '3rd Year',
    notifications: true,
    darkMode: true,
  })

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] min-h-screen text-slate-900 dark:text-slate-100 pt-20">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="serif-headline text-4xl md:text-5xl font-normal mb-10">Account Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Nav */}
          <div className="col-span-1 flex flex-col gap-2">
            {[
              { icon: 'person', label: 'Profile Information', active: true },
              { icon: 'notifications', label: 'Notifications', active: false },
              { icon: 'shield', label: 'Security & Privacy', active: false },
              { icon: 'settings', label: 'Preferences', active: false },
              { icon: 'help', label: 'Help & Support', active: false },
            ].map(item => (
              <button key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-[#2f8e47] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="col-span-2 bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Profile Information</h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2f8e47] to-[#032014] flex items-center justify-center text-white font-bold text-2xl">
                  {formData.name.charAt(0)}
                </div>
                <div className="flex flex-col gap-2">
                  <button className="text-xs font-bold text-[#2f8e47] uppercase tracking-wider hover:underline">Change Avatar</button>
                  <p className="text-[10px] text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2f8e47]/30 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2f8e47]/30 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Branch</label>
                  <input className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2f8e47]/30 outline-none" value={formData.branch} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                  <input className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2f8e47]/30 outline-none" value={formData.year} />
                </div>
              </div>

              <div className="flex justify-end pt-4 gap-4">
                <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#2f8e47] text-white hover:bg-[#267a3c] transition-colors shadow-lg shadow-[#2f8e47]/20">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
