export const portfolioProfile = {
  name: "Tomás Garbarino",
  role: "Product Engineer / Applied AI",
  headline: "Real problems. Working systems.",
  summary: "I build product experiences for AI-powered workflows.",
  opportunities:
    "Product Engineer, Applied AI and Forward Deployed Engineer opportunities.",
  email: "tomasgarbarino.dev@gmail.com",
  publishedPortfolio: "https://tomas-garbarino.vercel.app/en",
} as const;

export const portfolioMedia = {
  trainly: {
    src: "/media/trainly-product.png",
    width: 1350,
    height: 652,
    alt: "Trainly public demo: the campus interface with an onboarding guide.",
    credit: "Public Trainly demo / Flock I+D",
  },
  batech: {
    src: "/media/batech-product.jpg",
    videoSrc: "/media/batech-product.mp4",
    width: 1280,
    height: 720,
    alt: "Public Batech product material showing an industrial computer vision use case.",
    credit: "Public Batech material / company product context",
  },
} as const;

export const portfolioStory = [
  {
    id: "minecraft",
    title: "Before I knew it was code.",
    body: "I changed Minecraft game files before I knew what programming was.",
    evidence: "user-attested",
  },
  {
    id: "digital-menus",
    title: "Digital menus. In-person offers.",
    body: "I went to restaurants on my own to offer digital menus.",
    evidence: "user-attested",
  },
  {
    id: "frontend-to-ai",
    title: "From frontend to Applied AI.",
    body: "Frontend at Hogarth. Frontend Lead at Batech. Product Engineer, AI R&D at Flock.",
    evidence: "portfolio-declared",
  },
] as const;

export const portfolioFacts = {
  experience: [
    {
      company: "Hogarth Worldwide",
      role: "Frontend Developer",
      scope: "Frontend engineering for Apple-related projects.",
    },
    {
      company: "Batech",
      role: "Frontend Engineer → Frontend Lead",
      scope: "SaaS frontend for AI and computer vision products.",
    },
    {
      company: "Flock I+D",
      role: "Product Engineer",
      scope: "AI R&D, product flow, frontend and AI integration.",
    },
  ],
  products: [
    { name: "Trainly", description: "AI-powered training & assessment." },
    { name: "Agora", description: "Recruitment and interviews with AI agents." },
  ],
  evidence:
    "Professional contributions are declared in the portfolio. Company material provides product context, not independent verification of individual authorship.",
} as const;

export const trainlyCase = {
  id: "trainly",
  href: "/en/trainly",
  name: "Trainly",
  category: "AI-powered training & assessment",
  title: "Learning is a product loop.",
  scope: ["Product flow", "Frontend", "AI integration"],
  status: "Live with clients · Growing",
  statusHeadline: "In use. Growing.",
  problem: {
    title: "Completion does not show understanding.",
    body: "Teams can deliver a document, a session or a course and still lack evidence that people can explain or apply the knowledge.",
  },
  bet: {
    title: "Assess through conversation.",
    body: "Connect existing company knowledge, structured learning and conversational assessment in one product loop.",
  },
  contribution:
    "My scope spans product flow, frontend and AI integration: connecting the learning experience with AI-powered workflows.",
  loop: [
    { name: "Source", description: "Company manuals and operational knowledge." },
    { name: "Structure", description: "Specialized agents organize a learning sequence." },
    { name: "Learn", description: "Chapters, visuals, quizzes and flashcards." },
    { name: "Validate", description: "Live questions explore the learner’s reasoning." },
    { name: "Improve", description: "Managers inspect progress and knowledge gaps." },
  ],
  system: [
    { name: "Next.js", purpose: "Application and interface" },
    { name: "Supabase", purpose: "People, learning and progress" },
    { name: "LangGraph", purpose: "Stateful agent workflows" },
    { name: "OpenAI + Gemini", purpose: "Text and visual generation" },
  ],
  evidence:
    "Clients use Trainly, and the product continues to grow. This case presents the implemented product flow, interface and technical architecture.",
  limits:
    "This case does not report quantified learning outcomes. Demo values are illustrative; they are not customer results. The system overview does not attribute model training to my work.",
  source: "https://tomas-garbarino.vercel.app/en/trainly",
} as const;

export const batechCase = {
  id: "batech",
  name: "Batech",
  category: "Frontend Engineer → Frontend Lead",
  title: "The interface around computer vision.",
  context:
    "A SaaS product using AI and computer vision to turn existing cameras into operational information, alerts and reports.",
  contributions: [
    {
      title: "Built the frontend foundation.",
      body: "Built the SaaS frontend from the ground up with React and TypeScript.",
    },
    {
      title: "Organized the frontend by domain.",
      body: "Introduced domain-oriented architecture to support product growth.",
    },
    {
      title: "Grew into frontend leadership.",
      body: "Grew from the only frontend engineer into frontend leadership while continuing to deliver product features.",
    },
  ],
  evidence:
    "The published portfolio describes my frontend contribution. Public company material shows the product context; it does not establish authorship of computer vision models or attribute company metrics to my work.",
  limits:
    "The public material does not yet document the specific constraints, alternatives, tradeoffs and validation behind the architecture decision.",
  source: "https://tomas-garbarino.vercel.app/en",
} as const;
