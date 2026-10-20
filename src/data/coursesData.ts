import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'course-react-fullstack',
    title: 'Full-Stack React & Modern Architecture',
    slug: 'react-fullstack-architecture',
    tagline: 'Master modern component patterns, state machines, server boundaries, and high-performance apps.',
    description: 'A comprehensive curriculum engineered for engineers building resilient, scalable enterprise web applications. Learn patterns from hooks composition to SSR hydration and performance audits.',
    category: 'Web Development',
    level: 'Intermediate',
    durationHours: 18,
    instructor: {
      name: 'Dr. Sarah Lin',
      role: 'Principal Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    rating: 4.9,
    enrolledCount: 3820,
    accentColor: 'indigo',
    iconName: 'Code',
    prerequisites: ['Basic JavaScript ES6+', 'HTML5 & CSS Fundamentals', 'Basic React concepts'],
    skillsLearned: [
      'Component Composition & Polymorphic Components',
      'Advanced Custom Hooks & State Primitives',
      'Vite & Vercel Build Optimization',
      'Data Fetching with Optimistic UI & Invalidation',
      'Enterprise Error Boundaries & Hydration Fixes'
    ],
    modules: [
      {
        id: 'mod-react-foundations',
        title: 'Module 1: Resilient Component Architecture',
        description: 'Deep dive into component lifecycle, rendering budgets, and memory leak prevention.',
        lessons: [
          {
            id: 'lesson-react-1',
            title: '1.1 Render Pipeline & Re-render Optimization',
            type: 'concept',
            durationMinutes: 15,
            summary: 'Demystifying the React fiber reconciliation tree, virtual DOM diffing, and memoization boundaries.',
            sections: [
              {
                heading: 'The True Cost of Component Re-renders',
                content: 'In modern React, re-renders are generally fast, but non-deterministic side-effects, deep object tree passes, and un-memoized heavy calculations can create micro-stutters during 60fps animations. Understanding when React re-renders a subtree is crucial.',
                callout: {
                  type: 'key-takeaway',
                  text: 'A component re-renders when its state changes or its parent re-renders — NOT simply because props change! Props are compared only when React.memo is applied.'
                }
              },
              {
                heading: 'Targeted Memoization with useMemo & useCallback',
                content: 'Use memoization selectively. Avoid wrapping every primitive. Focus on stable references passed down to memoized children or complex computations like array filtering and matrix transformations.',
                codeSnippet: {
                  language: 'typescript',
                  code: `// Good: Stable handler preventing re-rendering of optimized child
const handleFilterChange = useCallback((newCategory: string) => {
  setFilters((prev) => ({ ...prev, category: newCategory }));
}, []);

// Expensive calculation cached until items or query changes
const visibleItems = useMemo(() => {
  return items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [items, searchQuery]);`,
                  caption: 'Memoizing callback and derived state'
                }
              },
              {
                heading: 'Common Antipatterns to Avoid',
                content: 'Avoid defining functions or object literals directly inside render loops when passing to deeply nested components, and avoid syncing state via useEffect when derived state suffices.',
                callout: {
                  type: 'tip',
                  text: 'Whenever you can calculate a value from existing props or state, compute it directly during rendering rather than creating a secondary state and useEffect!'
                }
              }
            ]
          },
          {
            id: 'lesson-react-2',
            title: '1.2 Hands-On: Build a Debounced Search Filter',
            type: 'interactive-code',
            durationMinutes: 20,
            summary: 'Implement an interactive debounced search filter that prevents excessive rendering.',
            codeExercise: {
              language: 'typescript',
              instructions: 'Complete the debounce helper function inside the component to prevent instant API triggers on every keystroke. Your debounce should delay execution by 300ms.',
              starterCode: `function createDebounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    // TODO: Clear previous timer and set a new setTimeout
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Test trigger
let callCount = 0;
const search = createDebounce((term) => {
  callCount++;
  console.log("Searching for:", term, "- callCount:", callCount);
}, 200);

search("re");
search("reac");
search("react");`,
              solutionCode: `function createDebounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Test trigger
let callCount = 0;
const search = createDebounce((term) => {
  callCount++;
  console.log("Searching for:", term, "- callCount:", callCount);
}, 200);

search("re");
search("reac");
search("react");`,
              expectedOutputHint: 'Searching for: react - callCount: 1 (after 200ms)',
              tests: [
                {
                  description: 'Contains clearTimeout and setTimeout',
                  validate: (code: string) => code.includes('clearTimeout') && code.includes('setTimeout')
                }
              ]
            }
          },
          {
            id: 'lesson-react-3',
            title: '1.3 Knowledge Check: React Rendering Engine',
            type: 'quiz',
            durationMinutes: 10,
            summary: 'Test your understanding of component re-renders, hook rules, and state updates.',
            quiz: [
              {
                id: 'q1',
                question: 'When will a child component wrapped in React.memo re-render?',
                options: [
                  'Every time the parent component re-renders',
                  'Only when one of its props changes by shallow comparison (or custom comparator)',
                  'Never, React.memo freezes all updates permanently',
                  'Only when window resize events trigger'
                ],
                correctAnswer: 1,
                explanation: 'React.memo performs a shallow comparison of current and next props. It skips re-rendering if all props remain reference-equal.'
              },
              {
                id: 'q2',
                question: 'Why should you avoid using an array index as a React list key?',
                options: [
                  'React throws a compile-time syntax error',
                  'It degrades reordering, inserting, or deleting items and causes state mismatch in children',
                  'It causes memory leaks in the browser V8 engine',
                  'It prevents CSS flexbox from styling correctly'
                ],
                correctAnswer: 1,
                explanation: 'Using indices as keys breaks item identity during insertions, deletions, or reorders, leading to incorrect state mapping in child inputs.'
              },
              {
                id: 'q3',
                question: 'What is the recommended approach for derived values in React?',
                options: [
                  'Create a new useState and synchronize it inside a useEffect',
                  'Calculate the value inline during render or with useMemo if computationally intensive',
                  'Store it in window global object',
                  'Dispatch a custom browser event'
                ],
                correctAnswer: 1,
                explanation: 'Computing derived values directly in render avoids redundant re-renders and eliminates synchronization bugs caused by unnecessary useEffect hooks.'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-react-deploy',
        title: 'Module 2: Build Systems, Vite & Vercel Deployments',
        description: 'Master package bundling, dependency resolution, lockfiles, and zero-downtime CI/CD pipelines.',
        lessons: [
          {
            id: 'lesson-react-4',
            title: '2.1 Solving npm ERESOLVE & Peer Dependency Conflicts',
            type: 'concept',
            durationMinutes: 18,
            summary: 'Learn why npm 7+ fails with ERESOLVE, how peer dependencies work, and how to fix build errors on Vercel.',
            sections: [
              {
                heading: 'Understanding npm ERESOLVE Errors',
                content: 'Starting in npm v7, npm automatically installs and strictly validates peer dependencies. If package A requires esbuild@^0.27.0 (like modern Vite 8) and your root package.json specifies esbuild@^0.25.0, npm refuses to resolve the conflicting tree and terminates with code ERESOLVE.',
                callout: {
                  type: 'warning',
                  text: 'This is the exact error encountered when deploying to Vercel: npm error Found: esbuild@0.25.12, but peerOptional esbuild@^0.27.0 || ^0.28.0 from vite.'
                }
              },
              {
                heading: 'Two-Pronged Resolution Strategy',
                content: '1. Remove duplicate or conflicting low-level packages from devDependencies. Build tools like Vite already include or manage their own compatible binaries.\n2. Configure .npmrc with legacy-peer-deps=true to allow npm to bypass strict peer conflicts during automated CI/CD builds.',
                codeSnippet: {
                  language: 'ini',
                  code: `# .npmrc in project root
legacy-peer-deps=true`,
                  caption: 'Safe configuration file committed to repository'
                }
              },
              {
                heading: 'Vercel Deployment Best Practices',
                content: 'Ensure your build command is "vite build" (or "npm run build") and your output directory is configured to "dist". Check that environment variables like GEMINI_API_KEY are configured in the Vercel Project Settings > Environment Variables tab.',
                callout: {
                  type: 'tip',
                  text: 'Always commit your lockfile (package-lock.json) so production environments install identical dependency trees to your local development machine.'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-cloud-devops',
    title: 'Cloud DevOps, Docker & CI/CD Pipelines',
    slug: 'cloud-devops-docker-cicd',
    tagline: 'Ship robust applications with Docker containers, GitHub Actions, and production cloud infrastructure.',
    description: 'Learn modern DevOps workflows from containerizing microservices to automating deployments, managing reverse proxies, monitoring logs, and configuring production environments.',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    durationHours: 14,
    instructor: {
      name: 'Marcus Vance',
      role: 'Staff DevOps & Site Reliability Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    rating: 4.85,
    enrolledCount: 2940,
    accentColor: 'emerald',
    iconName: 'Server',
    prerequisites: ['Basic Command Line (Bash/Zsh)', 'Basic Git & GitHub', 'Fundamentals of Networking (DNS, HTTP)'],
    skillsLearned: [
      'Multi-stage Dockerfile builds for minimal image size',
      'Docker Compose orchestration for local services',
      'GitHub Actions CI/CD with automated testing',
      'Vercel and Cloud Run production deployments',
      'Environment Secrets & Security Hardening'
    ],
    modules: [
      {
        id: 'mod-devops-docker',
        title: 'Module 1: Production Multi-Stage Docker Builds',
        description: 'Techniques for slashing container size from 1.2GB down to 45MB with alpine & scratch layers.',
        lessons: [
          {
            id: 'lesson-devops-1',
            title: '1.1 Multi-Stage Dockerfiles for Node & Vite',
            type: 'concept',
            durationMinutes: 16,
            summary: 'Separating dependencies installation, compilation step, and static server runtime.',
            sections: [
              {
                heading: 'Why Multi-Stage Builds Matter',
                content: 'In modern cloud hosting, container image size directly impacts deployment speed, auto-scaling latency, and cloud storage costs. By separating build dependencies (Node.js, TypeScript, build tools) from the runtime, images stay lean and attack surfaces are reduced.',
                codeSnippet: {
                  language: 'dockerfile',
                  code: `# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal static serving with Nginx or Caddy
FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
                  caption: 'Production-ready two-stage Dockerfile'
                }
              }
            ]
          },
          {
            id: 'lesson-devops-2',
            title: '1.2 Hands-On: Docker Compose Configuration',
            type: 'interactive-code',
            durationMinutes: 20,
            summary: 'Write a valid Docker Compose configuration linking a web application and PostgreSQL database.',
            codeExercise: {
              language: 'json',
              instructions: 'Review the JSON representation of docker-compose services. Ensure both web and db services have restart policy set to "always" and proper environment definitions.',
              starterCode: `{
  "version": "3.8",
  "services": {
    "web": {
      "build": ".",
      "ports": ["3000:3000"],
      "environment": {
        "NODE_ENV": "production"
      },
      "restart": "always"
    },
    "db": {
      "image": "postgres:16-alpine",
      "ports": ["5432:5432"],
      "restart": "always"
    }
  }
}`,
              solutionCode: `{
  "version": "3.8",
  "services": {
    "web": {
      "build": ".",
      "ports": ["3000:3000"],
      "environment": {
        "NODE_ENV": "production"
      },
      "restart": "always"
    },
    "db": {
      "image": "postgres:16-alpine",
      "ports": ["5432:5432"],
      "restart": "always"
    }
  }
}`,
              expectedOutputHint: 'Validated docker compose structure',
              tests: [
                {
                  description: 'Contains web and db services with restart always',
                  validate: (code: string) => code.includes('"web"') && code.includes('"db"') && code.includes('"always"')
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course-applied-ai',
    title: 'Applied AI & LLM Systems Engineering',
    slug: 'applied-ai-llm-systems',
    tagline: 'Build intelligent applications with Gemini 2.5/3.0, embeddings, RAG, and function calling.',
    description: 'Go beyond toy demos. Construct production-grade generative AI workflows: structured JSON output, vector memory, dynamic tool calling, token budget management, and safety guardrails.',
    category: 'AI & Machine Learning',
    level: 'Advanced',
    durationHours: 20,
    instructor: {
      name: 'Elena Rostova',
      role: 'AI Research Lead & Author',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    rating: 4.95,
    enrolledCount: 4510,
    accentColor: 'purple',
    iconName: 'Cpu',
    prerequisites: ['Proficiency in TypeScript or Python', 'HTTP REST & Streaming APIs', 'Basic Linear Algebra concepts'],
    skillsLearned: [
      '@google/genai SDK implementation patterns',
      'Schema-enforced JSON structured output',
      'Function calling and agentic tool dispatch',
      'RAG pipeline with semantic similarity search',
      'Prompt caching, context compression & cost reduction'
    ],
    modules: [
      {
        id: 'mod-ai-sdk',
        title: 'Module 1: The Modern Gemini Developer SDK',
        description: 'Implementing the new @google/genai SDK with streaming, schema enforcement, and tool dispatch.',
        lessons: [
          {
            id: 'lesson-ai-1',
            title: '1.1 Schema-Enforced Structured Outputs',
            type: 'concept',
            durationMinutes: 18,
            summary: 'Using Type.OBJECT schemas with Gemini to guarantee valid, type-safe JSON payloads without hallucinated formats.',
            sections: [
              {
                heading: 'Why Schema Validation Matters for LLMs',
                content: 'When connecting an LLM to frontends, databases, or microservices, string parsing is brittle. With structured schemas, the model uses constrained decoding to strictly output only valid JSON matching your schema.',
                codeSnippet: {
                  language: 'typescript',
                  code: `import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI();

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Analyze the sentiment and extract keywords from this review: "Fantastic speed and intuitive UI!"',
  config: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
        score: { type: Type.NUMBER, description: 'Score between 0 and 1' },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['sentiment', 'score', 'keywords']
    }
  }
});

const result = JSON.parse(response.text!);
console.log(result.sentiment); // 'positive'`,
                  caption: 'Strict JSON schema extraction with @google/genai'
                }
              }
            ]
          },
          {
            id: 'lesson-ai-2',
            title: '1.2 Quiz: LLM Systems & Tool Execution',
            type: 'quiz',
            durationMinutes: 10,
            summary: 'Test your understanding of tool execution, streaming chunks, and model selection.',
            quiz: [
              {
                id: 'q-ai-1',
                question: 'Which model is recommended for high-frequency low-latency reasoning and general tasks?',
                options: [
                  'gemini-2.5-flash',
                  'gemini-1.0-ultra (legacy)',
                  'text-davinci-002',
                  'gpt-1'
                ],
                correctAnswer: 0,
                explanation: 'gemini-2.5-flash provides state-of-the-art speed, multimodal comprehension, and cost efficiency for production applications.'
              },
              {
                id: 'q-ai-2',
                question: 'How do function calling tools work with LLMs?',
                options: [
                  'The model executes system shell commands directly on the user machine',
                  'The model outputs a structured declaration indicating the function name and arguments, which the host application executes and returns the result to the model',
                  'The model connects directly to your SQL database over port 5432',
                  'The model overrides the operating system kernel'
                ],
                correctAnswer: 1,
                explanation: 'Function calling is safe and client-controlled: the model returns structured JSON calling arguments, your server runs the function, and feeds the output back into the conversation context.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-cybersecurity',
    title: 'Cybersecurity Defense & Secure Coding',
    slug: 'cybersecurity-defense-secure-coding',
    tagline: 'Protect modern applications from OWASP Top 10 vulnerabilities, auth bypasses, and data breaches.',
    description: 'Equip yourself with the offensive mindset and defensive architecture to build impenetrable applications. Cover JWT attacks, SQL/NoSQL injection, CORS, CSP headers, and zero-trust authentication.',
    category: 'Cybersecurity',
    level: 'Advanced',
    durationHours: 16,
    instructor: {
      name: 'Alexandre Dubois',
      role: 'Lead Security Researcher & Whitehat',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    rating: 4.92,
    enrolledCount: 2150,
    accentColor: 'rose',
    iconName: 'ShieldCheck',
    prerequisites: ['Web fundamentals (HTTP headers, cookies, sessions)', 'Basic JavaScript/TypeScript'],
    skillsLearned: [
      'OWASP Top 10 prevention & threat modeling',
      'Secure Cookie flags (HttpOnly, Secure, SameSite=Strict)',
      'Content Security Policy (CSP) & CORS configuration',
      'Rate-limiting, brute-force mitigation & DoS defense',
      'Cryptographic hashing with Argon2 / bcrypt'
    ],
    modules: [
      {
        id: 'mod-security-core',
        title: 'Module 1: Authentication & Token Security',
        description: 'Hardening JSON Web Tokens, session storage, and preventing XSS token theft.',
        lessons: [
          {
            id: 'lesson-sec-1',
            title: '1.1 The Secure Token Storage Dilemma',
            type: 'concept',
            durationMinutes: 15,
            summary: 'Why localStorage is vulnerable to XSS and how to use httpOnly, partitioned secure cookies.',
            sections: [
              {
                heading: 'Why localStorage is Dangerous for Sensitive Auth Tokens',
                content: 'Any JavaScript executing in your application — including third-party analytics scripts, ad pixels, or compromised dependencies — has complete read access to localStorage. If an attacker injects a single script tag via XSS, your user tokens can be exfiltrated instantly.',
                callout: {
                  type: 'warning',
                  text: 'Never store raw authorization JWTs or sensitive refresh tokens in localStorage or sessionStorage in production apps!'
                }
              },
              {
                heading: 'The Gold Standard: HttpOnly Secure Cookies',
                content: 'Store tokens in HttpOnly cookies with Secure and SameSite flags set. This makes the cookie invisible to document.cookie and JavaScript APIs, effectively blocking XSS token theft.',
                codeSnippet: {
                  language: 'typescript',
                  code: `// Express / Node.js secure cookie setup
res.cookie('auth_token', token, {
  httpOnly: true,       // Prevents client JS access
  secure: true,         // Only transmitted over HTTPS
  sameSite: 'strict',   // Defends against Cross-Site Request Forgery (CSRF)
  maxAge: 3600 * 1000   // 1 hour expiry
});`,
                  caption: 'Production-ready secure cookie flags'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
