export interface RoadmapMilestone {
  id: string;
  title: string;
  timeframe: string;
  description: string;
  requiredSkills: string[];
  topics: string[];
  suggestedProject: string;
  recommendedResources: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  badge: string;
  category: "first-year" | "basic-stack" | "specialization";
  forYear: string;
  summary: string;
  basicRequiredStack: string[];
  milestones: RoadmapMilestone[];
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "first-year-foundation",
    title: "1st Year Engineering & CS Foundation Roadmap",
    badge: "1st Year Recommended",
    category: "first-year",
    forYear: "1st Year (Semester 1 & 2)",
    summary:
      "A complete primer for 1st-year students with zero prior coding experience. Builds algorithmic intuition, developer tool basics, and fundamental CS math without needing a resume.",
    basicRequiredStack: [
      "C / C++ or Python",
      "Git & GitHub",
      "Linux / Bash Terminal",
      "Arrays & Strings",
      "HTML/CSS & Basic JS",
      "Quantitative Aptitude",
    ],
    milestones: [
      {
        id: "fy-1",
        title: "Phase 1: Computational Thinking & First Programming Language",
        timeframe: "Weeks 1 – 6 (Semester 1)",
        description:
          "Master core procedural programming constructs, memory basics, and how code executes on a CPU.",
        requiredSkills: ["Problem Solving", "C / Python"],
        topics: [
          "Variables, Data Types, and Type Casting",
          "Conditional Statements (if-else, switch-case)",
          "Loops & Iterations (for, while, nested loops)",
          "Functions, Scope, and Call Stack fundamentals",
          "Memory pointers & references (if C/C++) or Object references (if Python)",
        ],
        suggestedProject: "Command-Line Student Grade & Expense Tracker with file storage",
        recommendedResources: [
          "CS50x: Introduction to Computer Science (Harvard)",
          "Python for Everybody (University of Michigan)",
          "Automate the Boring Stuff with Python",
        ],
      },
      {
        id: "fy-2",
        title: "Phase 2: Developer Tooling & Version Control Habit",
        timeframe: "Weeks 7 – 10 (Semester 1)",
        description:
          "Set up an industry-standard development workflow using modern terminal and Git.",
        requiredSkills: ["Git & GitHub", "Linux CLI"],
        topics: [
          "Terminal navigation, file manipulation, and Bash scripting basics",
          "Git core workflow: init, add, commit, branch, checkout, merge, push",
          "GitHub remote repositories, pull requests, and README documentation",
          "Markdown syntax for professional documentation",
          "VS Code extensions, debugger setup, and keyboard shortcuts",
        ],
        suggestedProject: "Personal GitHub Profile README repository & Markdown notes wiki",
        recommendedResources: [
          "Missing Semester of Your CS Education (MIT)",
          "Git & GitHub Crash Course (FreeCodeCamp)",
        ],
      },
      {
        id: "fy-3",
        title: "Phase 3: Foundational Data Structures & Aptitude Math",
        timeframe: "Weeks 11 – 16 (Semester 1 into Break)",
        description:
          "Bridge high-school math into discrete computing math and practice foundational linear structures.",
        requiredSkills: ["Data Structures", "Quantitative Aptitude"],
        topics: [
          "Time & Space Complexity analysis (Big-O notation)",
          "One-dimensional and Two-dimensional Arrays & Matrices",
          "String manipulation, character encodings (ASCII/UTF-8)",
          "Singly and Doubly Linked Lists implementation",
          "Quantitative aptitude: Series, percentages, permutations, modular arithmetic",
        ],
        suggestedProject: "Matrix operations library and text pattern finder in pure C/Python",
        recommendedResources: [
          "HackerRank 30 Days of Code",
          "Khan Academy: Discrete Mathematics & Probability",
        ],
      },
      {
        id: "fy-4",
        title: "Phase 4: Web Foundations & First Interactive Project",
        timeframe: "Weeks 17 – 24 (Semester 2)",
        description:
          "Understand how the internet, browsers, and client-server architectures work by building simple web apps.",
        requiredSkills: ["HTML/CSS", "JavaScript", "UI Basics"],
        topics: [
          "Semantic HTML5 (tags, forms, accessibility)",
          "Modern CSS (Flexbox, Grid, Responsive Media Queries)",
          "Vanilla JavaScript (DOM manipulation, event listeners, fetch API)",
          "HTTP methods (GET, POST), status codes, and JSON parsing",
          "Free hosting via GitHub Pages or Vercel",
        ],
        suggestedProject: "Interactive Personal Portfolio & Quiz App deployed on GitHub Pages",
        recommendedResources: [
          "The Odin Project: Foundations",
          "MDN Web Docs (Mozilla Developer Network)",
        ],
      },
      {
        id: "fy-5",
        title: "Phase 5: First Hackathon & Open Source Exploration",
        timeframe: "Weeks 25 – 30 (Semester 2)",
        description:
          "Collaborate with peers, participate in departmental hackathons, and contribute to beginner open-source issues.",
        requiredSkills: ["Teamwork", "Problem Solving", "Git"],
        topics: [
          "How to read other engineers' codebases on GitHub",
          "Finding 'good first issue' tags in open-source projects",
          "Hackathon brainstorming, rapid prototyping, and pitching",
          "Preparing for 2nd Year resume creation with real completed projects",
        ],
        suggestedProject: "Collaborative 2-person hackathon project solving a campus problem",
        recommendedResources: [
          "First Contributions (GitHub repository)",
          "Devpost: Student Hackathons",
        ],
      },
    ],
  },
  {
    id: "basic-required-stack",
    title: "Basic Required Tech Stack (Industry Must-Knows)",
    badge: "Universal Requirement",
    category: "basic-stack",
    forYear: "All Engineering Years",
    summary:
      "The baseline technical toolbox expected by 95% of software and IT recruiters. Mastering this stack ensures you clear Zero Round company screenings.",
    basicRequiredStack: [
      "Git & GitHub",
      "Linux / Bash CLI",
      "SQL & Relational Databases",
      "RESTful API Architecture",
      "Docker Containers",
      "Data Structures & Complexity",
    ],
    milestones: [
      {
        id: "bs-1",
        title: "Milestone 1: Relational Databases & SQL Mastery",
        timeframe: "Core Competency",
        description:
          "Every software engineer must know how to model relational data and write optimized SQL queries.",
        requiredSkills: ["SQL", "Databases"],
        topics: [
          "DDL & DML commands (CREATE, INSERT, UPDATE, DELETE)",
          "Complex JOINs (INNER, LEFT, RIGHT, FULL OUTER)",
          "Aggregation (GROUP BY, HAVING, COUNT, SUM, AVG)",
          "Database Indexing (B-Trees, Composite Indexes, Query Execution Plans)",
          "Database Normalization (1NF, 2NF, 3NF, BCNF) and ACID transactions",
        ],
        suggestedProject: "E-Commerce Database Schema with high-performance reporting queries",
        recommendedResources: ["Mode Analytics SQL Tutorial", "SQLBolt Interactive Exercises"],
      },
      {
        id: "bs-2",
        title: "Milestone 2: RESTful APIs & Network Fundamentals",
        timeframe: "Core Competency",
        description:
          "Understand how client and server machines communicate over HTTP/HTTPS protocols.",
        requiredSkills: ["JavaScript / Node.js", "APIs", "Networking"],
        topics: [
          "HTTP Request/Response lifecycle, Headers, and Status Codes",
          "REST principles: Statelessness, URIs, Resources, and JSON payloads",
          "API Authentication: API Keys, JWT (JSON Web Tokens), and OAuth basics",
          "CORS (Cross-Origin Resource Sharing) and security policies",
          "Testing APIs using Postman or Thunder Client",
        ],
        suggestedProject: "Secure RESTful CRUD API with JWT authentication and rate limiting",
        recommendedResources: ["Postman API Fundamentals", "freeCodeCamp Backend Development"],
      },
      {
        id: "bs-3",
        title: "Milestone 3: Containerization & Cloud Basics",
        timeframe: "Core Competency",
        description:
          "Package applications so they run reliably anywhere and understand basic cloud hosting.",
        requiredSkills: ["Docker", "Cloud", "DevOps"],
        topics: [
          "Why containers replace 'it works on my machine' problems",
          "Writing optimized Dockerfiles with multi-stage builds",
          "Docker Compose for multi-container apps (Web + Database + Cache)",
          "Cloud primitives: Compute (VMs), Object Storage (S3), and Managed DBs",
          "Deploying containers to cloud platforms (AWS, Render, GCP Cloud Run)",
        ],
        suggestedProject: "Containerized Full-Stack App orchestrated with Docker Compose",
        recommendedResources: ["Docker for Beginners (Docker Docs)", "AWS Cloud Practitioner Essentials"],
      },
    ],
  },
  {
    id: "full-stack-web",
    title: "Full Stack Web Development (React & Node.js / Next.js)",
    badge: "Most In-Demand",
    category: "specialization",
    forYear: "2nd Year to 4th Year",
    summary:
      "A complete journey from modern JavaScript and React to scalable server architectures, Next.js, relational databases, and production deployments.",
    basicRequiredStack: [
      "TypeScript",
      "React.js & Next.js",
      "Tailwind CSS",
      "Node.js & Express",
      "PostgreSQL & Prisma",
      "CI/CD Deployment",
    ],
    milestones: [
      {
        id: "fs-1",
        title: "Milestone 1: TypeScript & Modern React Architecture",
        timeframe: "Frontend Track",
        description: "Write type-safe UI components with stateful hooks and responsive styling.",
        requiredSkills: ["TypeScript", "React", "UI/UX"],
        topics: [
          "TypeScript types, interfaces, generics, and type narrowing",
          "React Hooks: useState, useEffect, useMemo, useCallback, useRef",
          "Component composition, custom hooks, and context state",
          "Tailwind CSS utility styling and design systems",
        ],
        suggestedProject: "Responsive Kanban Task Manager with drag-and-drop state",
        recommendedResources: ["React Docs (react.dev)", "Total TypeScript by Matt Pocock"],
      },
      {
        id: "fs-2",
        title: "Milestone 2: Full-Stack Next.js App Router & Server Actions",
        timeframe: "Full-Stack Track",
        description: "Combine SSR, client components, and server actions in a unified framework.",
        requiredSkills: ["Next.js", "React", "PostgreSQL"],
        topics: [
          "Next.js App Router, Server Components vs Client Components",
          "Server Actions, Data Fetching, Revalidation, and Caching",
          "PostgreSQL database integration with Prisma ORM",
          "User authentication with NextAuth.js / Auth.js",
        ],
        suggestedProject: "SaaS Feedback & Feature Voting Platform with Auth and Payments",
        recommendedResources: ["Next.js Official Learn Course", "Prisma Docs & Guides"],
      },
    ],
  },
  {
    id: "dsa-placement",
    title: "Data Structures, Algorithms & Campus Placement Prep",
    badge: "Placement Priority",
    category: "specialization",
    forYear: "2nd to 4th Year (Placement Ready)",
    summary:
      "Systematic mastery of coding interview patterns, algorithmic complexity, and aptitude drills required to clear Day 1 placement drives and company Zero Rounds.",
    basicRequiredStack: [
      "Java / C++ / Python",
      "Dynamic Programming",
      "Graphs & Trees",
      "Two Pointers & Slid. Window",
      "System Design 101",
      "Quantitative Aptitude",
    ],
    milestones: [
      {
        id: "dsa-1",
        title: "Phase 1: Linear Structures & Two Pointer Patterns",
        timeframe: "Weeks 1 – 4",
        description: "Core array, string, and linked list patterns seen in 50% of screening rounds.",
        requiredSkills: ["Data Structures", "Problem Solving"],
        topics: [
          "Two Pointers (Left-Right, Fast-Slow / Floyd's Cycle)",
          "Sliding Window (Fixed vs Variable size)",
          "Hash Maps & Prefix Sums for O(1) lookups",
          "Stack Monotonic patterns (Next Greater Element)",
        ],
        suggestedProject: "Solve Top 50 LeetCode Easy & Medium linear structure problems",
        recommendedResources: ["NeetCode 150 Roadmap", "Striver A2Z DSA Sheet"],
      },
      {
        id: "dsa-2",
        title: "Phase 2: Trees, Graphs & Dynamic Programming",
        timeframe: "Weeks 5 – 10",
        description: "Master hierarchical, network, and recursive memoization algorithms.",
        requiredSkills: ["Data Structures", "Algorithms"],
        topics: [
          "Binary Trees (BFS level-order, DFS pre/in/post-order, Lowest Common Ancestor)",
          "Binary Search Trees (Validation, balanced rotations)",
          "Graph traversals (BFS, DFS, Cycle detection, Dijkstra's Shortest Path)",
          "Dynamic Programming (1D memoization, 2D Grid, 0/1 Knapsack, Longest Common Subseq)",
        ],
        suggestedProject: "Build an algorithmic visualizer for Graph & Tree traversals",
        recommendedResources: ["MIT 6.006: Introduction to Algorithms", "LeetCode Graph & DP Cards"],
      },
    ],
  },
  {
    id: "ai-data-science",
    title: "AI, Machine Learning & Data Science Roadmap",
    badge: "High Growth",
    category: "specialization",
    forYear: "2nd Year to 4th Year",
    summary:
      "From numerical Python and statistical modeling to Deep Learning, LLM prompt engineering, and production ML pipelines.",
    basicRequiredStack: [
      "Python",
      "NumPy & Pandas",
      "Scikit-Learn",
      "PyTorch",
      "LLMs & LangChain",
      "SQL",
    ],
    milestones: [
      {
        id: "ai-1",
        title: "Phase 1: Data Wrangling, EDA & Classical Machine Learning",
        timeframe: "Weeks 1 – 8",
        description: "Transform raw tabular data into predictive insights using supervised algorithms.",
        requiredSkills: ["Python", "Machine Learning", "SQL"],
        topics: [
          "NumPy matrix vectorization and Pandas DataFrame transformations",
          "Exploratory Data Analysis (EDA) and visualization with Matplotlib / Seaborn",
          "Supervised algorithms: Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost",
          "Model evaluation: Cross-validation, Precision/Recall, ROC-AUC, Confusion Matrix",
        ],
        suggestedProject: "End-to-End Placement Salary Prediction model with interactive Streamlit app",
        recommendedResources: ["Kaggle Learn Micro-Courses", "Hands-On Machine Learning (Aurélien Géron)"],
      },
      {
        id: "ai-2",
        title: "Phase 2: Deep Learning, NLP & Generative AI Systems",
        timeframe: "Weeks 9 – 16",
        description: "Build neural networks, understand attention mechanisms, and develop LLM RAG pipelines.",
        requiredSkills: ["Deep Learning", "Python", "LLMs"],
        topics: [
          "Neural network basics: Backpropagation, activation functions, loss functions",
          "PyTorch tensors, datasets, dataloaders, and training loops",
          "Transformers architecture: Self-attention and token embeddings",
          "Retrieval-Augmented Generation (RAG) using LangChain / LlamaIndex and Vector DBs",
        ],
        suggestedProject: "Document Q&A Bot using RAG with local vector embeddings",
        recommendedResources: ["Fast.ai: Practical Deep Learning for Coders", "Hugging Face NLP Course"],
      },
    ],
  },
];

