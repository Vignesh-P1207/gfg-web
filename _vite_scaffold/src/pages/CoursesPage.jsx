import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const CATEGORIES = ['All', 'DSA', 'Web Dev', 'AI/ML', 'System Design', 'DevOps', 'Mobile']

const COURSES = [
  {
    id: 'dsa-masterclass',
    category: 'DSA',
    title: 'DSA Complete Masterclass',
    subtitle: 'From zero to interview-ready',
    icon: 'account_tree',
    gradient: 'from-[#032014] to-[#2f8e47]',
    color: '#2f8e47',
    rating: 4.9,
    students: 1280,
    lessons: 64,
    hours: 48,
    level: 'Beginner → Advanced',
    instructor: 'Aryan Tiwari',
    featured: true,
    modules: [
      { title: 'Arrays & Strings', lessons: 8, duration: '6h' },
      { title: 'Linked Lists', lessons: 6, duration: '4h' },
      { title: 'Trees & Graphs', lessons: 10, duration: '8h' },
      { title: 'Dynamic Programming', lessons: 12, duration: '10h' },
      { title: 'Sorting & Searching', lessons: 6, duration: '4h' },
      { title: 'Greedy & Backtracking', lessons: 8, duration: '6h' },
      { title: 'Advanced Topics', lessons: 14, duration: '10h' },
    ],
    tags: ['Placement Prep', 'Interview Ready', 'Certificate'],
    desc: 'Master every data structure and algorithm with 500+ practice problems, video explanations, and mock interviews. Built for FAANG preparation.',
    externalLinks: [
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/courses/dsa-self-paced', icon: 'school', color: '#2f8d46' },
      { name: 'LeetCode', url: 'https://leetcode.com/problemset/', icon: 'code', color: '#ffa116' },
      { name: 'HackerRank', url: 'https://www.hackerrank.com/domains/data-structures', icon: 'terminal', color: '#1ba94c' },
    ],
  },
  {
    id: 'react-fullstack',
    category: 'Web Dev',
    title: 'React & Node.js Full Stack',
    subtitle: 'Build production-grade apps',
    icon: 'web',
    gradient: 'from-blue-900 to-blue-600',
    color: '#3b82f6',
    rating: 4.8,
    students: 920,
    lessons: 56,
    hours: 42,
    level: 'Intermediate',
    instructor: 'Sarah Chen',
    modules: [
      { title: 'React Fundamentals', lessons: 8, duration: '6h' },
      { title: 'Hooks & State Management', lessons: 8, duration: '6h' },
      { title: 'Node.js & Express', lessons: 10, duration: '8h' },
      { title: 'MongoDB & Databases', lessons: 8, duration: '6h' },
      { title: 'Authentication & Security', lessons: 6, duration: '4h' },
      { title: 'Deployment & DevOps', lessons: 8, duration: '6h' },
      { title: 'Capstone Project', lessons: 8, duration: '6h' },
    ],
    tags: ['Project Based', 'MERN Stack'],
    desc: 'End-to-end web development with React, Node.js, Express, and MongoDB. Build 5 real-world projects including an e-commerce platform.',
    externalLinks: [
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/courses/react-js', icon: 'school', color: '#2f8d46' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/', icon: 'volunteer_activism', color: '#0a0a23' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Learn', icon: 'menu_book', color: '#83d0f2' },
    ],
  },
  {
    id: 'ai-ml-deep',
    category: 'AI/ML',
    title: 'AI & Machine Learning Deep Dive',
    subtitle: 'Theory meets practice',
    icon: 'smart_toy',
    gradient: 'from-orange-900 to-orange-500',
    color: '#f97316',
    rating: 4.7,
    students: 640,
    lessons: 48,
    hours: 36,
    level: 'Intermediate',
    instructor: 'Dr. Priya Mehta',
    modules: [
      { title: 'Python for ML', lessons: 6, duration: '4h' },
      { title: 'Math & Statistics', lessons: 6, duration: '5h' },
      { title: 'Classical ML Algorithms', lessons: 8, duration: '6h' },
      { title: 'Neural Networks', lessons: 8, duration: '6h' },
      { title: 'Computer Vision (CNNs)', lessons: 6, duration: '5h' },
      { title: 'NLP & Transformers', lessons: 8, duration: '6h' },
      { title: 'MLOps & Deployment', lessons: 6, duration: '4h' },
    ],
    tags: ['TensorFlow', 'Research', 'Projects'],
    desc: 'From linear regression to transformers. Implement ML models from scratch, deploy them, and build a portfolio of AI projects.',
    externalLinks: [
      { name: 'Coursera ML', url: 'https://www.coursera.org/specializations/machine-learning-introduction', icon: 'school', color: '#0056d2' },
      { name: 'Kaggle', url: 'https://www.kaggle.com/learn', icon: 'analytics', color: '#20beff' },
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/courses/machine-learning', icon: 'school', color: '#2f8d46' },
    ],
  },
  {
    id: 'system-design',
    category: 'System Design',
    title: 'System Design for Interviews',
    subtitle: 'Ace the design round',
    icon: 'architecture',
    gradient: 'from-purple-900 to-purple-500',
    color: '#8b5cf6',
    rating: 4.9,
    students: 560,
    lessons: 32,
    hours: 24,
    level: 'Advanced',
    instructor: 'Rahul Kumar',
    modules: [
      { title: 'Fundamentals & Trade-offs', lessons: 4, duration: '3h' },
      { title: 'Load Balancing & Caching', lessons: 4, duration: '3h' },
      { title: 'Database Design', lessons: 6, duration: '5h' },
      { title: 'Microservices', lessons: 6, duration: '4h' },
      { title: 'Real-World Case Studies', lessons: 8, duration: '6h' },
      { title: 'Mock Design Interviews', lessons: 4, duration: '3h' },
    ],
    tags: ['FAANG Prep', 'Case Studies'],
    desc: 'Design scalable systems like URL shorteners, chat apps, and social media feeds. Includes mock interviews with FAANG engineers.',
    externalLinks: [
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/courses/system-design', icon: 'school', color: '#2f8d46' },
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', icon: 'hub', color: '#333' },
      { name: 'Gaurav Sen (YT)', url: 'https://www.youtube.com/@gaborsen', icon: 'play_circle', color: '#ff0000' },
    ],
  },
  {
    id: 'devops-cloud',
    category: 'DevOps',
    title: 'DevOps & Cloud Engineering',
    subtitle: 'AWS, Docker, Kubernetes',
    icon: 'cloud',
    gradient: 'from-cyan-900 to-cyan-500',
    color: '#06b6d4',
    rating: 4.6,
    students: 380,
    lessons: 40,
    hours: 30,
    level: 'Intermediate',
    instructor: 'David Park',
    modules: [
      { title: 'Linux & Networking', lessons: 6, duration: '4h' },
      { title: 'Docker & Containers', lessons: 6, duration: '5h' },
      { title: 'Kubernetes', lessons: 8, duration: '6h' },
      { title: 'AWS Core Services', lessons: 8, duration: '6h' },
      { title: 'CI/CD Pipelines', lessons: 6, duration: '5h' },
      { title: 'Infrastructure as Code', lessons: 6, duration: '4h' },
    ],
    tags: ['AWS', 'Kubernetes', 'Certification'],
    desc: 'Build, deploy, and manage cloud infrastructure. Covers Docker, Kubernetes, Terraform, CI/CD, and AWS Solutions Architect prep.',
    externalLinks: [
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/courses/devops', icon: 'school', color: '#2f8d46' },
      { name: 'Docker Docs', url: 'https://docs.docker.com/get-started/', icon: 'deployed_code', color: '#2496ed' },
      { name: 'AWS Training', url: 'https://explore.skillbuilder.aws/learn', icon: 'cloud', color: '#ff9900' },
    ],
  },
  {
    id: 'flutter-mobile',
    category: 'Mobile',
    title: 'Flutter Mobile Development',
    subtitle: 'Cross-platform mastery',
    icon: 'phone_android',
    gradient: 'from-sky-900 to-sky-500',
    color: '#0ea5e9',
    rating: 4.7,
    students: 310,
    lessons: 36,
    hours: 28,
    level: 'Beginner',
    instructor: 'Elena Moretti',
    modules: [
      { title: 'Dart Fundamentals', lessons: 6, duration: '4h' },
      { title: 'Flutter Widgets', lessons: 6, duration: '5h' },
      { title: 'State Management', lessons: 6, duration: '5h' },
      { title: 'Firebase & Backend', lessons: 6, duration: '5h' },
      { title: 'Animations & UI', lessons: 6, duration: '4h' },
      { title: 'Publishing Apps', lessons: 6, duration: '5h' },
    ],
    tags: ['iOS', 'Android', 'Firebase'],
    desc: 'Build beautiful, performant iOS and Android apps with Flutter. Includes Firebase integration, state management, and app store publishing.',
    externalLinks: [
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/courses/flutter', icon: 'school', color: '#2f8d46' },
      { name: 'Flutter.dev', url: 'https://flutter.dev/learn', icon: 'phone_android', color: '#02569b' },
      { name: 'Dart.dev', url: 'https://dart.dev/tutorials', icon: 'code', color: '#0175c2' },
    ],
  },
]

const EXTERNAL_PLATFORMS = [
  { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/', desc: 'Comprehensive DSA courses, tutorials, and practice problems', color: '#2f8d46', icon: 'school' },
  { name: 'LeetCode', url: 'https://leetcode.com/', desc: 'Coding challenges for interview prep with contest rankings', color: '#ffa116', icon: 'code' },
  { name: 'HackerRank', url: 'https://www.hackerrank.com/', desc: 'Skill-based coding tests and developer certifications', color: '#1ba94c', icon: 'terminal' },
  { name: 'Coursera', url: 'https://www.coursera.org/', desc: 'University-level courses from Stanford, MIT, and more', color: '#0056d2', icon: 'menu_book' },
  { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', desc: 'Free full-stack web development curriculum', color: '#0a0a23', icon: 'volunteer_activism' },
  { name: 'Kaggle', url: 'https://www.kaggle.com/', desc: 'Data science competitions and machine learning datasets', color: '#20beff', icon: 'analytics' },
]

export default function CoursesPage() {
  const [active, setActive] = useState('All')
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [showLinks, setShowLinks] = useState(null)

  const filtered = COURSES.filter(c => active === 'All' || c.category === active)

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20 min-h-screen">

      {/* Hero */}
      <section className="bg-[#032014] text-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7]">Skill Development Hub</p>
          <h1 className="serif-headline text-5xl md:text-7xl font-normal mt-4 mb-6">Courses & Training</h1>
          <p className="text-slate-300/80 text-lg max-w-xl mb-8">Industry-aligned courses with hands-on projects, expert instructors, and completion certificates.</p>
          <div className="flex gap-3 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold border transition-all ${
                  active === cat
                    ? 'bg-[#2f8e47] border-[#2f8e47] text-white'
                    : 'border-white/20 text-white/70 hover:border-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-6 mt-8 text-sm text-slate-300/70">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[#2f8e47] text-base">school</span> 6 Courses</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[#2f8e47] text-base">people</span> 4,090+ Students</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[#2f8e47] text-base">schedule</span> 208+ Hours</span>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(course => (
            <div key={course.id} className={`group relative flex flex-col bg-white dark:bg-[#0d1a10] border rounded-3xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl ${course.featured ? 'border-[#2f8e47]/40 shadow-lg shadow-[#2f8e47]/10' : 'border-slate-200 dark:border-slate-800'}`}>
              {course.featured && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-[#2f8e47] px-3 py-1 text-white text-xs font-bold shadow-lg">
                  <span className="material-symbols-outlined text-sm">star</span> Most Popular
                </div>
              )}
              {/* Header gradient */}
              <div className={`bg-gradient-to-br ${course.gradient} h-40 flex items-center justify-center relative`}>
                <span className="material-symbols-outlined text-white/30 text-7xl">{course.icon}</span>
                <div className="absolute bottom-4 left-5">
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 border border-white/20 backdrop-blur-sm bg-white/10">
                    {course.category}
                  </span>
                </div>
              </div>
              {/* Body */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{course.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{course.subtitle}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{course.desc}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-yellow-500">star</span>{course.rating}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">people</span>{course.students.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{course.hours}h</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">menu_book</span>{course.lessons} lessons</span>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {course.tags.map(t => (
                    <span key={t} className="rounded-full bg-[#2f8e47]/10 text-[#2f8e47] text-[10px] font-bold px-2.5 py-0.5 border border-[#2f8e47]/20">{t}</span>
                  ))}
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 mt-1 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: course.color }}>
                    {course.instructor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">by <strong className="text-slate-700 dark:text-slate-200">{course.instructor}</strong></span>
                  <span className="text-[10px] rounded-full bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-slate-500 ml-auto">{course.level}</span>
                </div>

                {/* Expand modules */}
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="text-xs font-bold text-[#2f8e47] hover:underline mt-2 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">{expandedCourse === course.id ? 'expand_less' : 'expand_more'}</span>
                  {expandedCourse === course.id ? 'Hide' : 'View'} Curriculum ({course.modules.length} modules)
                </button>

                {expandedCourse === course.id && (
                  <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 flex flex-col gap-2 mt-1 border border-slate-100 dark:border-white/5">
                    {course.modules.map((mod, i) => (
                      <div key={mod.title} className="flex items-center gap-3 text-xs">
                        <span className="w-5 h-5 rounded-full bg-[#2f8e47]/15 text-[#2f8e47] flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                        <span className="flex-1 text-slate-700 dark:text-slate-300 font-medium">{mod.title}</span>
                        <span className="text-slate-400">{mod.lessons} lessons · {mod.duration}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Buttons - External Links */}
                <div className="flex flex-col gap-2 mt-auto pt-3">
                  <a
                    href={course.externalLinks[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full bg-[#2f8e47] text-white text-xs font-bold py-2.5 hover:bg-[#267a3c] transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Start Learning on {course.externalLinks[0].name}
                  </a>
                  <div className="flex gap-2">
                    {course.externalLinks.slice(1).map(link => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-full border border-slate-200 dark:border-white/10 text-xs font-bold py-2 px-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300 text-center flex items-center justify-center gap-1.5"
                        title={`Open ${link.name}`}
                      >
                        <span className="material-symbols-outlined text-sm" style={{ color: link.color }}>{link.icon}</span>
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* All External Links Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowLinks(showLinks === course.id ? null : course.id)}
                    className="text-[10px] font-bold text-slate-400 hover:text-[#2f8e47] transition-colors flex items-center gap-1 w-full justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">{showLinks === course.id ? 'expand_less' : 'link'}</span>
                    {showLinks === course.id ? 'Hide' : 'View All'} Learning Resources
                  </button>
                  {showLinks === course.id && (
                    <div className="mt-2 bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5 flex flex-col gap-1.5">
                      {course.externalLinks.map(link => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors group/link"
                        >
                          <span className="material-symbols-outlined text-base" style={{ color: link.color }}>{link.icon}</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-1">{link.name}</span>
                          <span className="material-symbols-outlined text-sm text-slate-300 group-hover/link:text-[#2f8e47] transition-colors">arrow_outward</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
            <p>No courses found in "{active}" category.</p>
          </div>
        )}
      </section>

      {/* External Platforms Section */}
      <section className="bg-white dark:bg-[#0d170e] py-16 px-6 border-y border-slate-100 dark:border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-[#2f8e47] mb-2">Learn Anywhere</p>
            <h2 className="serif-headline text-3xl md:text-4xl font-normal mb-4">Explore Top Learning Platforms</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">We curate the best courses from leading platforms so you never miss a learning opportunity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXTERNAL_PLATFORMS.map(plat => (
              <a
                key={plat.name}
                href={plat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-[#2f8e47]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all bg-slate-50/50 dark:bg-white/[0.02]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${plat.color}15` }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: plat.color }}>{plat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{plat.name}</h4>
                    <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-[#2f8e47] transition-colors">arrow_outward</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{plat.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why our courses + DSA Practice CTA */}
      <section className="bg-[#032014] py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="serif-headline text-4xl md:text-5xl font-normal text-white mb-4">Why Learn With Us?</h2>
            <p className="text-slate-300/70 max-w-2xl mx-auto">Our courses are designed by industry professionals and top competitive programmers to give you real-world skills.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: 'code', title: 'Hands-On Practice', desc: '500+ coding problems with interactive editor and test cases' },
              { icon: 'workspace_premium', title: 'Certificates', desc: 'Earn recognized completion certificates for your portfolio' },
              { icon: 'group', title: 'Community Support', desc: 'Discussion forums, study groups, and peer mentorship' },
              { icon: 'trending_up', title: 'Career Tracking', desc: 'Track your progress, XP, and interview readiness score' },
            ].map(f => (
              <div key={f.title} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="material-symbols-outlined text-[#2f8e47] text-4xl mb-4 block">{f.icon}</span>
                <h4 className="font-bold text-white mb-2">{f.title}</h4>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          
          {/* DSA Practice CTA */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#2f8e47] to-[#0a4a24] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="flex-1 relative z-10">
              <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7] mb-2">New Feature</p>
              <h3 className="text-3xl font-bold mb-3">Interactive Code Runner</h3>
              <p className="text-white/70 max-w-lg">Solve 200+ curated LeetCode-style problems with our built-in interactive compiler. Write, run, and test your code in real-time.</p>
            </div>
            <Link to="/practice" className="relative z-10 rounded-full bg-white text-[#032014] font-bold px-8 py-4 hover:bg-slate-100 transition-colors shadow-xl whitespace-nowrap flex items-center gap-2">
              <span className="material-symbols-outlined">code</span> Start Practicing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
