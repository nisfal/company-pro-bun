import type { Translation } from "./types";

/**
 * English — Springfield / Simpsons dialect.
 *
 * Tone guide (all original, no copyrighted lines):
 * - Exclamations: "D'oh!", "Woo-hoo!", "Excellent...", "Mmm...", "Sweet Jebus!"
 * - Casual Springfield slang: "cromulent", "embiggen", "yoink", "meh"
 * - Homer-ish enthusiasm mixed with accidental wisdom
 * - Bart-style irreverence for CTAs
 * - Lisa-level vocabulary for technical descriptions
 * - Mr. Burns cold precision for stats / results
 * - Ned Flanders warmth for team / values
 * - All original phrases — inspired by the show's cadence, not reproduced from it
 */
export const en: Translation = {
  locale: "en",

  nav: {
    home:       "Home",
    services:   "Services",
    portfolio:  "Portfolio",
    about:      "About",
    contact:    "Contact",
    cta:        "Don't Have a Cow — Contact Us",
    switchLang: "ID",
  },

  footer: {
    pagesHeading:   "Pages",
    contactHeading: "Contact",
    builtWith:      "Mmm... Built with ☀️ Bun + Hono",
    rights:         "All rights reserved. Excellent.",
  },

  ui: {
    learnMore:       "Learn More →",
    viewAll:         "View All →",
    sendMessage:     "Send It! ✦",
    sending:         "Sending... D'oh, hold on...",
    backHome:        "Back to Springfield",
    year:            "Year",
    featuredProject: "★ Featured Project",
    otherProjects:   "More Projects",
    readMore:        "Read More",
  },

  home: {
    heroBadge:        "☀️ Since {founded} — Built for the Real World",
    heroHeadline1:    "Digital Solutions",
    heroHeadline2:    "That Actually Work",
    heroDescription:  "{description}",
    heroCtaPrimary:   "See Our Services ✦",
    heroCtaSecondary: "View Portfolio →",
    servicesHeading:    "What We Do (And We're Cromulent at It)",
    servicesSubheading: "From product engineering to cloud infrastructure — one partner, every digital need. Woo-hoo!",
    servicesCtaLabel:   "All Services →",
    whyHeading:    "Why Simptecho? (Excellent Question...)",
    whySubheading: "We're not just a body shop. We're the engineering team that actually gives a D'oh about your business outcome.",
    whyCtaLabel:   "About Us →",
    whyPoints: [
      { icon: "⚡", title: "Fast Delivery",          body: "Two-week sprints. Demo every cycle. No big-bang surprises — just steady, cromulent progress." },
      { icon: "🔒", title: "Security First",          body: "Secure SDLC from day one. Code review, SAST, dependency audits — not a last-minute afterthought. Sweet Jebus!" },
      { icon: "📈", title: "Scales Like Crazy",       body: "Architecture built to grow. From 100 to 10 million users without a painful re-architecture. Woo-hoo!" },
      { icon: "🤝", title: "Partner, Not Just Vendor",body: "We sit on your side of the table — thinking about your business, not just closing tickets. Mmm... partnership." },
    ],
    testimonialsHeading:    "Don't Take Our Word for It",
    testimonialsSubheading: "Results speak louder than promises. Here's what our clients say — and they're not just being neighborly.",
    ctaHeading:    "Ready to Start? Don't Have a Cow!",
    ctaSubheading: "Tell us your challenge — we'll sit down, grab a donut, and figure it out together.",
    ctaPrimary:    "Contact Us ✦",
    ctaSecondary:  "View Portfolio",
    stats: [
      { label: "Projects Shipped"    },
      { label: "Happy Clients"       },
      { label: "Professionals"       },
      { label: "Years of Experience" },
    ],
  },

  services: {
    badge:           "🛠 Our Services",
    heroHeadline1:   "Full-Stack Solutions",
    heroHeadline2:   "For Your Team",
    heroDescription: "From product ideation to enterprise-grade infrastructure — one partner for every digital need. Woo-hoo!",
    processHeading:    "How We Work (It's Surprisingly Cromulent)",
    processSubheading: "Structured process, transparent communication. No Homers allowed on ambiguity.",
    steps: [
      { num: "01", title: "Discovery",      body: "Intensive workshops to understand your business, pain points, and target outcomes. We align before a single line of code is written. Mmm... clarity." },
      { num: "02", title: "Architecture",   body: "Technical design, ADRs, and the right stack for the job. Architecture docs become living documents throughout the project." },
      { num: "03", title: "Build",          body: "Two-week sprints. Demo every cycle. CI from day one — no big-bang release. Excellent." },
      { num: "04", title: "Deploy & Scale", body: "Zero-downtime deployment, end-to-end monitoring, and post-launch support to keep production stable. Woo-hoo!" },
    ],
    techHeading:    "Tech Stack (Mmm... Technology...)",
    techSubheading: "We pick the right tool for the right problem — not whatever's trending on the internet this week.",
    ctaHeading:    "Need a Technical Consultation?",
    ctaSubheading: "Free 60 minutes — we review your architecture or stack and give you brutally honest feedback. D'oh, it's free!",
    ctaPrimary:    "Schedule Consultation",
    ctaSecondary:  "View Portfolio",
  },

  portfolio: {
    badge:           "🏆 Portfolio",
    heroHeadline1:   "Projects We're",
    heroHeadline2:   "Genuinely Proud Of",
    heroDescription: "Every project is a story of real challenges and solutions that actually work. No participation trophies here.",
    ctaHeading:    "Your Project Next? Don't Be a Square!",
    ctaSubheading: "Let's make your project the next success story we brag about at the water cooler.",
    ctaPrimary:    "Let's Talk",
    ctaSecondary:  "View Services",
    stats: [
      { label: "Projects Delivered" },
      { label: "Happy Clients"      },
      { label: "Uptime SLA"         },
      { label: "Client Rating"      },
    ],
  },

  about: {
    badge:           "🏢 About Us",
    heroHeadline1:   "We Believe",
    heroHeadline2:   "Tech Embiggens Business",
    heroDescription: "Since {founded}, we've helped hundreds of companies grow faster through technology that actually does something. Woo-hoo!",
    storyHeading:    "The Origin Story of Simptecho",
    storyParagraphs: [
      "Founded in {founded} by two engineers who were, frankly, fed up watching tech projects fail — not because of technical problems, but because of terrible communication between business and engineering teams. D'oh!",
      "We built Simptecho on one cromulent principle: be a partner, not a vendor. That means we think about your business, not just execute requirements that land in our inbox.",
      "Today we're a team of {employees} professionals who've completed {projects} projects for {clients} clients across practically every industry you can think of. Excellent.",
    ],
    timeline: [
      { year: "2015", event: "Simptecho founded. First team of 5, first 3 startup clients. Woo-hoo!" },
      { year: "2017", event: "Expanded to enterprise. First project with a national bank. Excellent." },
      { year: "2019", event: "Launched Cloud & DevOps division. Team grew to 50. Mmm... growth." },
      { year: "2021", event: "Launched AI Lab. Started building data-driven products for clients." },
      { year: "2023", event: "150+ team, 500+ projects, present in 5 cities. Don't have a cow!" },
    ],
    teamHeading:    "The People Behind the Magic",
    teamSubheading: "A small, dense team — low ego, high output. Ned Flanders would approve.",
    valuesHeading: "Our Values (Perfectly Cromulent Ones)",
    values: [
      { icon: "🎯", title: "Outcomes over Output",  body: "We don't count story points. We count real business impact. Mmm... impact." },
      { icon: "🔍", title: "Radical Transparency",  body: "Bad news delivered fast. No happy-path-only reporting. Ever." },
      { icon: "🌱", title: "Kaizen",                body: "Every sprint better than the last. Continuous improvement is not just a poster on the wall." },
      { icon: "🤝", title: "Respect & Inclusion",   body: "Diverse teams produce richer solutions. That's just science, man." },
    ],
    ctaHeading:    "Join the Team? Ay Caramba!",
    ctaSubheading: "We're always looking for engineers, designers, and PMs who are passionate. No open roles? Send your CV anyway — we don't bite.",
    ctaPrimary:    "View Careers",
    ctaSecondary:  "Contact Us",
    stats: [
      { label: "Founded"       },
      { label: "Professionals" },
      { label: "Projects"      },
      { label: "Clients"       },
    ],
  },

  contact: {
    badge:           "📬 Contact",
    heroHeadline1:   "Let's Talk",
    heroHeadline2:   "About Your Project",
    heroDescription: "Response within 1 business day. No question is too small or too big. Mmm... questions.",
    formHeading:    "Send a Message",
    formSubheading: "All fields required. We reply within 24 business hours. Don't have a cow.",
    fields: {
      name:             "Full Name",
      namePlaceholder:  "Homer Simpson",
      email:            "Email",
      emailPlaceholder: "homer@springfield.com",
      company:          "Company Name",
      companyPlaceholder: "Springfield Nuclear",
      service:          "What Do You Need?",
      servicePlaceholder: "Pick a service...",
      serviceOptions: [
        "Product Engineering",
        "Cloud & DevOps",
        "Mobile Development",
        "AI & Data Engineering",
        "Security & Compliance",
        "Analytics & BI",
        "Something Else",
      ],
      message:            "Tell Us About It",
      messagePlaceholder: "We're building platform X and need help with Y... don't be shy, Mmm...",
    },
    submitLabel:    "Send It! ✦",
    successMessage: "✅ Message sent! We'll get back to you within 1 business day. Woo-hoo!",
    errorMessage:   "❌ D'oh! Something went wrong. Try again or email us directly.",
    infoAddress:   "Address",
    infoEmail:     "Email",
    infoPhone:     "Phone",
    socialHeading: "Find Us Out There",
  },

  notFound: {
    code:    "404",
    message: "D'oh! This page doesn't exist in Springfield.",
    cta:     "Back to Springfield",
  },

  seo: {
    homeTitle:            "Home",
    homeDescription:      "{description}",
    servicesTitle:        "Services",
    servicesDescription:  "Product engineering, cloud/DevOps, mobile, AI, security, and analytics — complete solutions for startups to enterprise.",
    portfolioTitle:       "Portfolio",
    portfolioDescription: "Simptecho portfolio — fintech, e-commerce, edtech, logistics, and more. Excellent.",
    aboutTitle:           "About Us",
    aboutDescription:     "{name} — {tagline}. Founded {founded}, {employees} professionals, {projects} projects completed.",
    contactTitle:         "Contact",
    contactDescription:   "Contact {name} — we're ready to discuss your digital project. Don't have a cow!",
    faqTitle:             "FAQ",
    faqDescription:       "Everything you wanted to ask Simptecho — answered honestly from behind the bar.",
  },

  faq: {
    badge:           "🍺 Ask Moe",
    heroHeadline1:   "Got Questions?",
    heroHeadline2:   "Moe's Got Answers",
    heroDescription: "Everything you wanted to know about Simptecho — answered honestly from behind the bar. Mmm... answers.",
    items: [
      { q: "How long does a typical project take?", a: "Depends on the scope. A simple MVP? Six to eight weeks. An enterprise platform? Six to twelve months. We won't give you an estimate until we actually understand what you need. Excellent." },
      { q: "Do you handle maintenance after launch?", a: "Yep. We have monthly retainer packages for maintenance, monitoring, and ongoing development. Many of our clients have been with us for 3+ years. Woo-hoo!" },
      { q: "What's your go-to tech stack?", a: "Backend: Go and Node.js. Frontend: React/Next.js. Mobile: React Native. Cloud: AWS and GCP. But we pick the stack based on the project's needs, not just habit. Mmm... pragmatism." },
      { q: "Can you help with a project that's already running but needs refactoring?", a: "Absolutely — we do it all the time. We usually start with a technical audit to understand the codebase, then give you a realistic refactor roadmap. D'oh, why didn't they call us earlier?" },
      { q: "What engagement models do you offer?", a: "Two options: project-based (fixed scope, fixed timeline) or dedicated team (our team embeds into yours). We recommend dedicated team for fast-evolving products. Don't have a cow — both work great." },
      { q: "Is there a minimum project budget?", a: "For project-based work, our minimum engagement is around IDR 150 million. For consultation or technical audits, there's a separate, more accessible package." },
      { q: "Have you handled fintech or healthcare projects with strict compliance requirements?", a: "Yes. We have experience with PCI-DSS, Indonesian fintech regulations, and healthcare data security standards. Security and compliance are not afterthoughts here. Sweet Jebus!" },
      { q: "How do sprints and reporting work?", a: "Two-week sprints. End of every sprint: live demo to stakeholders. Weekly async updates via Slack/Notion. No death-by-PowerPoint around here. Excellent." },
    ],
  },

  data: {
    services: [
      { title: "Product Engineering",   description: "We design and build digital products from scratch — solid architecture, intuitive UX, and on-time delivery. Woo-hoo!",                                          detail: "Full-cycle product development" },
      { title: "Cloud & DevOps",        description: "Infrastructure as code, CI/CD pipelines, Kubernetes orchestration, and end-to-end observability. Excellent.",                                                  detail: "AWS · GCP · Azure · K8s" },
      { title: "Mobile Development",    description: "Native iOS & Android apps, plus cross-platform React Native for maximum reach. Mmm... mobile.",                                                                 detail: "iOS · Android · React Native" },
      { title: "AI & Data Engineering", description: "Real-time data pipelines, production-ready ML models, and LLM integrations for genuinely smart products.",                                                      detail: "ML · LLM · Streaming Data" },
      { title: "Security & Compliance", description: "Penetration testing, secure SDLC, and compliance audits for products that are safe from the ground up. Sweet Jebus!",                                          detail: "PenTest · OWASP · ISO 27001" },
      { title: "Analytics & BI",        description: "Real-time dashboards, modern data warehouses, and actionable insights from your business data. Mmm... data.",                                                  detail: "dbt · Redshift · Metabase" },
    ],
    team: [
      { bio: "10+ years in product engineering. Ex-Gojek, ex-Tokopedia. Obsessed with scalable systems.",                         funFact: "Can debug a production issue while eating a donut. Mmm... donut." },
      { bio: "Distributed systems expert. Speaker at tech conferences across Southeast Asia.",                                     funFact: "Owns more than 20 mechanical keyboards. Woo-hoo!" },
      { bio: "Platform engineer specializing in Kubernetes and observability. Open source contributor.",                           funFact: "Once deployed to production from the top of a mountain. Excellent." },
      { bio: "Design systems practitioner. Believes good UX is invisible UX.",                                                    funFact: "Designs exclusively to jazz. Always jazz." },
    ],
    testimonials: [
      { text: "Simptecho transformed the way our team works. 3x faster delivery, bug rate dropped dramatically. They're not a vendor — they're a partner. Woo-hoo!" },
      { text: "Microservices migration completed in 6 months with zero downtime. I've never seen execution of this caliber before. Excellent." },
      { text: "Our platform handled 500k concurrent users at launch — something we thought was impossible in that timeline. Sweet Jebus!" },
    ],
    portfolios: [
      { description: "Digital payment platform with 2M+ active users. Real-time transaction processing, ML fraud detection, and open banking integration.",  result: "2M+ active users" },
      { description: "Microservices re-architecture for a retail platform with 50+ brands. Zero-downtime migration from legacy monolith.",                    result: "Zero-downtime migration" },
      { description: "Learning management system for 500k+ learners. Live streaming, adaptive quiz engine, and blockchain certification.",                    result: "500k+ active learners" },
      { description: "Fleet management and real-time cargo tracking for 1000+ vehicles. IoT integration with AI route prediction.",                           result: "1000+ fleet monitored" },
    ],
  },
};
