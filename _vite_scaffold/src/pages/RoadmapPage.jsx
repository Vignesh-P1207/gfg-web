import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"

const DOMAINS = [
  { id: "dsa",         label: "DSA",             icon: "account_tree",            color: "#2f8e47" },
  { id: "webdev",      label: "Web Dev",          icon: "web",                     color: "#3b82f6" },
  { id: "aiml",        label: "AI / ML",          icon: "smart_toy",               color: "#f97316" },
  { id: "datascience", label: "Data Science",     icon: "bar_chart",               color: "#8b5cf6" },
  { id: "cybersec",    label: "Cyber Security",   icon: "security",                color: "#ef4444" },
  { id: "blockchain",  label: "Blockchain",       icon: "currency_bitcoin",        color: "#eab308" },
  { id: "cloud",       label: "Cloud Computing",  icon: "cloud",                   color: "#06b6d4" },
  { id: "robotics",    label: "Robotics",         icon: "precision_manufacturing", color: "#ec4899" },
  { id: "devops",      label: "DevOps",           icon: "settings_suggest",        color: "#14b8a6" },
  { id: "mobile",      label: "Mobile Dev",       icon: "phone_android",           color: "#a855f7" },
]

const ROADMAPS = {
  dsa: [
    { id:1,  title:"Programming Basics",    icon:"code",         desc:"Pick C++/Java/Python. Learn variables, loops, functions, recursion, and Big-O complexity." },
    { id:2,  title:"Arrays and Strings",    icon:"view_array",   desc:"Sliding window, two pointers, prefix sums, sorting, and searching. Foundation for 40% of interview problems." },
    { id:3,  title:"Linked Lists",          icon:"linear_scale", desc:"Singly and doubly linked lists, reversal, cycle detection (Floyd), merge sorted lists, LRU cache." },
    { id:4,  title:"Stacks and Queues",     icon:"layers",       desc:"Monotonic stack, next greater element, BFS with queues, deque tricks, and expression evaluation." },
    { id:5,  title:"Trees and BST",         icon:"account_tree", desc:"Binary trees, DFS/BFS traversals, BST operations, LCA, diameter, height, and segment trees." },
    { id:6,  title:"Heaps and Hashing",     icon:"filter_list",  desc:"Min/max heaps, priority queues, top-K problems, hash maps, hash sets, and collision handling." },
    { id:7,  title:"Graphs",                icon:"hub",          desc:"BFS, DFS, Dijkstra, Bellman-Ford, topological sort, union-find, and MST (Kruskal/Prim)." },
    { id:8,  title:"Dynamic Programming",   icon:"psychology",   desc:"Memoization vs tabulation, knapsack, LCS, LIS, matrix DP, bitmask DP, and interval DP." },
    { id:9,  title:"Greedy and Backtracking",icon:"shuffle",     desc:"Activity selection, Huffman coding, N-Queens, Sudoku solver, permutations, and subset generation." },
    { id:10, title:"Advanced Topics",       icon:"star",         desc:"Tries, segment trees with lazy propagation, Fenwick trees, KMP, Z-function, and competitive tricks." },
  ],
  webdev: [
    { id:1,  title:"HTML and CSS",          icon:"html",         desc:"Semantic HTML5, CSS box model, flexbox, grid, responsive design, and accessibility basics." },
    { id:2,  title:"JavaScript Core",       icon:"javascript",   desc:"ES6+, closures, prototypes, async/await, promises, event loop, DOM manipulation, and fetch API." },
    { id:3,  title:"Git and Version Control",icon:"merge",       desc:"Git workflow, branching strategies, pull requests, rebasing, and GitHub collaboration." },
    { id:4,  title:"React.js",              icon:"widgets",      desc:"Components, hooks (useState, useEffect, useContext), React Router, state management, and performance." },
    { id:5,  title:"CSS Frameworks",        icon:"palette",      desc:"Tailwind CSS utility-first approach, component libraries (shadcn, Radix), and design systems." },
    { id:6,  title:"Node.js and Express",   icon:"dns",          desc:"REST API design, middleware, authentication (JWT/OAuth), file uploads, and error handling." },
    { id:7,  title:"Databases",             icon:"storage",      desc:"SQL (PostgreSQL/MySQL) vs NoSQL (MongoDB). Schema design, indexing, transactions, and ORMs." },
    { id:8,  title:"Auth and Security",     icon:"lock",         desc:"JWT, OAuth2, session management, HTTPS, CORS, XSS/CSRF prevention, and rate limiting." },
    { id:9,  title:"Deployment and DevOps", icon:"cloud_upload", desc:"Docker basics, CI/CD pipelines, Vercel/Netlify, AWS/GCP basics, environment management." },
    { id:10, title:"System Design",         icon:"architecture", desc:"Load balancing, caching (Redis), CDN, microservices, message queues, and scalability patterns." },
  ],
  aiml: [
    { id:1,  title:"Python for ML",         icon:"code",         desc:"NumPy, Pandas, Matplotlib, Seaborn. Vectorized operations and data wrangling." },
    { id:2,  title:"Math Foundations",      icon:"calculate",    desc:"Linear algebra, calculus (gradients, chain rule), probability, and statistics." },
    { id:3,  title:"Data Preprocessing",    icon:"tune",         desc:"Handling missing values, feature scaling, encoding, train/test splits, and cross-validation." },
    { id:4,  title:"Classical ML",          icon:"scatter_plot", desc:"Linear/logistic regression, decision trees, random forests, SVM, KNN, and ensemble methods." },
    { id:5,  title:"Model Evaluation",      icon:"assessment",   desc:"Accuracy, precision, recall, F1, ROC-AUC, confusion matrix, bias-variance tradeoff." },
    { id:6,  title:"Deep Learning Basics",  icon:"hub",          desc:"Neural networks, backpropagation, activation functions, optimizers (Adam, SGD), regularization." },
    { id:7,  title:"CNNs and Vision",       icon:"image",        desc:"Convolutional layers, pooling, ResNet, transfer learning, object detection (YOLO), segmentation." },
    { id:8,  title:"NLP and Transformers",  icon:"chat",         desc:"Tokenization, embeddings, RNNs, LSTMs, attention, BERT, GPT, and fine-tuning LLMs." },
    { id:9,  title:"MLOps",                 icon:"settings_suggest", desc:"Model versioning (MLflow), deployment (FastAPI, Docker), monitoring, A/B testing, data pipelines." },
    { id:10, title:"Generative AI",         icon:"auto_awesome", desc:"GANs, VAEs, diffusion models, prompt engineering, RAG systems, and LangChain applications." },
  ],
  datascience: [
    { id:1,  title:"Python and R Basics",   icon:"code",         desc:"Python (pandas, numpy) and R for statistical computing. Jupyter notebooks and reproducible research." },
    { id:2,  title:"Statistics",            icon:"functions",    desc:"Descriptive stats, distributions, hypothesis testing, p-values, confidence intervals, Bayesian thinking." },
    { id:3,  title:"Data Wrangling",        icon:"cleaning_services", desc:"ETL pipelines, handling messy data, merging datasets, regex, and data quality checks." },
    { id:4,  title:"EDA",                   icon:"search",       desc:"Univariate/bivariate analysis, correlation, outlier detection, and storytelling with data." },
    { id:5,  title:"Data Visualization",    icon:"bar_chart",    desc:"Matplotlib, Seaborn, Plotly, Tableau, and Power BI. Principles of effective visual communication." },
    { id:6,  title:"SQL and Databases",     icon:"storage",      desc:"Advanced SQL (window functions, CTEs), query optimization, and working with large datasets." },
    { id:7,  title:"Machine Learning",      icon:"smart_toy",    desc:"Supervised/unsupervised learning, feature engineering, model selection, and hyperparameter tuning." },
    { id:8,  title:"Big Data Tools",        icon:"cloud",        desc:"Spark, Hadoop, Hive, Kafka, and distributed computing for petabyte-scale data." },
    { id:9,  title:"Business Intelligence", icon:"insights",     desc:"KPI design, dashboards, A/B testing, cohort analysis, and translating data into business decisions." },
    { id:10, title:"Capstone Projects",     icon:"star",         desc:"End-to-end: data collection, cleaning, analysis, modeling, and presentation to stakeholders." },
  ],
  cybersec: [
    { id:1,  title:"Networking Fundamentals",icon:"lan",         desc:"OSI model, TCP/IP, DNS, HTTP/S, firewalls, VPNs, and packet analysis with Wireshark." },
    { id:2,  title:"Linux and CLI",         icon:"terminal",     desc:"Linux file system, permissions, bash scripting, process management, and system hardening." },
    { id:3,  title:"Cryptography",          icon:"key",          desc:"Symmetric/asymmetric encryption, hashing, PKI, TLS/SSL, digital signatures, and common attacks." },
    { id:4,  title:"Web App Security",      icon:"security",     desc:"OWASP Top 10: SQLi, XSS, CSRF, IDOR, SSRF, broken auth, and security misconfigurations." },
    { id:5,  title:"Ethical Hacking",       icon:"manage_search",desc:"OSINT, Nmap, Shodan, passive/active reconnaissance, and attack surface mapping." },
    { id:6,  title:"Exploitation",          icon:"bug_report",   desc:"Metasploit, buffer overflows, privilege escalation, reverse shells, and post-exploitation." },
    { id:7,  title:"Digital Forensics",     icon:"fingerprint",  desc:"Disk imaging, memory forensics, log analysis, incident response, and chain of custody." },
    { id:8,  title:"Malware Analysis",      icon:"coronavirus",  desc:"Static/dynamic analysis, reverse engineering (Ghidra, IDA), sandbox environments, IOC extraction." },
    { id:9,  title:"Cloud Security",        icon:"cloud_done",   desc:"IAM misconfigurations, S3 bucket security, container security, and cloud-native attack vectors." },
    { id:10, title:"CTF and Certifications",icon:"workspace_premium", desc:"HackTheBox, TryHackMe. Certifications: CEH, OSCP, CompTIA Security+, CISSP." },
  ],
  blockchain: [
    { id:1,  title:"Blockchain Fundamentals",icon:"link",        desc:"Distributed ledgers, consensus (PoW, PoS), immutability, and Byzantine fault tolerance." },
    { id:2,  title:"Cryptography Basics",   icon:"key",          desc:"Hash functions (SHA-256), public/private keys, digital signatures, and Merkle trees." },
    { id:3,  title:"Bitcoin and Ethereum",  icon:"currency_bitcoin", desc:"UTXO model, Bitcoin scripting, Ethereum accounts, gas, EVM, and the transition to PoS." },
    { id:4,  title:"Solidity Programming",  icon:"code",         desc:"Smart contract syntax, data types, mappings, events, modifiers, inheritance, and security patterns." },
    { id:5,  title:"Smart Contract Dev",    icon:"contract",     desc:"Hardhat/Foundry setup, testing with Mocha/Chai, deployment scripts, and contract verification." },
    { id:6,  title:"DeFi Protocols",        icon:"account_balance", desc:"AMMs (Uniswap), lending (Aave, Compound), yield farming, liquidity pools, and flash loans." },
    { id:7,  title:"NFTs and Token Standards",icon:"token",      desc:"ERC-20, ERC-721, ERC-1155 standards, metadata, IPFS storage, and NFT marketplace mechanics." },
    { id:8,  title:"Web3 Frontend",         icon:"web",          desc:"ethers.js / wagmi, wallet connection (MetaMask, WalletConnect), React + Web3 dApp architecture." },
    { id:9,  title:"Smart Contract Security",icon:"security",    desc:"Reentrancy, integer overflow, access control bugs, oracle manipulation, and audit tools (Slither)." },
    { id:10, title:"Layer 2 and Scaling",   icon:"speed",        desc:"Rollups (Optimism, Arbitrum, zkSync), state channels, sidechains, and cross-chain bridges." },
  ],
  cloud: [
    { id:1,  title:"Cloud Concepts",        icon:"cloud",        desc:"IaaS vs PaaS vs SaaS, public/private/hybrid cloud, shared responsibility model, and cloud economics." },
    { id:2,  title:"Linux and Networking",  icon:"lan",          desc:"VPCs, subnets, routing tables, security groups, NAT gateways, and load balancers." },
    { id:3,  title:"Core AWS/GCP/Azure",    icon:"dns",          desc:"Compute (EC2/GCE/VMs), storage (S3/GCS/Blob), databases (RDS/Cloud SQL), and IAM." },
    { id:4,  title:"Containers and Docker", icon:"inventory_2",  desc:"Docker images, containers, volumes, networking, Docker Compose, and container registries." },
    { id:5,  title:"Kubernetes",            icon:"settings_suggest", desc:"Pods, deployments, services, ingress, ConfigMaps, Secrets, Helm charts, and cluster management." },
    { id:6,  title:"Infrastructure as Code",icon:"code",         desc:"Terraform, AWS CloudFormation, Pulumi. Declarative infrastructure, state management, and modules." },
    { id:7,  title:"CI/CD Pipelines",       icon:"merge",        desc:"GitHub Actions, Jenkins, GitLab CI. Automated testing, building, and deployment workflows." },
    { id:8,  title:"Serverless",            icon:"bolt",         desc:"AWS Lambda, Cloud Functions, API Gateway, event-driven architecture, and cold start optimization." },
    { id:9,  title:"Monitoring",            icon:"monitor_heart",desc:"CloudWatch, Prometheus, Grafana, distributed tracing (Jaeger), logging (ELK stack), and alerting." },
    { id:10, title:"Cloud Certifications",  icon:"workspace_premium", desc:"AWS Solutions Architect, GCP Associate Cloud Engineer, Azure AZ-900/AZ-104, and CKA." },
  ],
  robotics: [
    { id:1,  title:"Math and Physics",      icon:"calculate",    desc:"Linear algebra, calculus, rigid body dynamics, kinematics, and control theory fundamentals." },
    { id:2,  title:"Programming for Robotics",icon:"code",       desc:"C++ and Python for robotics. Real-time constraints, memory management, and embedded systems basics." },
    { id:3,  title:"Electronics and MCUs",  icon:"memory",       desc:"Arduino, Raspberry Pi, GPIO, PWM, I2C/SPI/UART protocols, sensors, and actuators." },
    { id:4,  title:"ROS 2",                 icon:"precision_manufacturing", desc:"ROS2 nodes, topics, services, actions, TF transforms, URDF models, and Gazebo simulation." },
    { id:5,  title:"Kinematics and Dynamics",icon:"rotate_90_degrees_cw", desc:"Forward/inverse kinematics, Denavit-Hartenberg parameters, Jacobians, and trajectory planning." },
    { id:6,  title:"Sensors and Perception",icon:"sensors",      desc:"LiDAR, cameras, IMUs, ultrasonic sensors, sensor fusion (Kalman filter), and point cloud processing." },
    { id:7,  title:"Computer Vision",       icon:"visibility",   desc:"OpenCV, object detection, pose estimation, depth cameras (RealSense), and visual SLAM." },
    { id:8,  title:"Path Planning",         icon:"map",          desc:"A*, Dijkstra, RRT, potential fields, SLAM (GMapping, Cartographer), and Nav2 stack." },
    { id:9,  title:"ML in Robotics",        icon:"smart_toy",    desc:"Reinforcement learning (PPO, SAC), imitation learning, sim-to-real transfer, and manipulation." },
    { id:10, title:"Capstone Robot Project",icon:"star",         desc:"Build an autonomous robot: perception, planning, and control loop. Document and present your system." },
  ],
  devops: [
    { id:1,  title:"Linux and Shell",       icon:"terminal",     desc:"File system, permissions, cron jobs, bash scripting, process management, and system monitoring." },
    { id:2,  title:"Git and Version Control",icon:"merge",       desc:"Branching strategies (GitFlow, trunk-based), hooks, monorepos, and code review workflows." },
    { id:3,  title:"Networking Basics",     icon:"lan",          desc:"DNS, HTTP/S, TCP/IP, load balancers, reverse proxies (Nginx), and SSL/TLS certificates." },
    { id:4,  title:"Docker and Containers", icon:"inventory_2",  desc:"Dockerfile best practices, multi-stage builds, container networking, volumes, and security scanning." },
    { id:5,  title:"Kubernetes",            icon:"settings_suggest", desc:"Cluster architecture, workloads, networking (CNI), storage (CSI), RBAC, and production hardening." },
    { id:6,  title:"CI/CD",                 icon:"autorenew",    desc:"GitHub Actions, Jenkins, ArgoCD, GitOps principles, blue-green deployments, and canary releases." },
    { id:7,  title:"Infrastructure as Code",icon:"code",         desc:"Terraform, Ansible, Pulumi. Provisioning, configuration management, and drift detection." },
    { id:8,  title:"Cloud Platforms",       icon:"cloud",        desc:"AWS/GCP/Azure core services, managed Kubernetes (EKS/GKE/AKS), and cost optimization." },
    { id:9,  title:"Monitoring and SRE",    icon:"monitor_heart",desc:"SLIs/SLOs/SLAs, Prometheus + Grafana, ELK stack, incident management, and chaos engineering." },
    { id:10, title:"DevSecOps",             icon:"security",     desc:"SAST/DAST in pipelines, secrets management (Vault), container scanning, and compliance as code." },
  ],
  mobile: [
    { id:1,  title:"Programming Fundamentals",icon:"code",       desc:"Dart (Flutter) or Kotlin/Swift. OOP, null safety, async programming, and functional patterns." },
    { id:2,  title:"UI Basics",             icon:"phone_android",desc:"Widgets/Views, layouts, navigation, theming, responsive design, and platform design guidelines." },
    { id:3,  title:"State Management",      icon:"sync",         desc:"Flutter: Riverpod, Bloc, Provider. React Native: Redux, Zustand. Reactive programming patterns." },
    { id:4,  title:"Networking and APIs",   icon:"wifi",         desc:"REST API integration, JSON parsing, Dio/Retrofit, error handling, caching, and offline support." },
    { id:5,  title:"Local Storage",         icon:"storage",      desc:"SQLite, Hive, SharedPreferences, Room (Android), CoreData (iOS), and secure storage." },
    { id:6,  title:"Authentication",        icon:"lock",         desc:"Firebase Auth, OAuth, biometric auth, token refresh flows, and secure credential storage." },
    { id:7,  title:"Native Features",       icon:"sensors",      desc:"Camera, GPS, push notifications (FCM/APNs), background tasks, and platform channels." },
    { id:8,  title:"Testing",               icon:"bug_report",   desc:"Unit tests, widget tests, integration tests, mocking, and UI automation (Appium, Detox)." },
    { id:9,  title:"Performance",           icon:"speed",        desc:"Rendering performance, memory leaks, lazy loading, image optimization, and profiling tools." },
    { id:10, title:"Publishing and CI/CD",  icon:"publish",      desc:"App signing, Play Store/App Store submission, Fastlane, Codemagic, and crash reporting (Sentry)." },
  ],
}

function NodeCard({ node, color, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="relative flex gap-4 group cursor-pointer"
      onClick={() => onClick(node)}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110"
          style={{ background: color }}>
          <span className="material-symbols-outlined text-white text-lg">{node.icon}</span>
        </div>
        {index < 9 && <div className="w-0.5 flex-1 mt-1" style={{ background: color + "40", minHeight: 32 }} />}
      </div>
      <div className="mb-6 flex-1 rounded-2xl border p-4 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg"
        style={{ borderColor: color + "30", background: color + "08" }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>Step {index + 1}</span>
          <span className="material-symbols-outlined text-sm opacity-40">open_in_new</span>
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mt-1 text-base">{node.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{node.desc}</p>
      </div>
    </motion.div>
  )
}

function NodeModal({ node, color, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div className="relative bg-white dark:bg-[#0d1a10] rounded-3xl p-8 max-w-md w-full shadow-2xl border"
        style={{ borderColor: color + "40" }}
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg" style={{ background: color }}>
          <span className="material-symbols-outlined text-white text-2xl">{node.icon}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{node.title}</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{node.desc}</p>
        <button onClick={onClose} className="mt-6 rounded-full px-6 py-2 text-sm font-bold text-white" style={{ background: color }}>
          Got it
        </button>
      </motion.div>
    </motion.div>
  )
}

function WorkshopCTA({ color }) {
  const [clicked, setClicked] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="mt-4 mb-12 flex flex-col items-center gap-4 rounded-3xl border p-10 text-center"
      style={{ borderColor: color + "30", background: color + "08" }}>
      <span className="material-symbols-outlined text-5xl" style={{ color }}>school</span>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to join a workshop?</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">Hands-on sessions guided by industry mentors.</p>
      <AnimatePresence mode="wait">
        {clicked ? (
          <motion.div key="msg" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white" style={{ background: color }}>
            <span className="material-symbols-outlined text-lg">schedule</span>
            Workshops will be conducted soon!
          </motion.div>
        ) : (
          <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setClicked(true)}
            className="rounded-full px-8 py-3 font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
            style={{ background: color }}>
            Register for Workshop
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function RoadmapPage() {
  const [activeDomain, setActiveDomain] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const domain = DOMAINS.find(d => d.id === activeDomain)
  const nodes = activeDomain ? ROADMAPS[activeDomain] : []

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20 min-h-screen">
      <section className="bg-[#032014] text-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7]">GFG Student Chapter</p>
          <h1 className="serif-headline text-5xl md:text-7xl font-normal mt-4 mb-4">Explore Workshops</h1>
          <p className="text-slate-300/80 text-lg max-w-xl">Pick a domain, follow the interactive roadmap, and register for upcoming workshops.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-xl font-bold mb-8 text-slate-700 dark:text-slate-300">Choose a Domain</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {DOMAINS.map(d => (
            <button key={d.id} onClick={() => { setActiveDomain(d.id); setSelectedNode(null) }}
              className="flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{
                borderColor: activeDomain === d.id ? d.color : "transparent",
                background: activeDomain === d.id ? d.color + "15" : "rgba(255,255,255,0.04)",
                boxShadow: activeDomain === d.id ? ("0 0 0 2px " + d.color) : undefined,
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: d.color + "20" }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: d.color }}>{d.icon}</span>
              </div>
              <span className="text-sm font-semibold text-center text-slate-800 dark:text-slate-200">{d.label}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeDomain && domain && (
          <motion.section key={activeDomain}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }} className="mx-auto max-w-2xl px-6 pb-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: domain.color }}>
                <span className="material-symbols-outlined text-white text-xl">{domain.icon}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{domain.label} Roadmap</h2>
            </div>
            {nodes.map((node, i) => (
              <NodeCard key={node.id} node={node} color={domain.color} index={i} onClick={setSelectedNode} />
            ))}
            <WorkshopCTA color={domain.color} />
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNode && domain && (
          <NodeModal node={selectedNode} color={domain.color} onClose={() => setSelectedNode(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
