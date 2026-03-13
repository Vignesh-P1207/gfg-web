import { useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Footer from '../components/Footer'

const coords = [
  { name: 'Alex Rivera', role: 'Chapter Lead', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA99aza8l6Hl-mv8u_SU6g6ATJD8oXb5vK1BwNH2EOOjcSI7uxW-h4LEIddxdrtT7aXKNMLaEFRwhbLiagvIhiaXMgprRwjrJYVAf6zqT2KOZSxVoEZbBcuUZNaBE64WAtlJWyiSoMLNMRl3nzFQFrZnSUrZHz6_u8Ni2VNKSZ8XLvuwOqoKxG3hB-fjp29z_xLI-nts5hbWdw9bhjBXddJXDNlj-YZnrsTbnPsRMqSBYNKFyiJ1dw_tMQaXUl5r62GNbuN0GGRg6c' },
  { name: 'Sarah Chen', role: 'Technical Head', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTM33IkqPGzZWv52vdeKtdy9BxnGI-oAAwv-oSJX1UrIW4w_Jyolup6hx2hoF47-0DkOpUgNgQh7cUSevEc-eHcdNQhdaz6n8T0cWGay0rsdS6EOB2c52dSd4UYKIno_FYTiHihXbNVydtGXDQUOHLfUT_5OZZ9X_0fbd76hMuB38Vm1Vrm-9oTxDGiO4b7QmY89w9qUGuktfnRy-LiXUJcs0sTQTtHqaAi2PQ7O99q3xbAXy74QycxDKCqMmMeEbYGsByr6QrJG8' },
  { name: 'David Park', role: 'Events Manager', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6ocdyXonPd5YpCeRn9qjxMCx9AxA48ws8O9KK5Ou-PFwuwE9aRPTkNaWB34QWRaSthuufKTvlxUwp74rDBlPt4cb1Ew2xtJF2ll4-3pU9Csr5pL9BEUqfzgdIEZtYhwpgcJsN63AF7_f967vjkqgdYu6PZv9Aa0u-QHvi6zEzZGgoGFKW4gOB02F1Nzt7KByYboDYEoB0Fr9j_xYq83Pth_DY5QxTZIIC-Q2VR-eu3VVWWTnKJRwZkNkxPl9dEV2qkPmC6TKU2sA' },
  { name: 'Elena Moretti', role: 'Outreach Lead', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBi0VPO5e0LHy5Ract929P2XYPAwWC-PeSFexK8y_sMPnuQxcIF5CFDKOW0S0XWRo6BIfTIXf0TC85EnDfTxUa84DvmHTnZkKUB5NzaE_IRvE_gdz6xbArRJhTFFapiFfp1pFRdpEUh9HiFBAMw-pFV8KIxPwZJCYvOQjWPE9ULA7N0DrSMRJv9znu-rnQZmuNMxFSqmdqUSFgYAFKeP0MgcTwEhlzMtUptDh7jmRcKraWD_u9hAIh4fH6DAN12yotKNx877ZpAQI' },
]

const objectives = [
  { icon: 'school', title: 'Skill Development', desc: 'Regular workshops on DSA, Web Dev, and AI/ML to stay ahead of the curve.' },
  { icon: 'groups', title: 'Networking', desc: 'Connect with alumni and industry professionals through guest lectures and meetups.' },
  { icon: 'workspace_premium', title: 'Competitions', desc: 'Monthly hackathons and coding contests to test and improve problem-solving skills.' },
]

// Custom images for the scatter gallery (generated earlier)
const galleryImages = [
  { id: 1, src: '/images/media__1773428577110.jpg', top: '15%', left: '10%', scale: 0.8, rotate: -10, depth: 0.2 },
  { id: 2, src: '/images/media__1773428577357.jpg', top: '45%', left: '75%', scale: 1.1, rotate: 12, depth: -0.15 },
  { id: 3, src: '/images/media__1773428577545.jpg', top: '65%', left: '15%', scale: 0.9, rotate: 5, depth: 0.1 },
  { id: 4, src: '/images/media__1773428577700.jpg', top: '20%', left: '60%', scale: 1.0, rotate: -5, depth: -0.25 },
]

function useCountUp(target, duration = 1800) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = target / (duration / 16)
      const timer = setInterval(() => {
        start += step
        if (start >= target) { start = target; clearInterval(timer) }
        el.textContent = Math.floor(start) + '+'
      }, 16)
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])
  return ref
}

function ScrubbedAbout() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // ── PHASE 1: Curved Scrolling Text (0 to 0.45) ──
  const textOffset = useTransform(smoothProgress, [0, 0.45], ["100%", "-200%"])
  const textOpacity = useTransform(smoothProgress, [0, 0.05, 0.4, 0.48], [0, 1, 1, 0])

  // ── PHASE 1.5: Transition Sentence (0.4 to 0.55) ──
  const introOpacity = useTransform(smoothProgress, [0.4, 0.45, 0.55], [0, 1, 0])

  // ── PHASE 2: Photo Scatter & Content (0.55 to 1.0) ──
  const scatterProgress = useTransform(smoothProgress, [0.55, 1], [0, 1])
  const contentOpacity = useTransform(smoothProgress, [0.65, 0.85], [0, 1])
  const contentY = useTransform(smoothProgress, [0.65, 0.85], [50, 0])

  return (
    <section ref={containerRef} className="relative h-[450vh] w-full bg-[#f6f8f6] dark:bg-[#141e16]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Layer 1: Curved Heading (Phase 1 Only) */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <svg viewBox="0 0 2000 400" className="w-[350%] md:w-[250%] h-auto overflow-visible">
            <path 
              id="curvePath" 
              d="M-1000,250 Q1000,-100 3000,250" 
              fill="transparent" 
            />
            <text className="font-classic text-[160px] font-black fill-[#2f8e47]/40 dark:fill-[#2f8e47]/50 uppercase italic tracking-wider">
              <motion.textPath href="#curvePath" style={{ fill: 'inherit' }} startOffset={textOffset}>
                 1 problem a day keeps joblessness away
              </motion.textPath>
            </text>
          </svg>
        </motion.div>

        {/* Layer 2: Intro Sentence (Phase 1.5 Only) */}
        <motion.div
           style={{ opacity: introOpacity }}
           className="absolute z-20 text-center px-6"
        >
          <h3 className="serif-headline text-4xl md:text-6xl text-[#032014] dark:text-white italic">
            "Once upon a line of code..."
          </h3>
        </motion.div>

        {/* Layer 3: Scatter Gallery (Phase 2 Only) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {galleryImages.map((img) => (
            <ScatterImage key={img.id} img={img} progress={scatterProgress} />
          ))}
        </div>

        {/* Layer 4: Final Content Focus (Phase 2 Only) */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-30 max-w-3xl px-6 text-center"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-[#2f8e47] mb-4">About the Chapter</p>
          <h2 className="serif-headline text-4xl md:text-6xl font-normal leading-tight text-slate-900 dark:text-white mb-6">
            A vibrant community of <span className="italic">passionate coders</span>
          </h2>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            We aim to bridge the gap between academic theory and industry requirements by providing a platform for students to practice coding, solve complex problems, and prepare for top-tier technical interviews.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#2f8e47]">500+</p>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mt-2">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#2f8e47]">40+</p>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mt-2">Events Yearly</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

function ScatterImage({ img, progress }) {
  // Each image moves at a slightly different speed based on its 'depth'
  const y = useTransform(progress, [0, 1], [0, img.depth * 1000])
  const rotate = useTransform(progress, [0, 1], [img.rotate, img.rotate + (img.depth * 50)])
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  return (
    <motion.div
      style={{
        top: img.top,
        left: img.left,
        y,
        rotate,
        opacity,
        scale: img.scale
      }}
      className="absolute w-48 md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl z-0"
    >
      <img src={img.src} alt="Club Life" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </motion.div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100">

      {/* ── Hero ── */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#032014] text-white py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a3a25_0%,_#032014_70%)] opacity-90" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="serif-headline text-6xl font-normal leading-[1.1] tracking-tight md:text-8xl lg:text-9xl mb-10">
            Building <br />
            <span className="block">Tomorrow's</span>
            <span className="block italic">Tech Leaders</span>
          </h1>
          <div className="mx-auto max-w-3xl">
            <p className="text-lg md:text-xl font-light text-slate-300/90 leading-relaxed">
              We invest in students when the curiosity speaks loudest — before the buzz and the metrics, when{' '}
              <span className="bg-[#d9f99d] text-[#032014] px-1 font-medium not-italic">
                the truest expression of potential is the craft itself.
              </span>
            </p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-[#032014] hover:bg-slate-100 transition-all shadow-xl"
            >
              Explore Workshops
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <button className="rounded-full border border-white/20 bg-transparent px-8 py-4 font-bold text-white backdrop-blur-sm hover:bg-white/10 transition-colors">
              Our Mission
            </button>
          </div>
        </div>
      </section>

      {/* ── Scrubbed About (MoMoney Style) ── */}
      <ScrubbedAbout />

      {/* ── Mission & Values ── */}
      <section className="bg-[#2f8e47]/5 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#2f8e47]">Mission &amp; Values</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Our Core Objectives</h2>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {objectives.map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -8 }}
                className="group rounded-2xl bg-white dark:bg-[#0d1a10] p-8 shadow-xl shadow-[#2f8e47]/5 transition-colors"
                viewport={{ once: true }}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#2f8e47]/10 text-[#2f8e47] group-hover:bg-[#2f8e47] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#2f8e47]">The Team</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Club Coordinators</h2>
          </div>
          <button className="flex items-center gap-2 font-bold text-[#2f8e47] hover:underline">
            View All Members <span className="material-symbols-outlined">north_east</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coords.map(({ name, role, img }) => (
            <motion.div
              key={name}
              whileHover={{ shadow: '0 20px 25px -5px rgb(47 142 71 / 0.1), 0 8px 10px -6px rgb(47 142 71 / 0.1)' }}
              className="group overflow-hidden rounded-2xl border border-[#2f8e47]/10 bg-white dark:bg-[#0d1a10] transition-shadow"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={img}
                  alt={name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
                <p className="text-sm font-medium text-[#2f8e47]">{role}</p>
                <div className="mt-4 flex gap-3 text-slate-400">
                  <span className="material-symbols-outlined cursor-pointer hover:text-[#2f8e47] transition-colors">alternate_email</span>
                  <span className="material-symbols-outlined cursor-pointer hover:text-[#2f8e47] transition-colors">share</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative bg-[#032014] py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#2f8e4733_0%,_transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="serif-headline text-5xl md:text-7xl font-normal text-white mb-6"
          >
            Ready to Level Up?
          </motion.h2>
          <p className="text-slate-300/80 text-lg mb-10 max-w-2xl mx-auto">
            Join 500+ students building careers in tech. Workshops, hackathons, mentorship — all in one community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/community"
              className="rounded-full bg-[#2f8e47] px-10 py-5 font-bold text-white hover:bg-[#267a3c] transition-all shadow-2xl shadow-[#2f8e47]/40"
            >
              Join the Chapter
            </Link>
            <Link
              to="/events"
              className="rounded-full border border-white/20 px-10 py-5 font-bold text-white hover:bg-white/10 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
