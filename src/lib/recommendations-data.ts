export interface YouTubeVideo {
  title: string;
  channel: string;
  url: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
}

export interface RecommendedCourse {
  title: string;
  platform: string;
  isFree: boolean;
  url: string;
  estimatedTime: string;
  description: string;
}

export interface SkillRemediation {
  skillId: string;
  skillName: string;
  gapSummary: string;
  youtubeVideos: YouTubeVideo[];
  courses: RecommendedCourse[];
}

export const SKILL_REMEDIATION: Record<string, SkillRemediation> = {
  python: {
    skillId: "python",
    skillName: "Python",
    gapSummary:
      "Core Python fundamentals, data structures, and script automation need reinforcement before taking company technical rounds.",
    youtubeVideos: [
      {
        title: "Python Full Course for Beginners [2026 Edition]",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        duration: "4.5 Hours",
        level: "Beginner",
        description: "Covers variables, loops, lists, dictionaries, tuples, and basic algorithms.",
      },
      {
        title: "Python OOP & Memory Architecture Masterclass",
        channel: "Corey Schafer",
        url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
        duration: "6 Video Series",
        level: "Intermediate",
        description: "Classes, instances, inheritance, dunder methods, and decorators.",
      },
      {
        title: "Chai aur Python (Hindi Playlist)",
        channel: "Chai aur Code",
        url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBsMugTFALhdBrZBQVNqRXb",
        duration: "Complete Course",
        level: "Beginner",
        description: "Step-by-step logic building, memory management, and practical projects.",
      },
    ],
    courses: [
      {
        title: "CS50P: CS50's Introduction to Programming with Python",
        platform: "Harvard University (edX)",
        isFree: true,
        url: "https://cs50.harvard.edu/python/",
        estimatedTime: "5 Weeks",
        description: "Harvard's world-class introduction to programming syntax, testing, and debugging.",
      },
      {
        title: "Google IT Automation with Python Professional Certificate",
        platform: "Coursera (Google)",
        isFree: false,
        url: "https://www.coursera.org/professional-certificates/google-it-automation",
        estimatedTime: "6 Months",
        description: "Learn Git, automation, configuration management, and troubleshooting in Python.",
      },
    ],
  },

  js: {
    skillId: "js",
    skillName: "JavaScript",
    gapSummary:
      "Understand the JavaScript Event Loop, asynchronous Promises, closures, and ES6+ features.",
    youtubeVideos: [
      {
        title: "Namaste JavaScript (Deep Dive & Event Loop)",
        channel: "Akshay Saini",
        url: "https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
        duration: "Season 1 & 2",
        level: "Intermediate",
        description: "Call stack, microtask queue, execution context, hoisting, and closures.",
      },
      {
        title: "JavaScript Tutorial for Beginners - Full Course in 8 Hours",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        duration: "8 Hours",
        level: "Beginner",
        description: "Modern JavaScript basics, DOM manipulation, arrays, and async/await.",
      },
    ],
    courses: [
      {
        title: "The Odin Project: Full Stack JavaScript Curriculum",
        platform: "The Odin Project",
        isFree: true,
        url: "https://www.theodinproject.com/paths/full-stack-javascript",
        estimatedTime: "Self-Paced",
        description: "Community-driven, hands-on path covering JS from core fundamentals to backend Node.",
      },
    ],
  },

  react: {
    skillId: "react",
    skillName: "React",
    gapSummary:
      "Component lifecycle, state immutability, useEffect cleanup, and hook composition require targeted practice.",
    youtubeVideos: [
      {
        title: "React JS Full Course 2026 - Build 4 Projects",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        duration: "10 Hours",
        level: "Beginner",
        description: "JSX, props, useState, useEffect, context, and custom hooks with live projects.",
      },
      {
        title: "Chai aur React (Complete Series with Hooks)",
        channel: "Chai aur Code",
        url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige",
        duration: "30 Videos",
        level: "Intermediate",
        description: "Covers virtual DOM reconciliation, state batches, routing, and Tailwind styling.",
      },
    ],
    courses: [
      {
        title: "Full Stack Open (Deep Dive into Modern Web Development)",
        platform: "University of Helsinki",
        isFree: true,
        url: "https://fullstackopen.com/en/",
        estimatedTime: "Part-time (12 weeks)",
        description: "Official Finnish university course on React, Redux, Node.js, and TypeScript.",
      },
    ],
  },

  sql: {
    skillId: "sql",
    skillName: "SQL & Relational Databases",
    gapSummary:
      "Complex table joins, grouping clauses (HAVING vs WHERE), and indexing concepts need review.",
    youtubeVideos: [
      {
        title: "SQL Tutorial - Full Database Course for Beginners",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
        duration: "4.5 Hours",
        level: "Beginner",
        description: "Schema design, DDL, DML, joins, foreign keys, and analytical queries.",
      },
      {
        title: "SQL Indexing and Query Performance Tuning",
        channel: "Hussein Nasser",
        url: "https://www.youtube.com/watch?v=HubezKbFL7E",
        duration: "1.5 Hours",
        level: "Advanced",
        description: "B-Trees, primary vs secondary indexes, clustered indexes, and query execution plans.",
      },
    ],
    courses: [
      {
        title: "SQLBolt - Interactive Lessons and Queries in Browser",
        platform: "SQLBolt",
        isFree: true,
        url: "https://sqlbolt.com/",
        estimatedTime: "6 Hours",
        description: "Hands-on browser-based query challenges from SELECT basics to complex aggregations.",
      },
    ],
  },

  ds: {
    skillId: "ds",
    skillName: "Data Structures & Algorithms",
    gapSummary:
      "Time/space complexity reasoning, tree traversals, graphs, and dynamic programming patterns are critical for company Zero Rounds.",
    youtubeVideos: [
      {
        title: "NeetCode Roadmap - 150 Most Asked LeetCode Patterns",
        channel: "NeetCode",
        url: "https://www.youtube.com/c/NeetCode",
        duration: "Curated Series",
        level: "Intermediate",
        description: "Visual walkthroughs of arrays, trees, graphs, heaps, and dynamic programming.",
      },
      {
        title: "Striver A2Z DSA Placement Series (C++ & Java)",
        channel: "take U forward",
        url: "https://www.youtube.com/c/takeUforward",
        duration: "Comprehensive",
        level: "Intermediate",
        description: "Topic-by-topic placement prep covering all standard Indian campus recruitment problems.",
      },
    ],
    courses: [
      {
        title: "Algorithms, Part I & II (Robert Sedgewick & Kevin Wayne)",
        platform: "Princeton University (Coursera)",
        isFree: true,
        url: "https://www.coursera.org/learn/algorithms-part1",
        estimatedTime: "6 Weeks",
        description: "Covers elementary data structures, sorting, searching, graphs, and shortest paths.",
      },
    ],
  },

  prob: {
    skillId: "prob",
    skillName: "Quantitative & Logical Aptitude",
    gapSummary:
      "Aptitude accuracy is tested in Day 1 placement rounds and screening tests. Practice number series, speed/time, and deductions.",
    youtubeVideos: [
      {
        title: "Quantitative Aptitude Complete Playlist for Placement Exams",
        channel: "CareerRide",
        url: "https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
        duration: "40 Videos",
        level: "Beginner",
        description: "Time & work, pipes, trains, probability, and profit-loss tricks for IT recruitment drives.",
      },
      {
        title: "Logical Reasoning Shortcuts & Formulas for Campus Drives",
        channel: "Feel Free to Learn",
        url: "https://www.youtube.com/c/FeelFreetoLearn",
        duration: "Comprehensive",
        level: "Beginner",
        description: "Coding-decoding, blood relations, syllogisms, and seating arrangements.",
      },
    ],
    courses: [
      {
        title: "IndiaBIX Online Aptitude Practice Suite",
        platform: "IndiaBIX",
        isFree: true,
        url: "https://www.indiabix.com/",
        estimatedTime: "Daily Drills",
        description: "Over 5,000 solved questions with explanations across arithmetic, data interpretation, and verbal logic.",
      },
    ],
  },

  cloud: {
    skillId: "cloud",
    skillName: "Cloud Computing & DevOps",
    gapSummary:
      "Cloud architecture, containerization (Docker), and microservices patterns need improvement.",
    youtubeVideos: [
      {
        title: "AWS Certified Cloud Practitioner Training 2026",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
        duration: "14 Hours",
        level: "Beginner",
        description: "EC2, S3, IAM, VPC, RDS, and cloud pricing models explained clearly.",
      },
      {
        title: "Docker Tutorial for Beginners (Full Course)",
        channel: "TechWorld with Nana",
        url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
        duration: "3 Hours",
        level: "Beginner",
        description: "Images, containers, Dockerfiles, volumes, networks, and docker-compose.",
      },
    ],
    courses: [
      {
        title: "AWS Cloud Technical Essentials",
        platform: "Coursera (AWS)",
        isFree: true,
        url: "https://www.coursera.org/learn/aws-cloud-technical-essentials",
        estimatedTime: "4 Weeks",
        description: "Official foundational AWS course covering compute, networking, storage, and database services.",
      },
    ],
  },

  ml: {
    skillId: "ml",
    skillName: "Machine Learning & AI",
    gapSummary:
      "Reinforce linear algebra, feature engineering, loss functions, and model validation techniques.",
    youtubeVideos: [
      {
        title: "Machine Learning for Everybody",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
        duration: "4 Hours",
        level: "Beginner",
        description: "Supervised algorithms, regression, classification, clustering, and neural networks in Python.",
      },
      {
        title: "StatQuest with Josh Starmer - Machine Learning Playlist",
        channel: "StatQuest",
        url: "https://www.youtube.com/c/joshstarmer",
        duration: "Visual Series",
        level: "Intermediate",
        description: "Intuitive, formula-free visual explanations of decision trees, SVM, PCA, and gradient descent.",
      },
    ],
    courses: [
      {
        title: "Machine Learning Specialization by Andrew Ng",
        platform: "Coursera (DeepLearning.AI)",
        isFree: false,
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        estimatedTime: "3 Months",
        description: "The gold standard foundational course taught by Andrew Ng.",
      },
    ],
  },

  java: {
    skillId: "java",
    skillName: "Java & Object-Oriented Design",
    gapSummary:
      "Core Java collections framework, multithreading, OOP inheritance, and memory management need improvement.",
    youtubeVideos: [
      {
        title: "Java Tutorial for Beginners [Full Course]",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=A74TOX803D0",
        duration: "9.5 Hours",
        level: "Beginner",
        description: "Variables, OOP principles, interfaces, exception handling, and collections framework.",
      },
      {
        title: "Java Multithreading & Concurrency Crash Course",
        channel: "Defog Tech",
        url: "https://www.youtube.com/watch?v=L953eS_5k3s",
        duration: "2 Hours",
        level: "Intermediate",
        description: "Threads, synchronized locks, ExecutorService, and thread-safe data structures.",
      },
    ],
    courses: [
      {
        title: "Java Programming: Solving Problems with Software",
        platform: "Duke University (Coursera)",
        isFree: true,
        url: "https://www.coursera.org/learn/java-programming",
        estimatedTime: "4 Weeks",
        description: "Foundational Java syntax, data structures, and algorithmic problem-solving.",
      },
    ],
  },

  uiux: {
    skillId: "uiux",
    skillName: "UI/UX & Frontend Design",
    gapSummary:
      "Component design systems, responsive layout principles, and user research heuristics need refinement.",
    youtubeVideos: [
      {
        title: "Figma UI Design Tutorial: Get Started in 2026",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=jwCmIBJ8J_4",
        duration: "3.5 Hours",
        level: "Beginner",
        description: "Frames, auto-layout, components, typography hierarchy, and wireframing.",
      },
    ],
    courses: [
      {
        title: "Google UX Design Professional Certificate",
        platform: "Coursera (Google)",
        isFree: false,
        url: "https://www.coursera.org/professional-certificates/google-ux-design",
        estimatedTime: "6 Months",
        description: "End-to-end design thinking, user journey maps, wireframes, and high-fidelity mockups.",
      },
    ],
  },

  cyber: {
    skillId: "cyber",
    skillName: "Cybersecurity & Web Defense",
    gapSummary:
      "OWASP Top 10 web vulnerabilities, network protocols, and cryptographic concepts require study.",
    youtubeVideos: [
      {
        title: "Cybersecurity Full Course for Beginners [2026]",
        channel: "freeCodeCamp.org",
        url: "https://www.youtube.com/watch?v=U_P23SqJaDc",
        duration: "6 Hours",
        level: "Beginner",
        description: "Network security, ethical hacking, malware analysis, and defensive controls.",
      },
      {
        title: "Web Security Explained (OWASP Top 10)",
        channel: "NetworkChuck",
        url: "https://www.youtube.com/c/NetworkChuck",
        duration: "Playlist",
        level: "Beginner",
        description: "Hands-on explanations of SQLi, XSS, CSRF, and authentication bypasses.",
      },
    ],
    courses: [
      {
        title: "Google Cybersecurity Professional Certificate",
        platform: "Coursera (Google)",
        isFree: false,
        url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
        estimatedTime: "6 Months",
        description: "Prepares for entry-level security analyst roles with Linux, SQL, and Python SIEM tools.",
      },
    ],
  },
};

export function getRemediationsForSkills(skillIds: string[]): SkillRemediation[] {
  const result: SkillRemediation[] = [];
  const added = new Set<string>();

  for (const sk of skillIds) {
    if (SKILL_REMEDIATION[sk] && !added.has(sk)) {
      result.push(SKILL_REMEDIATION[sk]);
      added.add(sk);
    }
  }

  // Always supplement with DSA or Aptitude if list is short
  if (result.length < 2) {
    if (!added.has("prob")) result.push(SKILL_REMEDIATION.prob);
    if (!added.has("ds") && result.length < 3) result.push(SKILL_REMEDIATION.ds);
  }

  return result;
}

export interface RejectionRemediationPlan {
  opportunityTitle: string;
  company: string;
  reason: string;
  gapSkills: string[];
  remediations: SkillRemediation[];
  fastTrackPlan: {
    stepNumber: number;
    title: string;
    detail: string;
    estimatedDays: string;
  }[];
}

export function getRejectionRemediationPlan(params: {
  opportunityTitle: string;
  company: string;
  requiredSkills: string[];
  zeroRoundResult?: {
    passed: boolean;
    stageReached?: string;
    easyScore?: number;
    mediumScore?: number;
    totalScore?: number;
    switchCount?: number;
  };
}): RejectionRemediationPlan {
  const { opportunityTitle, company, requiredSkills, zeroRoundResult } = params;

  let reason = `Application not selected for ${opportunityTitle} at ${company}.`;

  if (zeroRoundResult) {
    if (zeroRoundResult.switchCount && zeroRoundResult.switchCount >= 2) {
      reason = `Disqualified due to screen switch violation (proctoring detected ${zeroRoundResult.switchCount} tab/screen transitions). Company enforces strict zero-tolerance proctoring.`;
    } else if (zeroRoundResult.easyScore !== undefined && zeroRoundResult.easyScore < 35) {
      reason = `Did not meet Round 0 Easy Level screening threshold (Scored ${zeroRoundResult.easyScore}% vs 35% minimum required). Foundational concepts in ${requiredSkills.join(", ")} need immediate review.`;
    } else if (zeroRoundResult.mediumScore !== undefined && zeroRoundResult.mediumScore < 75) {
      reason = `Passed Easy Level, but fell short of the 75% threshold on Medium Level questions (Scored ${zeroRoundResult.mediumScore}%). Practical implementation skills in ${requiredSkills.join(", ")} need strengthening.`;
    } else {
      reason = `Overall candidate screening score (${zeroRoundResult.totalScore}%) was below the company's recruitment cutoff for this opening.`;
    }
  }

  const remediations = getRemediationsForSkills(requiredSkills);

  const fastTrackPlan = [
    {
      stepNumber: 1,
      title: "Watch Recommended YouTube Crash Courses",
      detail: `Review core concepts and debugging patterns for ${requiredSkills.slice(0, 3).join(", ")}. Focus on interview pitfalls and problem walkthroughs.`,
      estimatedDays: "3 – 5 Days",
    },
    {
      stepNumber: 2,
      title: "Enroll in Targeted University / Free Course Module",
      detail: `Complete the recommended hands-on exercises and assignments to build verifiable evidence.`,
      estimatedDays: "1 – 2 Weeks",
    },
    {
      stepNumber: 3,
      title: "Build a Mini-Project & Retake Practice Screening",
      detail: `Implement a working project covering the required tech stack (${requiredSkills.join(", ")}) and push it to your GitHub portfolio before re-applying.`,
      estimatedDays: "3 – 4 Days",
    },
  ];

  return {
    opportunityTitle,
    company,
    reason,
    gapSkills: requiredSkills,
    remediations,
    fastTrackPlan,
  };
}

