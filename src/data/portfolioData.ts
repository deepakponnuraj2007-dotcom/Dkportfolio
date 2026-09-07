import { PersonalInfo, ProjectItem, ExperienceItem, SkillCategoryItem, FeatItem, PortfolioData } from '../types';

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  name: "Deepak",
  fullName: "Deepak",
  initials: "DK",
  dkFontStyle: "unbounded",
  degree: "B.Sc Computer Science",
  college: "Arulmigu Kalasalingam College of Arts and Science",
  academicYear: "2025–2028",
  careerGoal: "Software Engineer / Product-Based Company",
  email: "pdeepakvarma00@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  leetcode: "https://leetcode.com",
  bioShort: "A self-motivated, highly skilled, and self-driven Computer Science student at Arulmigu Kalasalingam College of Arts and Science (2025–2028), with a relentless focus on software engineering, distributed systems, and modern full-stack development for product-based companies.",
  bioLong: [
    "I'm a Computer Science student and aspiring Software Engineer with a passion for transforming complex computational problems into elegant, scalable software. Currently pursuing B.Sc Computer Science at Arulmigu Kalasalingam College of Arts and Science (2025–2028).",
    "I don't just write code—I architect systems, optimize data structures, and craft intuitive digital experiences that deliver real value. With 1000+ hours dedicated to algorithms, full-stack development, and system design, I love diving deep into the internals of modern technologies.",
    "When I'm not coding, I'm exploring modern AI architectures, participating in competitive programming contests, reading engineering whitepapers, and building open-source developer tools. I am a lifelong learner and builder who thrives on solving hard technical problems."
  ]
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "kryptogiffy",
    title: "KryptoGiffy",
    description: "Decentralized platform that enables users to perform crypto transactions via Ethereum blockchain with smart contracts and Web3 wallet integration.",
    tags: ["#Ropsten", "#Goerli", "#Ethereum", "#Web3.0", "#Solidity"],
    githubUrl: "https://github.com",
    liveUrl: "https://kryptogiffy.demo"
  },
  {
    id: "graphical-password",
    title: "Graphical Password Authentication",
    description: "Enhanced security authentication system allowing users to set sequential image passwords, implementing human verification like modern reCAPTCHA. Presented at Smart India Hackathon.",
    tags: ["#SIH", "#Security", "#API", "#MongoDB", "#NodeJS"],
    githubUrl: "https://github.com",
    liveUrl: "https://graphical-auth.demo"
  },
  {
    id: "breach-checker",
    title: "Breach Checker & Shield",
    description: "Web application checking if credentials or critical personal information have been leaked in global data breaches. Free, secure, and resilient against SQL injection & XSS.",
    tags: ["#HIBP", "#RockYou2021", "#APIs", "#Particle.js", "#Security"],
    githubUrl: "https://github.com",
    liveUrl: "https://breach-checker.demo"
  },
  {
    id: "crypto-king",
    title: "Crypto King Dashboard",
    description: "Real-time cryptocurrency analytics web application tracking Top 100 coin market data, dynamic candlesticks, price predictions, and exchange insights.",
    tags: ["#React", "#CryptoAPI", "#ChartJS", "#TailwindCSS"],
    githubUrl: "https://github.com",
    liveUrl: "https://cryptoking.demo"
  },
  {
    id: "stock-info",
    title: "Stock Information Pulse",
    description: "Financial market analytics web app providing infographics on real-time market data from major indices, daily/weekly charts, and custom search metrics.",
    tags: ["#TypeScript", "#AlphaVantage", "#D3js", "#FinancialTech"],
    githubUrl: "https://github.com",
    liveUrl: "https://stockpulse.demo"
  },
  {
    id: "acoustic-music",
    title: "Acoustic Music Hub",
    description: "Sleek web music streaming experience with Spotify API integration, real-time waveform visualization, 30-second audio previews, and playlist curator.",
    tags: ["#React", "#Spotify API", "#WebAudio", "#Tailwind"],
    githubUrl: "https://github.com",
    liveUrl: "https://acoustic-music.demo"
  },
  {
    id: "weather-man",
    title: "Weather Man Live",
    description: "Intelligent weather app featuring real-time meteorological metrics across 500+ global locations with dynamic time-prediction charts and atmospheric radar.",
    tags: ["#React", "#OpenWeatherAPI", "#ChartJS", "#Geolocation"],
    githubUrl: "https://github.com",
    liveUrl: "https://weatherman.demo"
  },
  {
    id: "eco-ville",
    title: "Eco Ville - Green Social",
    description: "Community platform calculating environmental footprints, carbon offsets, and encouraging collective sustainability initiatives through gamification.",
    tags: ["#FullStack", "#GreenTech", "#MERN", "#ClimateAction"],
    githubUrl: "https://github.com",
    liveUrl: "https://ecoville.demo"
  },
  {
    id: "tweet-bot",
    title: "Tweet Bot Automation",
    description: "Python-powered Twitter/X automation bot capable of scheduling contextual threads, tracking hashtag sentiments, and automated engagement pipelines.",
    tags: ["#Python", "#TwitterAPI", "#Automation", "#AsyncIO"],
    githubUrl: "https://github.com",
    liveUrl: "https://tweetbot.demo"
  },
  {
    id: "file-separator",
    title: "File-Separator Engine",
    description: "Intelligent file segregation utility that sorts terabytes of unstructured clutter into organized directory trees based on MIME types and metadata.",
    tags: ["#Python", "#CLI", "#FileHandling", "#Productivity"],
    githubUrl: "https://github.com",
    liveUrl: "https://fileseparator.demo"
  },
  {
    id: "netflix-clone",
    title: "StreamFlix Frontend Engine",
    description: "High-performance video streaming frontend clone with dynamic video trailers, TMDb integration, Firebase authentication, and responsive theater mode.",
    tags: ["#ReactJS", "#TMDbAPI", "#Firebase", "#TailwindCSS"],
    githubUrl: "https://github.com",
    liveUrl: "https://streamflix.demo"
  },
  {
    id: "expression-recog",
    title: "Facial Expression Recognition",
    description: "Deep convolutional neural network trained on Keras/TensorFlow to classify 7 human emotional micro-expressions in real-time webcam streams.",
    tags: ["#TensorFlow", "#Keras", "#OpenCV", "#ComputerVision"],
    githubUrl: "https://github.com",
    liveUrl: "https://expression-ai.demo"
  }
];

export const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: "kalasalingam-cs",
    company: "Arulmigu Kalasalingam College",
    role: "B.Sc Computer Science Scholar",
    period: "2025 - 2028",
    type: "ACADEMIC & CORE",
    location: "Tamil Nadu, India",
    description: "Pursuing Bachelor of Science in Computer Science with focus on Data Structures, Algorithms, Object-Oriented Architecture, and Operating Systems.",
    tags: ["Data Structures", "Algorithms", "C++", "Java", "Database Management", "Computer Networks"],
    points: [
      "Deeply studying core computer science fundamentals: Algorithmic Complexity, Memory Management, Distributed Computing, and Database Internals.",
      "Maintaining top academic performance while actively building end-to-end software projects and participating in technical symposiums.",
      "Leading collaborative coding cohorts, peer mentoring on competitive programming, and organizing department tech workshops.",
      "Architecting open-source applications and preparing relentlessly for product-based software engineering careers."
    ]
  },
  {
    id: "product-eng-prep",
    company: "Software Engineering Fellow",
    role: "Product Engineering Track",
    period: "2025 - Present",
    type: "CAREER TRACK",
    location: "Remote / Self-Directed",
    description: "Intensive focus on building scalable full-stack applications, microservices, and AI-assisted workflows tailored for top-tier product companies.",
    tags: ["Product Architecture", "Full-Stack Dev", "System Design", "AI Integration", "MERN Stack"],
    points: [
      "Drive product roadmap execution from problem statement to production deployment, adhering to clean architecture principles.",
      "Built 12+ full-stack projects featuring real-time WebSockets, OAuth2, GraphQL, and cloud-native databases.",
      "Optimized query performance and caching strategies using Redis and PostgreSQL, reducing latency by over 60%.",
      "Adopted modern AI engineering methodologies: RAG pipelines, LLM agent orchestration, and automated test suites."
    ]
  },
  {
    id: "amazon-ml",
    company: "Amazon ML Initiative",
    role: "Machine Learning Cohort Mentee",
    period: "Jul 2025 - Sep 2025",
    type: "TRAINEE",
    location: "Virtual",
    description: "In-depth learning program covering key Machine Learning concepts, Neural Networks, and Data Science under guidance of industry scientists.",
    tags: ["Data Science", "Machine Learning", "Python", "Deep Learning", "NumPy"],
    points: [
      "Studied supervised and unsupervised machine learning algorithms, gradient descent optimization, and loss mathematical foundations.",
      "Built predictive models using Scikit-Learn and evaluated precision-recall trade-offs on complex multi-class datasets.",
      "Explored breakthrough innovations in generative models and computer vision pipelines.",
      "Collaborated with fellow student developers across India on real-world case studies and model benchmarks."
    ]
  },
  {
    id: "zoho-catalyst",
    company: "Catalyst & Cloud Systems",
    role: "Cloud & Backend Intern / Project",
    period: "Mar 2025 - Jun 2025",
    type: "PROJECT INTERNSHIP",
    location: "Hybrid / India",
    description: "Worked on Java, MySQL, Kafka event streaming, and serverless backend architecture.",
    tags: ["Java", "MySQL", "Kafka", "REST APIs", "Cloud Architecture"],
    points: [
      "Engineered high-throughput REST APIs and integrated Kafka event streams for asynchronous background processing.",
      "Designed normalized relational schemas and optimized multi-table JOINs for sub-millisecond query execution.",
      "Integrated microservices with modern auth tokens, rate limiting, and structured error handling.",
      "Adopted test-driven development (TDD) using JUnit and Mockito to achieve robust code coverage."
    ]
  },
  {
    id: "frontend-dev-fellow",
    company: "Open Source & Web Engineering",
    role: "Frontend Web Developer",
    period: "2025",
    type: "DEVELOPER",
    location: "Remote",
    description: "Built rich, accessible user interfaces with modern React, TypeScript, Tailwind CSS, and Figma prototyping.",
    tags: ["React.js", "TypeScript", "Tailwind CSS", "Figma", "Git", "REST APIs"],
    points: [
      "Engineered performant web applications with sub-second page loads and lighthouse scores exceeding 95+.",
      "Crafted responsive UI components using Tailwind CSS utility patterns and semantic HTML5.",
      "Collaborated using Git with conventional commits, pull requests, and automated continuous integration workflows.",
      "Ensured cross-browser compatibility and accessible WCAG AA standards across all touch targets."
    ]
  }
];

export const DEFAULT_SKILL_CATEGORIES: SkillCategoryItem[] = [
  {
    id: "fullstack",
    title: "Full-Stack",
    tagline: "Building scalable products from zero to production with modern frameworks and clean architecture.",
    codeInHeader: "I LIKE TO CODE IN",
    codeInList: ["React", "Next.js", "TypeScript", "Node.js", "Java", "Python", "C++", "SQL"],
    toolsHeader: "TOOLS & INFRASTRUCTURE",
    toolsList: ["MongoDB", "MySQL", "PostgreSQL", "Redis", "Docker", "Git", "Linux", "Express.js", "GraphQL", "Tailwind CSS", "REST APIs"]
  },
  {
    id: "aiml",
    title: "AI / ML & Systems",
    tagline: "Integrating AI technologies, machine learning algorithms, and distributed concepts into production workflows.",
    codeInHeader: "SKILLS & DOMAINS",
    codeInList: ["LLMs", "RAG Pipelines", "Data Structures & Algorithms", "Prompt Engineering", "Object-Oriented Design", "Neural Networks", "Data Analysis"],
    toolsHeader: "TOOLS & FRAMEWORKS",
    toolsList: ["OpenAI API", "Gemini API", "PyTorch", "TensorFlow", "Scikit-Learn", "LangChain", "Vector DBs", "NumPy & Pandas", "Cursor AI"]
  }
];

export const DEFAULT_FEATS: FeatItem[] = [
  {
    id: "leetcode",
    title: "LeetCode Problem Solver",
    category: "Competitive Programming",
    tags: ["#Algorithms", "#DataStructures", "#DynamicProgramming", "#GraphTheory"],
    subtitle: "700+ Problems Solved | Contest Rating: 2067 (Top 1.8%)",
    type: "leetcode",
    stats: {
      total: 708,
      easy: 219,
      medium: 384,
      hard: 105,
      rating: 2067,
      globalRank: "Top 1.83%"
    }
  },
  {
    id: "amazon-ml-feat",
    title: "Mentee - Amazon ML Summer School",
    category: "Machine Learning & AI",
    tags: ["#ML", "#Machine Learning", "#Data Science", "#Data Analysis"],
    subtitle: "Intensive AI & Machine Learning apprenticeship under Amazon Research Scientists",
    type: "card",
    date: "2025"
  },
  {
    id: "zoho-feat",
    title: "Zoho Software Development & Cloud",
    category: "Backend & Systems",
    tags: ["#SQL", "#JDBC", "#JAVA", "#KAFKA", "#Backend"],
    subtitle: "Architected enterprise backend solutions and asynchronous event pipelines",
    type: "card",
    date: "2025"
  },
  {
    id: "sih-feat",
    title: "Smart India Hackathon Innovation",
    category: "Hackathons",
    tags: ["#SIH", "#Innovation", "#Security", "#MongoDB"],
    subtitle: "Created next-gen graphical sequential auth mechanism against automated cyber threats",
    type: "card",
    date: "2025"
  },
  {
    id: "gcp-cert",
    title: "Google Cloud Security Challenge: Level 2",
    category: "Cloud Security",
    tags: ["#Google", "#Cloud", "#Cloud Security", "#IAM"],
    subtitle: "Google Cloud Community India Earn Cloud Security Credential",
    type: "cert",
    date: "Verified"
  },
  {
    id: "python-cert",
    title: "The Python 3 Master Course: Zero to Pro",
    category: "Certifications",
    tags: ["#Python", "#OOPS", "#Algorithms", "#Automation"],
    subtitle: "Comprehensive algorithmic Python and object-oriented architecture credential",
    type: "cert",
    date: "Verified"
  },
  {
    id: "java-cert",
    title: "Practical Java Course: Zero to One",
    category: "Certifications",
    tags: ["#Java", "#DataStructures", "#OOPS", "#Backend"],
    subtitle: "Enterprise Java programming, memory models, multithreading, and JDBC",
    type: "cert",
    date: "Verified"
  },
  {
    id: "aws-cert",
    title: "AWS Machine Learning Essentials",
    category: "Certifications",
    tags: ["#AWS", "#Machine Learning", "#SageMaker", "#CloudAI"],
    subtitle: "Cloud-native AI pipeline deployment and model evaluation",
    type: "cert",
    date: "Verified"
  },
  {
    id: "cognitive-cert",
    title: "Cognitive Class Python 101 for Data Science",
    category: "Certifications",
    tags: ["#Python", "#Data Science", "#Machine Learning", "#IBM"],
    subtitle: "Foundational data wrangling, NumPy arrays, and Pandas statistical analytics",
    type: "cert",
    date: "Verified"
  }
];

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: DEFAULT_PERSONAL_INFO,
  projects: DEFAULT_PROJECTS,
  experiences: DEFAULT_EXPERIENCES,
  skillCategories: DEFAULT_SKILL_CATEGORIES,
  feats: DEFAULT_FEATS
};

// Backwards compatibility aliases
export const PERSONAL_INFO = DEFAULT_PERSONAL_INFO;
export const PROJECTS = DEFAULT_PROJECTS;
export const EXPERIENCES = DEFAULT_EXPERIENCES;
export const SKILL_CATEGORIES = DEFAULT_SKILL_CATEGORIES;
export const FEATS = DEFAULT_FEATS;
