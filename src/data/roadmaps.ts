// Simple roadmap data for 23 career paths
// PDFs stored in public/Resources/Roadmap Pdf/

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  topics: Topic[];
  estimatedWeeks: number;
}

export interface RoadmapData {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
}

export const ROADMAPS: Record<string, RoadmapData> = {
  frontend: {
    id: 'frontend',
    name: 'Frontend Developer',
    description: 'Build beautiful, responsive web interfaces',
    phases: [
      {
        id: 1,
        title: 'HTML & CSS Basics',
        description: 'Learn the foundation of web pages',
        estimatedWeeks: 2,
        topics: [
          { id: 'html-basics', title: 'HTML Basics', description: 'Tags, attributes, semantic HTML' },
          { id: 'css-basics', title: 'CSS Basics', description: 'Selectors, colors, fonts' },
          { id: 'box-model', title: 'Box Model', description: 'Margin, border, padding, content' },
          { id: 'flexbox', title: 'Flexbox', description: 'Flexible box layout' },
        ],
      },
      {
        id: 2,
        title: 'JavaScript Fundamentals',
        description: 'Add interactivity to your pages',
        estimatedWeeks: 4,
        topics: [
          { id: 'js-basics', title: 'JavaScript Basics', description: 'Variables, functions, loops' },
          { id: 'dom-manipulation', title: 'DOM Manipulation', description: 'Select and modify elements' },
          { id: 'events', title: 'Events', description: 'Click, submit, keyboard events' },
          { id: 'async-js', title: 'Async JavaScript', description: 'Promises, async/await' },
        ],
      },
      {
        id: 3,
        title: 'React & Modern Tools',
        description: 'Build scalable applications',
        estimatedWeeks: 6,
        topics: [
          { id: 'react-basics', title: 'React Basics', description: 'Components, JSX, props' },
          { id: 'hooks', title: 'Hooks', description: 'useState, useEffect, custom hooks' },
          { id: 'routing', title: 'React Router', description: 'Client-side navigation' },
          { id: 'state-management', title: 'State Management', description: 'Context API or Zustand' },
        ],
      },
    ],
  },
  backend: {
    id: 'backend',
    name: 'Backend Developer',
    description: 'Build server-side logic and APIs',
    phases: [
      {
        id: 1,
        title: 'Programming Fundamentals',
        description: 'Master a backend language',
        estimatedWeeks: 4,
        topics: [
          { id: 'language-basics', title: 'Language Basics', description: 'Python, Node.js, or Go' },
          { id: 'data-structures', title: 'Data Structures', description: 'Arrays, maps, sets' },
          { id: 'algorithms', title: 'Basic Algorithms', description: 'Sorting, searching' },
        ],
      },
      {
        id: 2,
        title: 'Databases',
        description: 'Store and query data',
        estimatedWeeks: 4,
        topics: [
          { id: 'sql-basics', title: 'SQL Basics', description: 'Queries, joins, indexes' },
          { id: 'nosql', title: 'NoSQL', description: 'MongoDB, document stores' },
          { id: 'orm', title: 'ORM', description: 'Prisma, Sequelize, or SQLAlchemy' },
        ],
      },
      {
        id: 3,
        title: 'APIs & Architecture',
        description: 'Build scalable services',
        estimatedWeeks: 6,
        topics: [
          { id: 'rest-api', title: 'REST API', description: 'HTTP methods, status codes' },
          { id: 'authentication', title: 'Authentication', description: 'JWT, sessions, OAuth' },
          { id: 'microservices', title: 'Microservices', description: 'Service architecture' },
        ],
      },
    ],
  },
  'full-stack': {
    id: 'full-stack',
    name: 'Full Stack Developer',
    description: 'Master both frontend and backend',
    phases: [
      {
        id: 1,
        title: 'Web Fundamentals',
        description: 'HTML, CSS, JavaScript',
        estimatedWeeks: 4,
        topics: [
          { id: 'html-css', title: 'HTML & CSS', description: 'Semantic markup, styling' },
          { id: 'javascript', title: 'JavaScript', description: 'ES6+ features' },
          { id: 'git', title: 'Git', description: 'Version control basics' },
        ],
      },
      {
        id: 2,
        title: 'Frontend Framework',
        description: 'React or Vue',
        estimatedWeeks: 6,
        topics: [
          { id: 'react', title: 'React', description: 'Components, hooks, routing' },
          { id: 'tailwind', title: 'Tailwind CSS', description: 'Utility-first styling' },
          { id: 'forms', title: 'Forms', description: 'Validation, handling submissions' },
        ],
      },
      {
        id: 3,
        title: 'Backend & Database',
        description: 'Server and data layer',
        estimatedWeeks: 6,
        topics: [
          { id: 'nodejs', title: 'Node.js', description: 'Express, middleware' },
          { id: 'database', title: 'Database', description: 'PostgreSQL or MongoDB' },
          { id: 'deployment', title: 'Deployment', description: 'Vercel, Railway, Docker' },
        ],
      },
    ],
  },
  'data-science': {
    id: 'data-science',
    name: 'Data Scientist',
    description: 'Extract insights from data',
    phases: [
      {
        id: 1,
        title: 'Mathematics Foundation',
        description: 'Statistics and linear algebra',
        estimatedWeeks: 6,
        topics: [
          { id: 'statistics', title: 'Statistics', description: 'Probability, distributions' },
          { id: 'linear-algebra', title: 'Linear Algebra', description: 'Vectors, matrices' },
          { id: 'calculus', title: 'Calculus', description: 'Derivatives, gradients' },
        ],
      },
      {
        id: 2,
        title: 'Python for Data Science',
        description: 'Data manipulation libraries',
        estimatedWeeks: 4,
        topics: [
          { id: 'numpy', title: 'NumPy', description: 'Numerical computing' },
          { id: 'pandas', title: 'Pandas', description: 'Data manipulation' },
          { id: 'visualization', title: 'Visualization', description: 'Matplotlib, Seaborn' },
        ],
      },
      {
        id: 3,
        title: 'Machine Learning',
        description: 'Build predictive models',
        estimatedWeeks: 8,
        topics: [
          { id: 'ml-basics', title: 'ML Basics', description: 'Supervised vs unsupervised' },
          { id: 'scikit-learn', title: 'Scikit-Learn', description: 'Model training' },
          { id: 'deep-learning', title: 'Deep Learning', description: 'Neural networks intro' },
        ],
      },
    ],
  },
  devops: {
    id: 'devops',
    name: 'DevOps Engineer',
    description: 'Automate deployment and infrastructure',
    phases: [
      {
        id: 1,
        title: 'Linux & Scripting',
        description: 'Command line and automation',
        estimatedWeeks: 4,
        topics: [
          { id: 'linux-basics', title: 'Linux Basics', description: 'Commands, file system' },
          { id: 'bash', title: 'Bash Scripting', description: 'Automate tasks' },
          { id: 'networking', title: 'Networking', description: 'TCP/IP, DNS, HTTP' },
        ],
      },
      {
        id: 2,
        title: 'CI/CD & Containers',
        description: 'Automated pipelines',
        estimatedWeeks: 6,
        topics: [
          { id: 'git-advanced', title: 'Git Advanced', description: 'Branching, rebasing' },
          { id: 'docker', title: 'Docker', description: 'Containerization' },
          { id: 'github-actions', title: 'GitHub Actions', description: 'CI/CD pipelines' },
        ],
      },
      {
        id: 3,
        title: 'Cloud & Orchestration',
        description: 'Scale and manage infrastructure',
        estimatedWeeks: 8,
        topics: [
          { id: 'aws-basics', title: 'AWS Basics', description: 'EC2, S3, Lambda' },
          { id: 'kubernetes', title: 'Kubernetes', description: 'Container orchestration' },
          { id: 'terraform', title: 'Terraform', description: 'Infrastructure as code' },
        ],
      },
    ],
  },
  // Additional roadmaps with minimal structure - PDF is the main content
  'ai-data-scientist': {
    id: 'ai-data-scientist',
    name: 'AI Data Scientist',
    description: 'Build AI models and analyze complex data',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 24, topics: [] }],
  },
  'ai-engineer': {
    id: 'ai-engineer',
    name: 'AI Engineer',
    description: 'Design and build AI systems and applications',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 20, topics: [] }],
  },
  android: {
    id: 'android',
    name: 'Android Developer',
    description: 'Build mobile apps for Android devices',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 16, topics: [] }],
  },
  'bi-analyst': {
    id: 'bi-analyst',
    name: 'Business Intelligence Analyst',
    description: 'Turn data into actionable business insights',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 14, topics: [] }],
  },
  blockchain: {
    id: 'blockchain',
    name: 'Blockchain Developer',
    description: 'Build decentralized applications and smart contracts',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 18, topics: [] }],
  },
  'cyber-security': {
    id: 'cyber-security',
    name: 'Cyber Security Engineer',
    description: 'Protect systems and networks from digital attacks',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 20, topics: [] }],
  },
  'data-analyst': {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyze data to help businesses make decisions',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 12, topics: [] }],
  },
  'data-engineer': {
    id: 'data-engineer',
    name: 'Data Engineer',
    description: 'Build and maintain data pipelines and infrastructure',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 18, topics: [] }],
  },
  devrel: {
    id: 'devrel',
    name: 'Developer Relations',
    description: 'Build communities and advocate for developers',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 12, topics: [] }],
  },
  'engineering-manager': {
    id: 'engineering-manager',
    name: 'Engineering Manager',
    description: 'Lead engineering teams and drive technical decisions',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 16, topics: [] }],
  },
  'game-developer': {
    id: 'game-developer',
    name: 'Game Developer',
    description: 'Create video games and interactive experiences',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 20, topics: [] }],
  },
  ios: {
    id: 'ios',
    name: 'iOS Developer',
    description: 'Build mobile apps for iPhone and iPad',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 16, topics: [] }],
  },
  'machine-learning': {
    id: 'machine-learning',
    name: 'Machine Learning Engineer',
    description: 'Design and deploy ML models at scale',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 22, topics: [] }],
  },
  mlops: {
    id: 'mlops',
    name: 'MLOps Engineer',
    description: 'Deploy and maintain ML models in production',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 16, topics: [] }],
  },
  'product-manager': {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Define product strategy and lead cross-functional teams',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 14, topics: [] }],
  },
  'server-side-game-developer': {
    id: 'server-side-game-developer',
    name: 'Server-Side Game Developer',
    description: 'Build backend systems for multiplayer games',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 18, topics: [] }],
  },
  'software-architect': {
    id: 'software-architect',
    name: 'Software Architect',
    description: 'Design high-level software systems and architecture',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 20, topics: [] }],
  },
  'technical-writer': {
    id: 'technical-writer',
    name: 'Technical Writer',
    description: 'Create documentation and technical content',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 10, topics: [] }],
  },
  'ux-design': {
    id: 'ux-design',
    name: 'UX Designer',
    description: 'Design user-centered digital experiences',
    phases: [{ id: 1, title: 'See PDF for detailed roadmap', description: 'Download the full PDF for complete learning path', estimatedWeeks: 14, topics: [] }],
  },
};

export const ROADMAP_KEYS = Object.keys(ROADMAPS);
