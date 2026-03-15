import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useTransform, useSpring } from 'framer-motion'
import Footer from '../components/Footer'
import SpotlightCard from '../components/SpotlightCard'
import TiltedCard from '../components/TiltedCard'

/**
 * Text starts WHITE (matching surrounding hero text).
 * The moment the user scrolls, a yellow highlight sweeps left→right
 * using clip-path, simultaneously revealing dark text on yellow beneath.
 */
function HighlightText({ children, color = '#d9f99d', delay = 0.15 }) {
  const { scrollY } = useScroll()
  const [triggered, setTriggered] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 20 && !triggered) {
      setTriggered(true)
    }
  })

  return (
    <span className="relative inline-block align-baseline">
      {/* Layer 1: white text — always visible as the base */}
      <span className="relative text-white font-medium not-italic px-1">
        {children}
      </span>

      {/* Layer 2: yellow bar + dark text, clipped to reveal left→right */}
      <motion.span
        className="absolute inset-0 font-medium not-italic px-1 overflow-hidden whitespace-nowrap"
        style={{ background: color, color: '#032014' }}
        initial={{ clipPath: 'inset(0 100% 0 0 round 2px)' }}
        animate={triggered ? { clipPath: 'inset(0 0% 0 0 round 2px)' } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

const coords = [
  { name: 'Alex Rivera', role: 'Chapter Lead', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA99aza8l6Hl-mv8u_SU6g6ATJD8oXb5vK1BwNH2EOOjcSI7uxW-h4LEIddxdrtT7aXKNMLaEFRwhbLiagvIhiaXMgprRwjrJYVAf6zqT2KOZSxVoEZbBcuUZNaBE64WAtlJWyiSoMLNMRl3nzFQFrZnSUrZHz6_u8Ni2VNKSZ8XLvuwOqoKxG3hB-fjp29z_xLI-nts5hbWdw9bhjBXddJXDNlj-YZnrsTbnPsRMqSBYNKFyiJ1dw_tMQaXUl5r62GNbuN0GGRg6c' },
  { name: 'Sarah Chen', role: 'Technical Head', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTM33IkqPGzZWv52vdeKtdy9BxnGI-oAAwv-oSJX1UrIW4w_Jyolup6hx2hoF47-0DkOpUgNgQh7cUSevEc-eHcdNQhdaz6n8T0cWGay0rsdS6EOB2c52dSd4UYKIno_FYTiHihXbNVydtGXDQUOHLfUT_5OZZ9X_0fbd76hMuB38Vm1Vrm-9oTxDGiO4b7QmY89w9qUGuktfnRy-LiXUJcs0sTQTtHqaAi2PQ7O99q3xbAXy74QycxDKCqMmMeEbYGsByr6QrJG8' },
  { name: 'David Park', role: 'Events Manager', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6ocdyXonPd5YpCeRn9qjxMCx9AxA48ws8O9KK5Ou-PFwuwE9aRPTkNaWB34QWRaSthuufKTvlxUwp74rDBlPt4cb1Ew2xtJF2ll4-3pU9Csr5pL9BEUqfzgdIEZtYhwpgcJsN63AF7_f967vjkqgdYu6PZv9Aa0u-QHvi6zEzZGgoGFKW4gOB02F1Nzt7KByYboDYEoB0Fr9j_xYq83Pth_DY5QxTZIIC-Q2VR-eu3VVWWTnKJRwZkNkxPl9dEV2qkPmC6TKU2sA' },
  { name: 'Elena Moretti', role: 'Outreach Lead', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBi0VPO5e0LHy5Ract929P2XYPAwWC-PeSFexK8y_sMPnuQxcIF5CFDKOW0S0XWRo6BIfTIXf0TC85EnDfTxUa84DvmHTnZkKUB5NzaE_IRvE_gdz6xbArRJhTFFapiFfp1pFRdpEUh9HiFBAMw-pFV8KIxPwZJCYvOQjWPE9ULA7N0DrSMRJv9znu-rnQZmuNMxFSqmdqUSFgYAFKeP0MgcTwEhlzMtUptDh7jmRcKraWD_u9hAIh4fH6DAN12yotKNx877ZpAQI' },
]

const objectives = [
  { icon: 'school', title: 'Skill Development', desc: 'Regular workshops on DSA, Web Dev, and AI/ML to stay ahead of the curve.', link: 'Explore Workshops', href: '/workshops' },
  { icon: 'groups', title: 'Networking', desc: 'Connect with alumni and industry professionals through guest lectures and meetups.', link: 'Meet the Community', href: '/community' },
  { icon: 'workspace_premium', title: 'Competitions', desc: 'Monthly hackathons and coding contests to test and improve problem-solving skills.', link: 'View Events', href: '/events' },
]

// Custom images for the scatter gallery (generated earlier)
const galleryImages = [
  { id: 1, src: '/images/media__1773428577110.jpg', top: '15%', left: '10%', scale: 0.8, rotate: -10, depth: 0.2 },
  { id: 2, src: '/images/media__1773428577357.jpg', top: '45%', left: '75%', scale: 1.1, rotate: 12, depth: -0.15 },
  { id: 3, src: '/images/media__1773428577545.jpg', top: '65%', left: '15%', scale: 0.9, rotate: 5, depth: 0.1 },
  { id: 4, src: '/images/media__1773428577700.jpg', top: '20%', left: '60%', scale: 1.0, rotate: -5, depth: -0.25 },
]



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

// Floating icons for hero background
const floatingItems = [
  // books
  { icon: 'menu_book',    x: '8%',  y: '15%', size: 38, dur: 18, delay: 0,    rot: 15  },
  { icon: 'menu_book',    x: '82%', y: '70%', size: 28, dur: 22, delay: 3,    rot: -20 },
  { icon: 'menu_book',    x: '55%', y: '10%', size: 32, dur: 20, delay: 7,    rot: 8   },
  { icon: 'auto_stories', x: '20%', y: '75%', size: 34, dur: 25, delay: 1.5,  rot: -12 },
  { icon: 'auto_stories', x: '70%', y: '25%', size: 26, dur: 19, delay: 5,    rot: 25  },
  // pens
  { icon: 'edit',         x: '35%', y: '80%', size: 30, dur: 16, delay: 2,    rot: -30 },
  { icon: 'edit',         x: '90%', y: '40%', size: 24, dur: 21, delay: 8,    rot: 18  },
  { icon: 'draw',         x: '5%',  y: '55%', size: 28, dur: 23, delay: 4,    rot: -8  },
  { icon: 'draw',         x: '60%', y: '88%', size: 22, dur: 17, delay: 6,    rot: 35  },
  // pencils
  { icon: 'stylus',       x: '45%', y: '5%',  size: 32, dur: 24, delay: 0.5,  rot: -22 },
  { icon: 'stylus',       x: '15%', y: '40%', size: 26, dur: 20, delay: 9,    rot: 12  },
  { icon: 'border_color', x: '75%', y: '55%', size: 30, dur: 18, delay: 3.5,  rot: -15 },
  { icon: 'border_color', x: '92%', y: '12%', size: 24, dur: 26, delay: 11,   rot: 28  },
]

function FloatingBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {floatingItems.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
            animation: `floatIcon ${item.dur}s ease-in-out ${item.delay}s infinite alternate`,
          }}
        >
          <span
            className="material-symbols-outlined select-none"
            style={{
              fontSize: item.size,
              color: 'rgba(163, 230, 183, 0.18)',
              display: 'block',
              animation: `spinIcon ${item.dur * 1.4}s linear ${item.delay}s infinite`,
              transform: `rotate(${item.rot}deg)`,
            }}
          >
            {item.icon}
          </span>
        </div>
      ))}
      <style>{`
        @keyframes floatIcon {
          from { transform: translateY(0px) translateX(0px); }
          to   { transform: translateY(-28px) translateX(10px); }
        }
        @keyframes spinIcon {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const ROLES = ['Frontend Dev', 'Backend Dev', 'ML Engineer', 'DSA Lead', 'DevOps', 'UI/UX Designer', 'Blockchain Dev', 'Cloud Architect', 'Mobile Dev', 'Cybersecurity']
const COLORS = ['#2f8e47','#3b82f6','#f97316','#8b5cf6','#ef4444','#eab308','#06b6d4','#ec4899','#14b8a6','#a855f7']
const ALL_MEMBERS = [
  'Aarav Sharma','Aditi Verma','Akash Patel','Ananya Singh','Arjun Nair',
  'Bhavya Reddy','Chirag Mehta','Deepika Iyer','Dhruv Gupta','Divya Pillai',
  'Eshan Joshi','Farhan Khan','Gayatri Rao','Harsh Agarwal','Ishaan Malhotra',
  'Jaya Krishnan','Kabir Saxena','Kavya Menon','Kiran Desai','Kunal Bose',
  'Lakshmi Nair','Manav Tiwari','Meera Choudhary','Mihir Shah','Mira Kapoor',
  'Nandini Shetty','Nikhil Pandey','Nisha Bajaj','Om Prakash','Pallavi Jain',
  'Parth Trivedi','Pooja Mishra','Pranav Kulkarni','Priya Subramaniam','Rahul Dubey',
  'Riya Chatterjee','Rohan Banerjee','Rohit Yadav','Ruchi Agarwal','Sachin Patil',
  'Sahil Mathur','Sakshi Garg','Sameer Qureshi','Sanvi Hegde','Saurabh Tiwari',
  'Shivani Rajan','Shreya Nambiar','Siddharth Kaur','Simran Oberoi','Sneha Pillai',
  'Soham Dey','Srishti Bhatt','Suraj Venkat','Swati Dixit','Tanvi Ghosh',
  'Tarun Ahuja','Uday Shankar','Urvashi Pande','Vaibhav Sinha','Vandana Murthy',
  'Varun Chandra','Vidya Prasad','Vikram Sethi','Vinay Nambiar','Vishal Rawat',
  'Yash Goyal','Yashasvi Rao','Zara Ahmed','Aditya Kumar','Alok Misra',
  'Amrita Bose','Ankit Verma','Ankita Sharma','Arnav Joshi','Arun Pillai',
  'Ashish Gupta','Avni Mehta','Ayush Patel','Bharat Singh','Chetan Reddy',
  'Disha Iyer','Gaurav Nair','Harini Krishnan','Hemant Saxena','Isha Menon',
  'Jatin Desai','Kartik Bose','Keerthi Nair','Kriti Tiwari','Lokesh Shah',
  'Madhuri Kapoor','Manisha Shetty','Mohit Pandey','Namrata Bajaj','Naveen Prakash',
].map((name, i) => ({ name, role: ROLES[i % ROLES.length], color: COLORS[i % COLORS.length] }))

export default function HomePage() {
  const [missionOpen, setMissionOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)

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
        <FloatingBg />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="serif-headline text-6xl font-normal leading-[1.1] tracking-tight md:text-8xl lg:text-9xl mb-10">
            Building <br />
            <span className="block">Tomorrow's</span>
            <span className="block italic">Tech Leaders</span>
          </h1>
          <div className="mx-auto max-w-3xl">
            <p className="text-lg md:text-xl font-light text-slate-300/90 leading-relaxed">
              We invest in students when the curiosity speaks loudest — before the buzz and the metrics, when{' '}
              <HighlightText color="#d9f99d" delay={0.4}>
                the truest expression of potential is the craft itself.
              </HighlightText>
            </p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/workshops"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-[#032014] hover:bg-slate-100 transition-all shadow-xl"
            >
              Explore Workshops
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <button
              onClick={() => setMissionOpen(true)}
              className="rounded-full border border-white/20 bg-transparent px-8 py-4 font-bold text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              Our Mission
            </button>
          </div>
        </div>

        {/* ── Mission Modal ── */}
        <AnimatePresence>
          {missionOpen && (
            <motion.div
              className="absolute inset-0 z-[100] flex items-start justify-center p-4 pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMissionOpen(false)}
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
              <motion.div
                className="relative bg-[#0b1f12] border border-[#2f8e47]/30 rounded-3xl p-6 max-w-xl w-full shadow-2xl mt-8"
                initial={{ opacity: 0, scale: 0.93, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
              >
              <button
                onClick={() => setMissionOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-white text-base">close</span>
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#2f8e47] text-base">flag</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#a3e6b7]">Our Mission</span>
              </div>

              <h2 className="serif-headline text-2xl md:text-3xl font-normal text-white leading-snug mb-2">
                Empowering the Next Generation of Tech Talent
              </h2>

              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Bridging classroom learning and industry demands — giving every student the skills, mentorship, and community to land their dream tech role.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { icon: 'school',        title: 'Industry-Ready Skills',      desc: 'Roadmaps built around what top companies hire for.' },
                  { icon: 'work',          title: 'Job Readiness',              desc: 'Mock interviews, resume workshops & placement drives.' },
                  { icon: 'groups',        title: 'Peer-Driven Growth',         desc: 'Hackathons, study groups & collaborative projects.' },
                  { icon: 'rocket_launch', title: 'Future-Proof Careers',       desc: 'AI, Blockchain, Cloud — always ahead of the curve.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="material-symbols-outlined text-[#2f8e47] text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-xs mb-0.5">{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 italic text-xs border-l-2 border-[#2f8e47] pl-3 mb-4">
                "We don't just teach code — we build engineers who think, create, and lead."
              </p>

              <div className="flex gap-2">
                <Link to="/workshops" onClick={() => setMissionOpen(false)}
                  className="flex-1 text-center rounded-full bg-[#2f8e47] text-white font-bold px-4 py-2.5 text-xs hover:bg-[#267a3c] transition-colors">
                  Explore Roadmaps
                </Link>
                <Link to="/community" onClick={() => setMissionOpen(false)}
                  className="flex-1 text-center rounded-full border border-white/20 text-white font-bold px-4 py-2.5 text-xs hover:bg-white/10 transition-colors">
                  Join Chapter
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </section>

      {/* ── Scrubbed About (MoMoney Style) ── */}
      <ScrubbedAbout />

      {/* ── Mission & Values ── */}
      <section className="bg-[#0b1510] py-28">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="font-sc text-sm tracking-[0.3em] text-[#2f8e47] mb-3">Mission &amp; Values</p>
            <h2 className="font-sc text-5xl font-semibold text-white md:text-6xl">Our Core Objectives</h2>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {objectives.map(({ icon, title, desc, link, href }) => (
              <SpotlightCard
                key={title}
                spotlightColor="rgba(47, 142, 71, 0.18)"
              >
                {/* Icon pill — top left */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2f8e47]/15 text-[#4ade80] mb-8">
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                {/* Text content */}
                <h3 className="font-sc text-2xl font-semibold text-white mb-3 leading-snug">{title}</h3>
                <p className="font-garamond text-[#8aab92] leading-relaxed mb-8">{desc}</p>
                {/* Learn more link */}
                <Link to={href} className="font-garamond italic text-base text-[#4ade80]/80 underline underline-offset-4 decoration-[#2f8e47]/50 hover:text-[#4ade80] hover:decoration-[#4ade80] transition-all">
                  {link}
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-[#0b1510] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-14">
            <div>
              <p className="font-sc text-xs tracking-[0.3em] text-[#2f8e47] mb-2">The Team</p>
              <h2 className="font-sc text-4xl font-semibold text-white">Club Coordinators</h2>
            </div>
            <button
              onClick={() => setMembersOpen(true)}
              className="flex items-center gap-2 font-garamond italic text-[#4ade80]/80 hover:text-[#4ade80] underline underline-offset-4 decoration-[#2f8e47]/50 transition-all">
              View All Members <span className="material-symbols-outlined text-base not-italic">north_east</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {coords.map(({ name, role, img }, i) => (
              <div key={name} className="flex flex-col items-center gap-4">
                {/* TiltedCard image */}
                <TiltedCard
                  imageSrc={img}
                  altText={name}
                  captionText={`${name} — ${role}`}
                  containerHeight="260px"
                  containerWidth="100%"
                  imageHeight="260px"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip
                  displayOverlayContent
                  overlayContent={
                    <span className="font-sc text-sm font-semibold text-white bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                      {role}
                    </span>
                  }
                />
                {/* Info below card — blur-in on scroll */}
                <motion.div
                  className="w-full px-1"
                  initial={{ opacity: 0, filter: 'blur(14px)', y: 8 }}
                  whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  viewport={{ amount: 0.6 }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: i * 0.12 }}
                >
                  <h3 className="font-sc text-lg font-semibold text-white leading-tight">{name}</h3>
                  <p className="font-garamond text-sm text-[#2f8e47] mt-0.5">{role}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative bg-[#032014] py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#2f8e4733_0%,_transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, filter: 'blur(18px)', y: 12 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0 }}
            className="serif-headline text-5xl md:text-7xl font-normal text-white mb-6"
          >
            Ready to Level Up?
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, filter: 'blur(14px)', y: 10 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.25 }}
            className="text-slate-300/80 text-lg mb-10 max-w-2xl mx-auto"
          >
            Join 500+ students building careers in tech. Workshops, hackathons, mentorship — all in one community.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(12px)', y: 8 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
          </motion.div>

        </div>
      </section>

      {/* ── All Members Modal ── */}
      <AnimatePresence>
        {membersOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMembersOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              className="relative bg-[#0b1f12] border border-[#2f8e47]/30 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl"
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 flex-shrink-0">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#a3e6b7]">The Team</p>
                  <h2 className="font-sc text-2xl text-white mt-0.5">All Members <span className="text-[#2f8e47]">· 100</span></h2>
                </div>
                <button
                  onClick={() => setMembersOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-white text-lg">close</span>
                </button>
              </div>
              {/* scrollable grid */}
              <div className="overflow-y-auto p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {ALL_MEMBERS.map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#2f8e47]/40 transition-colors">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: m.color }}>
                      {m.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div className="text-center">
                      <p className="text-white text-xs font-semibold leading-tight">{m.name}</p>
                      <p className="text-[#2f8e47] text-[10px] mt-0.5">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
