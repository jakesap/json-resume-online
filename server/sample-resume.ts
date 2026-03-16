import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const avatarDataUrl = `data:image/png;base64,${readFileSync(join(__dirname, 'avatar.png')).toString('base64')}`

export const SAMPLE_RESUME = {
  basics: {
    name: "John Doe",
    label: "Senior Software Engineer",
    image: avatarDataUrl,
    email: "john.doe@example.com",
    phone: "(912) 555-4321",
    url: "https://johndoe.com",
    summary:
      "A passionate senior software engineer with 10+ years of experience building scalable web applications, developer tools, and distributed systems. Proven track record of leading teams, architecting solutions, and delivering high-impact projects on time.",
    location: {
      address: "2712 Broadway St",
      postalCode: "94115",
      city: "San Francisco",
      countryCode: "US",
      region: "California",
    },
    profiles: [
      { network: "GitHub", username: "johndoe", url: "https://github.com/johndoe" },
      { network: "LinkedIn", username: "johndoe", url: "https://linkedin.com/in/johndoe" },
      { network: "Twitter", username: "johndoe", url: "https://twitter.com/johndoe" },
    ],
  },
  work: [
    {
      name: "Acme Corp",
      location: "San Francisco, CA",
      description: "A leading technology company specializing in cloud infrastructure and developer tooling.",
      position: "Senior Software Engineer",
      url: "https://acme.com",
      startDate: "2020-03-01",
      endDate: "",
      summary: "Lead engineer on the platform team, responsible for infrastructure and developer experience across 50+ engineers.",
      highlights: [
        "Reduced CI/CD build times by 60% through intelligent caching and parallelization",
        "Led migration from monolith to microservices, improving deployment frequency by 400%",
        "Designed and shipped a new API gateway handling 10M requests/day with 99.99% uptime",
        "Mentored a team of 6 junior and mid-level engineers",
        "Implemented observability platform using OpenTelemetry, reducing MTTR by 45%",
      ],
    },
    {
      name: "StartupXYZ",
      location: "New York, NY",
      description: "Early-stage SaaS analytics startup serving enterprise customers.",
      position: "Full Stack Developer",
      url: "https://startupxyz.com",
      startDate: "2017-06-01",
      endDate: "2020-02-28",
      summary: "Full stack development for a real-time SaaS analytics product serving 500+ enterprise customers.",
      highlights: [
        "Built real-time dashboard with React, WebSockets, and D3.js serving 500+ customers",
        "Migrated legacy monolith to microservices architecture using Node.js and Docker",
        "Introduced automated testing culture, achieving 85% code coverage",
        "Reduced cloud infrastructure costs by 30% through optimization and right-sizing",
      ],
    },
    {
      name: "TechConsulting LLC",
      location: "Remote",
      description: "Software consulting firm delivering custom solutions across industries.",
      position: "Software Developer",
      url: "https://techconsulting.com",
      startDate: "2015-01-01",
      endDate: "2017-05-31",
      summary: "Delivered custom software solutions for clients across finance, healthcare, and retail sectors.",
      highlights: ["Developed HIPAA-compliant patient management system used by 20+ clinics", "Built automated trading data pipeline processing $2B in daily transactions", "Delivered 12 client projects on time and within budget"],
    },
  ],
  volunteer: [
    {
      organization: "Code for America",
      position: "Technical Mentor",
      url: "https://codeforamerica.org",
      startDate: "2019-03-01",
      endDate: "",
      summary: "Mentor aspiring developers from underrepresented backgrounds in the tech industry.",
      highlights: ["Mentored 15+ bootcamp graduates through job placement", "Led bi-weekly code review sessions and mock technical interviews", "Co-organized annual civic tech hackathon with 200+ participants"],
    },
    {
      organization: "Local Animal Shelter",
      position: "Web Volunteer",
      url: "https://shelter.example.com",
      startDate: "2018-06-01",
      endDate: "2019-02-28",
      summary: "Built and maintained an adoption portal website pro bono.",
      highlights: ["Redesigned adoption portal, increasing online adoption inquiries by 150%", "Implemented automated email follow-up system for adopters"],
    },
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      url: "https://berkeley.edu",
      area: "Computer Science",
      studyType: "Bachelor of Science",
      startDate: "2011-09-01",
      endDate: "2015-05-15",
      score: "3.8",
      courses: [
        "CS61A - Structure and Interpretation of Computer Programs",
        "CS61B - Data Structures",
        "CS170 - Efficient Algorithms and Intractable Problems",
        "CS186 - Introduction to Database Systems",
        "CS188 - Introduction to Artificial Intelligence",
        "CS162 - Operating Systems and Systems Programming",
      ],
    },
  ],
  awards: [
    {
      title: "Engineer of the Year",
      date: "2022-12-01",
      awarder: "Acme Corp",
      summary: "Recognized for outstanding contributions to platform reliability and developer productivity, impacting the entire engineering organization.",
    },
    {
      title: "Best Open Source Project",
      date: "2021-10-15",
      awarder: "NodeConf",
      summary: "Awarded for OpenMetrics, an observability toolkit adopted by 300+ companies worldwide.",
    },
    {
      title: "Dean's List",
      date: "2014-05-01",
      awarder: "UC Berkeley",
      summary: "Academic excellence recognition for maintaining a GPA above 3.7.",
    },
  ],
  certificates: [
    {
      name: "AWS Certified Solutions Architect – Professional",
      date: "2022-08-15",
      issuer: "Amazon Web Services",
      url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      date: "2021-04-20",
      issuer: "Cloud Native Computing Foundation",
      url: "https://www.cncf.io/certification/cka/",
    },
    {
      name: "Google Professional Cloud Developer",
      date: "2020-11-10",
      issuer: "Google Cloud",
      url: "https://cloud.google.com/certification/cloud-developer",
    },
  ],
  publications: [
    {
      name: "Scaling Node.js Microservices: Lessons from Production",
      publisher: "Medium Engineering",
      releaseDate: "2023-03-15",
      url: "https://medium.com/engineering/scaling-nodejs-microservices",
      summary: "A deep dive into patterns and anti-patterns learned from running 40+ Node.js microservices at scale, covering load balancing, circuit breakers, and distributed tracing.",
    },
    {
      name: "OpenTelemetry in Practice: A Field Guide",
      publisher: "O'Reilly Radar",
      releaseDate: "2022-07-20",
      url: "https://radar.oreilly.com/opentelemetry-field-guide",
      summary: "Practical guide to implementing distributed tracing, metrics, and logging with OpenTelemetry across polyglot microservice architectures.",
    },
  ],
  skills: [
    {
      name: "Frontend",
      level: "Expert",
      keywords: ["React", "TypeScript", "Next.js", "CSS", "Tailwind", "Vite", "D3.js"],
    },
    {
      name: "Backend",
      level: "Expert",
      keywords: ["Node.js", "Go", "Python", "PostgreSQL", "Redis", "GraphQL", "REST APIs"],
    },
    {
      name: "Infrastructure & DevOps",
      level: "Advanced",
      keywords: ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions", "Prometheus", "Grafana"],
    },
    {
      name: "Data",
      level: "Intermediate",
      keywords: ["PostgreSQL", "MySQL", "MongoDB", "Elasticsearch", "Apache Kafka"],
    },
    {
      name: "Testing",
      level: "Advanced",
      keywords: ["Jest", "Playwright", "Vitest", "Cypress", "k6"],
    },
  ],
  languages: [
    { language: "English", fluency: "Native speaker" },
    { language: "Spanish", fluency: "Professional working proficiency" },
    { language: "Mandarin", fluency: "Elementary proficiency" },
  ],
  interests: [
    { name: "Open Source", keywords: ["Contributing", "Maintainer", "GitHub Sponsors"] },
    { name: "Rock Climbing", keywords: ["Bouldering", "Sport climbing", "Trad climbing"] },
    { name: "Photography", keywords: ["Landscape", "Street photography", "Fujifilm X-Series"] },
  ],
  references: [
    {
      name: "Jane Smith — Engineering Manager, Acme Corp",
      reference: "John is one of the most impactful engineers I've had the pleasure of working with. His technical depth, communication skills, and ability to mentor others make him an invaluable team member.",
    },
    {
      name: "Bob Chen — CTO, StartupXYZ",
      reference: "John architected our entire backend from scratch and delivered it ahead of schedule. His understanding of distributed systems and pragmatic approach to engineering is exceptionally rare.",
    },
  ],
  projects: [
    {
      name: "OpenMetrics",
      description: "Open-source observability toolkit for Node.js applications",
      highlights: ["2.4k GitHub stars, 300+ production users", "Featured in Node.js Weekly and JavaScript Digest", "Full OpenTelemetry compatibility with zero-config setup"],
      keywords: ["Node.js", "TypeScript", "Prometheus", "OpenTelemetry"],
      startDate: "2021-01-01",
      endDate: "",
      url: "https://github.com/johndoe/openmetrics",
      roles: ["Creator", "Lead Maintainer"],
      entity: "Open Source",
      type: "application",
    },
    {
      name: "PGMigrate",
      description: "Zero-downtime PostgreSQL migration tool with automatic rollback support",
      highlights: ["Used by 50+ engineering teams in production", "Zero-downtime deployments with automatic rollback on failure", "Supports complex column type changes without table locking"],
      keywords: ["Go", "PostgreSQL", "Database", "DevOps"],
      startDate: "2020-06-01",
      endDate: "2021-12-31",
      url: "https://github.com/johndoe/pgmigrate",
      roles: ["Creator", "Maintainer"],
      entity: "Open Source",
      type: "application",
    },
  ],
  meta: {
    canonical: "https://raw.githubusercontent.com/jsonresume/resume-schema/master/sample.resume.json",
    version: "v1.0.0",
    lastModified: "2024-01-01T00:00:00",
  },
};
