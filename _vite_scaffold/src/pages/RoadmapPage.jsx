import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"

const DOMAINS = [
  { id: "dsa", label: "DSA", icon: "account_tree", color: "#2f8e47" },
  { id: "webdev", label: "Web Dev", icon: "web", color: "#3b82f6" },
  { id: "aiml", label: "AI / ML", icon: "smart_toy", color: "#f97316" },
  { id: "datascience", label: "Data Science", icon: "bar_chart", color: "#8b5cf6" },
  { id: "cybersec", label: "Cyber Security", icon: "security", color: "#ef4444" },
  { id: "blockchain", label: "Blockchain", icon: "currency_bitcoin", color: "#eab308" },
  { id: "cloud", label: "Cloud Computing", icon: "cloud", color: "#06b6d4" },
  { id: "robotics", label: "Robotics", icon: "precision_manufacturing", color: "#ec4899" },
  { id: "devops", label: "DevOps", icon: "settings_suggest", color: "#14b8a6" },
  { id: "mobile", label: "Mobile Dev", icon: "phone_android", color: "#a855f7" },
]

const ROADMAPS = {
  dsa: [
    { id: 1, title: "Programming Basics", icon: "code", desc: "Pick C++/Java/Python. Learn variables, loops, functions, recursion, and Big-O complexity." },
    { id: 2, title: "Arrays and Strings", icon: "view_array", desc: "Sliding window, two pointers, prefix sums, sorting, and searching. Foundation for 40% of interview problems." },
    { id: 3, title: "Linked Lists", icon: "linear_scale", desc: "Singly and doubly linked lists, reversal, cycle detection (Floyd), merge sorted lists, LRU cache." },
    { id: 4, title: "Stacks and Queues", icon: "layers", desc: "Monotonic stack, next greater element, BFS with queues, deque tricks, and expression evaluation." },
    { id: 5, title: "Trees and BST", icon: "account_tree", desc: "Binary trees, DFS/BFS traversals, BST operations, LCA, diameter, height, and segment trees." },
    { id: 6, title: "Heaps and Hashing", icon: "filter_list", desc: "Min/max heaps, priority queues, top-K problems, hash maps, hash sets, and collision handling." },
    { id: 7, title: "Graphs", icon: "hub", desc: "BFS, DFS, Dijkstra, Bellman-Ford, topological sort, union-find, and MST (Kruskal/Prim)." },
    { id: 8, title: "Dynamic Programming", icon: "psychology", desc: "Memoization vs tabulation, knapsack, LCS, LIS, matrix DP, bitmask DP, and interval DP." },
    { id: 9, title: "Greedy and Backtracking", icon: "shuffle", desc: "Activity selection, Huffman coding, N-Queens, Sudoku solver, permutations, and subset generation." },
    { id: 10, title: "Advanced Topics", icon: "star", desc: "Tries, segment trees with lazy propagation, Fenwick trees, KMP, Z-function, and competitive tricks." },
  ],
  webdev: [
    { id: 1, title: "HTML and CSS", icon: "html", desc: "Semantic HTML5, CSS box model, flexbox, grid, responsive design, and accessibility basics." },
    { id: 2, title: "JavaScript Core", icon: "javascript", desc: "ES6+, closures, prototypes, async/await, promises, event loop, DOM manipulation, and fetch API." },
    { id: 3, title: "Git and Version Control", icon: "merge", desc: "Git workflow, branching strategies, pull requests, rebasing, and GitHub collaboration." },
    { id: 4, title: "React.js", icon: "widgets", desc: "Components, hooks (useState, useEffect, useContext), React Router, state management, and performance." },
    { id: 5, title: "CSS Frameworks", icon: "palette", desc: "Tailwind CSS utility-first approach, component libraries (shadcn, Radix), and design systems." },
    { id: 6, title: "Node.js and Express", icon: "dns", desc: "REST API design, middleware, authentication (JWT/OAuth), file uploads, and error handling." },
    { id: 7, title: "Databases", icon: "storage", desc: "SQL (PostgreSQL/MySQL) vs NoSQL (MongoDB). Schema design, indexing, transactions, and ORMs." },
    { id: 8, title: "Auth and Security", icon: "lock", desc: "JWT, OAuth2, session management, HTTPS, CORS, XSS/CSRF prevention, and rate limiting." },
    { id: 9, title: "Deployment and DevOps", icon: "cloud_upload", desc: "Docker basics, CI/CD pipelines, Vercel/Netlify, AWS/GCP basics, environment management." },
    { id: 10, title: "System Design", icon: "architecture", desc: "Load balancing, caching (Redis), CDN, microservices, message queues, and scalability patterns." },
  ],
  aiml: [
    { id: 1, title: "Python for ML", icon: "code", desc: "NumPy, Pandas, Matplotlib, Seaborn. Vectorized operations and data wrangling." },
    { id: 2, title: "Math Foundations", icon: "calculate", desc: "Linear algebra, calculus (gradients, chain rule), probability, and statistics." },
    { id: 3, title: "Data Preprocessing", icon: "tune", desc: "Handling missing values, feature scaling, encoding, train/test splits, and cross-validation." },
    { id: 4, title: "Classical ML", icon: "scatter_plot", desc: "Linear/logistic regression, decision trees, random forests, SVM, KNN, and ensemble methods." },
    { id: 5, title: "Model Evaluation", icon: "assessment", desc: "Accuracy, precision, recall, F1, ROC-AUC, confusion matrix, bias-variance tradeoff." },
    { id: 6, title: "Deep Learning Basics", icon: "hub", desc: "Neural networks, backpropagation, activation functions, optimizers (Adam, SGD), regularization." },
    { id: 7, title: "CNNs and Vision", icon: "image", desc: "Convolutional layers, pooling, ResNet, transfer learning, object detection (YOLO), segmentation." },
    { id: 8, title: "NLP and Transformers", icon: "chat", desc: "Tokenization, embeddings, RNNs, LSTMs, attention, BERT, GPT, and fine-tuning LLMs." },
    { id: 9, title: "MLOps", icon: "settings_suggest", desc: "Model versioning (MLflow), deployment (FastAPI, Docker), monitoring, A/B testing, data pipelines." },
    { id: 10, title: "Generative AI", icon: "auto_awesome", desc: "GANs, VAEs, diffusion models, prompt engineering, RAG systems, and LangChain applications." },
  ],
  datascience: [
    { id: 1, title: "Python and R Basics", icon: "code", desc: "Python (pandas, numpy) and R for statistical computing. Jupyter notebooks and reproducible research." },
    { id: 2, title: "Statistics", icon: "functions", desc: "Descriptive stats, distributions, hypothesis testing, p-values, confidence intervals, Bayesian thinking." },
    { id: 3, title: "Data Wrangling", icon: "cleaning_services", desc: "ETL pipelines, handling messy data, merging datasets, regex, and data quality checks." },
    { id: 4, title: "EDA", icon: "search", desc: "Univariate/bivariate analysis, correlation, outlier detection, and storytelling with data." },
    { id: 5, title: "Data Visualization", icon: "bar_chart", desc: "Matplotlib, Seaborn, Plotly, Tableau, and Power BI. Principles of effective visual communication." },
    { id: 6, title: "SQL and Databases", icon: "storage", desc: "Advanced SQL (window functions, CTEs), query optimization, and working with large datasets." },
    { id: 7, title: "Machine Learning", icon: "smart_toy", desc: "Supervised/unsupervised learning, feature engineering, model selection, and hyperparameter tuning." },
    { id: 8, title: "Big Data Tools", icon: "cloud", desc: "Spark, Hadoop, Hive, Kafka, and distributed computing for petabyte-scale data." },
    { id: 9, title: "Business Intelligence", icon: "insights", desc: "KPI design, dashboards, A/B testing, cohort analysis, and translating data into business decisions." },
    { id: 10, title: "Capstone Projects", icon: "star", desc: "End-to-end: data collection, cleaning, analysis, modeling, and presentation to stakeholders." },
  ],
  cybersec: [
    { id: 1, title: "Networking Fundamentals", icon: "lan", desc: "OSI model, TCP/IP, DNS, HTTP/S, firewalls, VPNs, and packet analysis with Wireshark." },
    { id: 2, title: "Linux and CLI", icon: "terminal", desc: "Linux file system, permissions, bash scripting, process management, and system hardening." },
    { id: 3, title: "Cryptography", icon: "key", desc: "Symmetric/asymmetric encryption, hashing, PKI, TLS/SSL, digital signatures, and common attacks." },
    { id: 4, title: "Web App Security", icon: "security", desc: "OWASP Top 10: SQLi, XSS, CSRF, IDOR, SSRF, broken auth, and security misconfigurations." },
    { id: 5, title: "Ethical Hacking", icon: "manage_search", desc: "OSINT, Nmap, Shodan, passive/active reconnaissance, and attack surface mapping." },
    { id: 6, title: "Exploitation", icon: "bug_report", desc: "Metasploit, buffer overflows, privilege escalation, reverse shells, and post-exploitation." },
    { id: 7, title: "Digital Forensics", icon: "fingerprint", desc: "Disk imaging, memory forensics, log analysis, incident response, and chain of custody." },
    { id: 8, title: "Malware Analysis", icon: "coronavirus", desc: "Static/dynamic analysis, reverse engineering (Ghidra, IDA), sandbox environments, IOC extraction." },
    { id: 9, title: "Cloud Security", icon: "cloud_done", desc: "IAM misconfigurations, S3 bucket security, container security, and cloud-native attack vectors." },
    { id: 10, title: "CTF and Certifications", icon: "workspace_premium", desc: "HackTheBox, TryHackMe. Certifications: CEH, OSCP, CompTIA Security+, CISSP." },
  ],
  blockchain: [
    { id: 1, title: "Blockchain Fundamentals", icon: "link", desc: "Distributed ledgers, consensus (PoW, PoS), immutability, and Byzantine fault tolerance." },
    { id: 2, title: "Cryptography Basics", icon: "key", desc: "Hash functions (SHA-256), public/private keys, digital signatures, and Merkle trees." },
    { id: 3, title: "Bitcoin and Ethereum", icon: "currency_bitcoin", desc: "UTXO model, Bitcoin scripting, Ethereum accounts, gas, EVM, and the transition to PoS." },
    { id: 4, title: "Solidity Programming", icon: "code", desc: "Smart contract syntax, data types, mappings, events, modifiers, inheritance, and security patterns." },
    { id: 5, title: "Smart Contract Dev", icon: "contract", desc: "Hardhat/Foundry setup, testing with Mocha/Chai, deployment scripts, and contract verification." },
    { id: 6, title: "DeFi Protocols", icon: "account_balance", desc: "AMMs (Uniswap), lending (Aave, Compound), yield farming, liquidity pools, and flash loans." },
    { id: 7, title: "NFTs and Token Standards", icon: "token", desc: "ERC-20, ERC-721, ERC-1155 standards, metadata, IPFS storage, and NFT marketplace mechanics." },
    { id: 8, title: "Web3 Frontend", icon: "web", desc: "ethers.js / wagmi, wallet connection (MetaMask, WalletConnect), React + Web3 dApp architecture." },
    { id: 9, title: "Smart Contract Security", icon: "security", desc: "Reentrancy, integer overflow, access control bugs, oracle manipulation, and audit tools (Slither)." },
    { id: 10, title: "Layer 2 and Scaling", icon: "speed", desc: "Rollups (Optimism, Arbitrum, zkSync), state channels, sidechains, and cross-chain bridges." },
  ],
  cloud: [
    { id: 1, title: "Cloud Concepts", icon: "cloud", desc: "IaaS vs PaaS vs SaaS, public/private/hybrid cloud, shared responsibility model, and cloud economics." },
    { id: 2, title: "Linux and Networking", icon: "lan", desc: "VPCs, subnets, routing tables, security groups, NAT gateways, and load balancers." },
    { id: 3, title: "Core AWS/GCP/Azure", icon: "dns", desc: "Compute (EC2/GCE/VMs), storage (S3/GCS/Blob), databases (RDS/Cloud SQL), and IAM." },
    { id: 4, title: "Containers and Docker", icon: "inventory_2", desc: "Docker images, containers, volumes, networking, Docker Compose, and container registries." },
    { id: 5, title: "Kubernetes", icon: "settings_suggest", desc: "Pods, deployments, services, ingress, ConfigMaps, Secrets, Helm charts, and cluster management." },
    { id: 6, title: "Infrastructure as Code", icon: "code", desc: "Terraform, AWS CloudFormation, Pulumi. Declarative infrastructure, state management, and modules." },
    { id: 7, title: "CI/CD Pipelines", icon: "merge", desc: "GitHub Actions, Jenkins, GitLab CI. Automated testing, building, and deployment workflows." },
    { id: 8, title: "Serverless", icon: "bolt", desc: "AWS Lambda, Cloud Functions, API Gateway, event-driven architecture, and cold start optimization." },
    { id: 9, title: "Monitoring", icon: "monitor_heart", desc: "CloudWatch, Prometheus, Grafana, distributed tracing (Jaeger), logging (ELK stack), and alerting." },
    { id: 10, title: "Cloud Certifications", icon: "workspace_premium", desc: "AWS Solutions Architect, GCP Associate Cloud Engineer, Azure AZ-900/AZ-104, and CKA." },
  ],
  robotics: [
    { id: 1, title: "Math and Physics", icon: "calculate", desc: "Linear algebra, calculus, rigid body dynamics, kinematics, and control theory fundamentals." },
    { id: 2, title: "Programming for Robotics", icon: "code", desc: "C++ and Python for robotics. Real-time constraints, memory management, and embedded systems basics." },
    { id: 3, title: "Electronics and MCUs", icon: "memory", desc: "Arduino, Raspberry Pi, GPIO, PWM, I2C/SPI/UART protocols, sensors, and actuators." },
    { id: 4, title: "ROS 2", icon: "precision_manufacturing", desc: "ROS2 nodes, topics, services, actions, TF transforms, URDF models, and Gazebo simulation." },
    { id: 5, title: "Kinematics and Dynamics", icon: "rotate_90_degrees_cw", desc: "Forward/inverse kinematics, Denavit-Hartenberg parameters, Jacobians, and trajectory planning." },
    { id: 6, title: "Sensors and Perception", icon: "sensors", desc: "LiDAR, cameras, IMUs, ultrasonic sensors, sensor fusion (Kalman filter), and point cloud processing." },
    { id: 7, title: "Computer Vision", icon: "visibility", desc: "OpenCV, object detection, pose estimation, depth cameras (RealSense), and visual SLAM." },
    { id: 8, title: "Path Planning", icon: "map", desc: "A*, Dijkstra, RRT, potential fields, SLAM (GMapping, Cartographer), and Nav2 stack." },
    { id: 9, title: "ML in Robotics", icon: "smart_toy", desc: "Reinforcement learning (PPO, SAC), imitation learning, sim-to-real transfer, and manipulation." },
    { id: 10, title: "Capstone Robot Project", icon: "star", desc: "Build an autonomous robot: perception, planning, and control loop. Document and present your system." },
  ],
  devops: [
    { id: 1, title: "Linux and Shell", icon: "terminal", desc: "File system, permissions, cron jobs, bash scripting, process management, and system monitoring." },
    { id: 2, title: "Git and Version Control", icon: "merge", desc: "Branching strategies (GitFlow, trunk-based), hooks, monorepos, and code review workflows." },
    { id: 3, title: "Networking Basics", icon: "lan", desc: "DNS, HTTP/S, TCP/IP, load balancers, reverse proxies (Nginx), and SSL/TLS certificates." },
    { id: 4, title: "Docker and Containers", icon: "inventory_2", desc: "Dockerfile best practices, multi-stage builds, container networking, volumes, and security scanning." },
    { id: 5, title: "Kubernetes", icon: "settings_suggest", desc: "Cluster architecture, workloads, networking (CNI), storage (CSI), RBAC, and production hardening." },
    { id: 6, title: "CI/CD", icon: "autorenew", desc: "GitHub Actions, Jenkins, ArgoCD, GitOps principles, blue-green deployments, and canary releases." },
    { id: 7, title: "Infrastructure as Code", icon: "code", desc: "Terraform, Ansible, Pulumi. Provisioning, configuration management, and drift detection." },
    { id: 8, title: "Cloud Platforms", icon: "cloud", desc: "AWS/GCP/Azure core services, managed Kubernetes (EKS/GKE/AKS), and cost optimization." },
    { id: 9, title: "Monitoring and SRE", icon: "monitor_heart", desc: "SLIs/SLOs/SLAs, Prometheus + Grafana, ELK stack, incident management, and chaos engineering." },
    { id: 10, title: "DevSecOps", icon: "security", desc: "SAST/DAST in pipelines, secrets management (Vault), container scanning, and compliance as code." },
  ],
  mobile: [
    { id: 1, title: "Programming Fundamentals", icon: "code", desc: "Dart (Flutter) or Kotlin/Swift. OOP, null safety, async programming, and functional patterns." },
    { id: 2, title: "UI Basics", icon: "phone_android", desc: "Widgets/Views, layouts, navigation, theming, responsive design, and platform design guidelines." },
    { id: 3, title: "State Management", icon: "sync", desc: "Flutter: Riverpod, Bloc, Provider. React Native: Redux, Zustand. Reactive programming patterns." },
    { id: 4, title: "Networking and APIs", icon: "wifi", desc: "REST API integration, JSON parsing, Dio/Retrofit, error handling, caching, and offline support." },
    { id: 5, title: "Local Storage", icon: "storage", desc: "SQLite, Hive, SharedPreferences, Room (Android), CoreData (iOS), and secure storage." },
    { id: 6, title: "Authentication", icon: "lock", desc: "Firebase Auth, OAuth, biometric auth, token refresh flows, and secure credential storage." },
    { id: 7, title: "Native Features", icon: "sensors", desc: "Camera, GPS, push notifications (FCM/APNs), background tasks, and platform channels." },
    { id: 8, title: "Testing", icon: "bug_report", desc: "Unit tests, widget tests, integration tests, mocking, and UI automation (Appium, Detox)." },
    { id: 9, title: "Performance", icon: "speed", desc: "Rendering performance, memory leaks, lazy loading, image optimization, and profiling tools." },
    { id: 10, title: "Publishing and CI/CD", icon: "publish", desc: "App signing, Play Store/App Store submission, Fastlane, Codemagic, and crash reporting (Sentry)." },
  ],
}

      export default function RoadmapPage() {
  const [activeDomain, setActiveDomain] = useState('dsa')

  const domain = DOMAINS.find(d => d.id === activeDomain)
      const roadmap = ROADMAPS[activeDomain]

      return (
      <div className="min-h-screen bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100">
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold uppercase tracking-widest text-[#2f8e47] mb-4"
            >
              Learning Paths
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="serif-headline text-5xl md:text-7xl mb-6"
            >
              Master Your <span className="italic">Domain</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Follow our expert-curated roadmaps to navigate your way from a beginner to an industry-ready professional.
            </motion.p>
          </div>

          {/* Domain Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-20">
            {DOMAINS.map((d, i) => (
              <motion.button
                key={d.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveDomain(d.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${activeDomain === d.id
                    ? 'bg-[#2f8e47] border-[#2f8e47] text-white shadow-xl shadow-[#2f8e47]/20 scale-105'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-[#2f8e47]/50'
                  }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ color: activeDomain === d.id ? 'white' : d.color }}>
                  {d.icon}
                </span>
                {d.label}
              </motion.button>
            ))}
          </div>

          {/* Roadmap Display */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-white/10 hidden md:block" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-12 md:space-y-24"
              >
                {roadmap.map((step, idx) => {
                  const isEven = idx % 2 === 0
                  return (
                    <div key={step.id} className="relative flex flex-col md:flex-row items-start md:items-center">
                      {/* Circle on the line */}
                      <div
                        className="absolute left-[13px] md:left-1/2 top-0 md:top-auto md:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#f6f8f6] dark:border-[#141e16] z-10"
                        style={{ background: domain.color }}
                      />

                      {/* Content Box */}
                      <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}>
                        <motion.div
                          whileInView={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-xl hover:border-[#2f8e47]/30 transition-colors group"
                        >
                          <div className={`flex items-center gap-4 mb-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                              style={{ background: domain.color }}
                            >
                              <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                            </div>
                            <span className="text-4xl font-black opacity-5 text-slate-900 dark:text-white">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#2f8e47] transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {step.desc}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-32 text-center p-12 rounded-[3rem] bg-[#032014] text-white overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a3a25_0%,_#032014_100%)] opacity-50" />
            <div className="relative z-10">
              <h2 className="serif-headline text-4xl md:text-5xl mb-6">Ready to start?</h2>
              <p className="text-slate-300 mb-10 max-w-xl mx-auto">
                Join our community to get personalized mentorship, participate in projects, and track your progress alongside peers.
              </p>
              <button className="bg-[#2f8e47] hover:bg-[#267a3c] text-white px-10 py-5 rounded-full font-bold transition-all shadow-2xl shadow-[#2f8e47]/30">
                Join the Chapter
              </button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
      )
}
