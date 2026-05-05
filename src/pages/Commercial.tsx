import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Shield,
  Clock,
  Users,
  Factory,
  Building2,
  Zap,
  Truck,
  GraduationCap,
  Trophy,
  Warehouse,
  ClipboardCheck,
  Ruler,
  Hammer,
  CheckCircle
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Hero image
import heroCommercial from "@/assets/commercial/hero-commercial.jpg";

// Fence type images
import highSecurityChainlink from "@/assets/commercial/high-security-chainlink.jpg";
import antiRamFencing from "@/assets/commercial/anti-ram-fencing.jpg";
import industrialPrivacy from "@/assets/commercial/industrial-privacy.jpg";
import sportsFieldFencing from "@/assets/commercial/sports-field-fencing.jpg";
import constructionFencing from "@/assets/commercial/construction-fencing.jpg";
import gatesAccessControl from "@/assets/commercial/gates-access-control.jpg";

// Project images
import projectBristol from "@/assets/commercial/project-bristol-speedway.jpg";
import projectCharlotte from "@/assets/commercial/project-charlotte-speedway.jpg";
import projectEastman from "@/assets/commercial/project-eastman-chemical.jpg";
import projectNuclear from "@/assets/commercial/project-nuclear-facility.jpg";

const fenceTypes = [
  {
    id: "high-security",
    title: "High Security Chain Link Fencing",
    description: "Heavy gauge chain link systems designed for durability and perimeter security. Ideal for industrial sites, utilities, and restricted areas.",
    bullets: ["Multiple gauge options", "Optional coatings", "Security focused layouts"],
    image: highSecurityChainlink,
    alt: "Industrial high security chain link fence installation at manufacturing facility",
  },
  {
    id: "anti-ram",
    title: "Anti Ram and Crash Rated Fencing",
    description: "Engineered systems designed to protect sensitive locations and high risk facilities.",
    bullets: ["Reinforced designs", "High impact protection", "Built to specification"],
    image: antiRamFencing,
    alt: "Anti-ram crash rated security barriers protecting government facility",
  },
  {
    id: "industrial-privacy",
    title: "Industrial Privacy Fencing",
    description: "Screens and enclosures for equipment yards, storage areas, and sensitive operations.",
    bullets: ["Visual screening", "Durable materials", "Custom heights available"],
    image: industrialPrivacy,
    alt: "Industrial privacy screen fence enclosing commercial equipment yard",
  },
  {
    id: "sports-field",
    title: "Sports Field and Stadium Fencing",
    description: "Safe, durable fencing solutions for athletic facilities and large public venues.",
    bullets: ["Crowd control", "Athlete safety", "Proven at large scale venues"],
    image: sportsFieldFencing,
    alt: "Sports stadium perimeter fencing for athletic facility",
  },
  {
    id: "construction",
    title: "Temporary Construction Fencing",
    description: "Fast deployment fencing for job sites, events, and short term needs.",
    bullets: ["Flexible setups", "Reliable materials", "Efficient install and removal"],
    image: constructionFencing,
    alt: "Orange temporary construction site fencing at active job site",
  },
  {
    id: "gates",
    title: "Gates and Access Control",
    description: "Integrated gate systems and access control for secure entry and controlled movement.",
    bullets: ["Slide and swing gates", "Keypad and card access", "Automation options"],
    image: gatesAccessControl,
    alt: "Automated commercial gate with access control system",
  },
];

const industries = [
  { icon: Factory, title: "Manufacturing and industrial facilities" },
  { icon: Building2, title: "Municipal and government properties" },
  { icon: Zap, title: "Utilities and energy" },
  { icon: Truck, title: "Transportation and logistics" },
  { icon: GraduationCap, title: "Schools and universities" },
  { icon: Trophy, title: "Sports and entertainment venues" },
  { icon: Warehouse, title: "Distribution centers and warehouses" },
];

const projects = [
  {
    title: "Bristol Motor Speedway",
    location: "Bristol, TN",
    scope: "Security and perimeter fencing",
    industry: "Sports Venue",
    image: projectBristol,
    alt: "Bristol Motor Speedway commercial security fence installation",
  },
  {
    title: "Charlotte Motor Speedway",
    location: "Charlotte, NC",
    scope: "Large scale fencing systems",
    industry: "Sports Venue",
    image: projectCharlotte,
    alt: "Charlotte Motor Speedway commercial perimeter fencing",
  },
  {
    title: "Eastman Chemical",
    location: "Kingsport, TN",
    scope: "Industrial perimeter fencing",
    industry: "Manufacturing",
    image: projectEastman,
    alt: "Eastman Chemical industrial fence installation",
  },
  {
    title: "Nuclear Fuel Services",
    location: "Erwin, TN",
    scope: "High security fencing",
    industry: "Government",
    image: projectNuclear,
    alt: "High security double perimeter fence at nuclear facility",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Site Review and Scope",
    description: "We review the site, security needs, access points, and operational requirements.",
    icon: ClipboardCheck,
  },
  {
    step: 2,
    title: "Design and Compliance",
    description: "We design a fencing solution that meets safety standards, codes, and project goals.",
    icon: Ruler,
  },
  {
    step: 3,
    title: "Installation and Coordination",
    description: "Our crews work efficiently and coordinate with other trades and site leadership.",
    icon: Hammer,
  },
  {
    step: 4,
    title: "Final Inspection and Handoff",
    description: "We verify performance, access control, and overall quality before completion.",
    icon: CheckCircle,
  },
];

const faqs = [
  {
    question: "Do you handle large scale and multi site projects?",
    answer: "Yes. We regularly manage complex commercial projects and phased installs.",
  },
  {
    question: "Can you meet strict safety and compliance requirements?",
    answer: "Yes. Safety and compliance are built into our process from planning through installation.",
  },
  {
    question: "Do you coordinate with general contractors?",
    answer: "Yes. We work directly with GCs, facilities teams, and project managers.",
  },
  {
    question: "Can you install fencing while a facility remains operational?",
    answer: "In many cases, yes. We plan installs to minimize disruption.",
  },
  {
    question: "Do you install access control and automated gates?",
    answer: "Yes. We offer integrated gate and access control systems.",
  },
  {
    question: "What regions do you serve for commercial work?",
    answer: "We serve the Tri Cities and surrounding areas, with capability to support regional projects.",
  },
];

// Schema markup
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ConstructionBusiness",
  "@id": "https://mccall.lovable.app/#organization",
  "name": "McCall Commercial Fencing",
  "description": "Industrial, municipal, and commercial fencing solutions built for security, scale, and durability. Trusted since 1997. Projects include Bristol Motor Speedway, Eastman Chemical, and more.",
  "url": "https://mccall.lovable.app/commercial",
  "telephone": "+1-423-477-4882",
  "email": "info@mccallfencing.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6248 Kingsport Hwy",
    "addressLocality": "Gray",
    "addressRegion": "TN",
    "postalCode": "37615",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "City", "name": "Johnson City", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Kingsport", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Bristol", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Bristol", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "State", "name": "Northeast Tennessee" }
  ],
  "priceRange": "$$$"
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mccall.lovable.app" },
    { "@type": "ListItem", "position": 2, "name": "Commercial Fencing", "item": "https://mccall.lovable.app/commercial" }
  ]
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Commercial and Industrial Fence Installation",
  "provider": { "@id": "https://mccall.lovable.app/#organization" },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 36.4167, "longitude": -82.4833 },
    "geoRadius": "100 mi"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Commercial Fencing Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "High Security Chain Link Fencing", "description": "Heavy gauge systems for industrial and utility sites" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Anti-Ram and Crash Rated Fencing", "description": "Engineered protection for high-risk facilities" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Industrial Privacy Screening", "description": "Visual screening for equipment yards and operations" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sports Field and Stadium Fencing", "description": "Safe, durable fencing for athletic facilities" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Gate and Access Control", "description": "Integrated gate systems with automation" } }
    ]
  }
};

const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Featured Commercial Fencing Projects",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "item": { "@type": "Project", "name": "Bristol Motor Speedway", "description": "Stadium perimeter fencing and crowd control barriers" } },
    { "@type": "ListItem", "position": 2, "item": { "@type": "Project", "name": "Charlotte Motor Speedway", "description": "Large-scale venue fencing installation" } },
    { "@type": "ListItem", "position": 3, "item": { "@type": "Project", "name": "Eastman Chemical", "description": "Industrial security perimeter fencing" } },
    { "@type": "ListItem", "position": 4, "item": { "@type": "Project", "name": "Nuclear Fuel Services", "description": "High-security fencing for sensitive facility" } }
  ]
};

export default function CommercialPage() {
  return (
    <>
      <Helmet>
        <title>Commercial & Industrial Fencing Contractor | Johnson City, Kingsport, Bristol | McCall</title>
        <meta name="description" content="Industrial, municipal, and commercial fencing solutions built for security, scale, and durability. Bristol Motor Speedway, Eastman Chemical & more. Free estimates." />
        <link rel="canonical" href="https://mccall.lovable.app/commercial" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Commercial & Industrial Fencing Contractor | McCall Fencing" />
        <meta property="og:description" content="High-security, industrial, and commercial fencing. Trusted by Bristol Motor Speedway, Eastman Chemical & more since 1997." />
        <meta property="og:url" content="https://mccall.lovable.app/commercial" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mccall.lovable.app/og-commercial.jpg" />
        <meta property="og:image:width" content="1216" />
        <meta property="og:image:height" content="640" />
        <meta property="og:site_name" content="McCall Commercial Fencing" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Commercial & Industrial Fencing Contractor | McCall Fencing" />
        <meta name="twitter:description" content="High-security fencing for industrial, municipal, and commercial properties. 25+ years experience." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="commercial fencing, industrial fencing, security fencing, high security fence, anti-ram fencing, stadium fencing, Johnson City, Kingsport, Bristol, Tennessee fence contractor" />
        
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(projectsSchema)}</script>
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <img 
            src={heroCommercial} 
            alt="Commercial chain link security fence at industrial facility" 
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-steel-blue/95 via-steel-blue/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-steel-blue via-transparent to-steel-blue/60" />
        </div>

        <div className="relative z-10 flex-1 flex items-center pt-24 md:pt-28 pb-20 md:pb-28">
          <div className="container-wide w-full">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-2 bg-steel-blue/60 text-white border-2 border-primary rounded-full text-sm font-semibold mb-4 md:mb-6 backdrop-blur-sm shadow-lg">
                  Commercial Fencing
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-4xl md:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg"
              >
                Commercial fencing built for{" "}
                <span className="text-primary drop-shadow-md">security and scale.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl text-white/90 leading-relaxed mb-6 md:mb-8 drop-shadow-md"
              >
                Industrial, municipal, and commercial fencing solutions trusted across the Tri Cities and beyond.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6"
              >
                <Link to="/contact?type=commercial" className="btn-primary text-sm md:text-base">
                  Request a Commercial Quote
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <a href="#projects" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-steel-blue hover:scale-105 text-sm md:text-base">
                  View Project Examples
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-sm text-white/70">
                  Trusted since 1997 • Large scale capability • Safety focused installs
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Chain link fence motif at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 overflow-hidden z-10">
          <div className="flex justify-between items-end h-full px-2">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 md:w-3 bg-gradient-to-b from-metal-light to-metal rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.03 }}
                style={{ boxShadow: "inset 1px 0 2px rgba(255,255,255,0.3), inset -1px 0 2px rgba(0,0,0,0.2)" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Built for High Demand Section */}
      <section className="pt-24 md:pt-32 pb-20 lg:pb-28 bg-card">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built for environments where failure is not an option.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-6">
              Commercial fencing is not just about marking a boundary. It is about safety, compliance, durability, and protecting people, property, and operations.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-16">
              McCall Commercial Fencing brings decades of experience to complex sites, tight timelines, and high security requirements. From industrial facilities to public venues, we build fencing systems that perform day after day.
            </p>
          </motion.div>

          {/* Icon Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "Security and access control" },
              { icon: Clock, title: "Durable, long life materials" },
              { icon: Users, title: "Experienced commercial crews" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="font-display font-semibold text-foreground">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Fencing Solutions - Dark Section */}
      <section id="fence-solutions" className="section-padding bg-steel-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--metal-light)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--metal-light)/0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
              Commercial fencing solutions
            </h2>
            <p className="text-lg md:text-xl text-cream/80 max-w-3xl mx-auto">
              We design and install fencing systems for a wide range of commercial and industrial needs. Each project is scoped carefully and built to meet site specific requirements.
            </p>
          </motion.div>

          {/* Alternating Fence Type Rows */}
          <div className="space-y-16 md:space-y-24">
            {fenceTypes.map((fence, index) => (
              <motion.div
                key={fence.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="relative rounded-xl overflow-hidden shadow-2xl">
                    <img 
                      src={fence.image} 
                      alt={fence.alt}
                      className="w-full aspect-[4/3] object-cover"
                      width={600}
                      height={450}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-blue/50 to-transparent" />
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-cream mb-4">
                    {fence.title}
                  </h3>
                  <p className="text-cream/80 text-lg leading-relaxed mb-6">
                    {fence.description}
                  </p>
                  <ul className="space-y-3">
                    {fence.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center gap-3 text-cream/90">
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Industries we serve
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our commercial fencing experience spans a wide range of industries and environments.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <industry.icon className="w-10 h-10 text-primary mb-4" />
                <p className="font-display font-semibold text-foreground text-sm md:text-base">{industry.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Commercial Projects - Dark Section */}
      <section id="projects" className="section-padding bg-steel-blue-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="chain-link-bg w-full h-full" />
        </div>

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
              Proven on large scale projects
            </h2>
            <p className="text-lg text-cream/80 max-w-3xl mx-auto">
              We have completed fencing projects for major facilities and high visibility sites.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-xl overflow-hidden bg-steel-blue"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={640}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-blue via-steel-blue/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full mb-3">
                    {project.industry}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-cream mb-2">
                    {project.title}
                  </h3>
                  <p className="text-cream/70 text-sm">
                    {project.location} • {project.scope}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How Commercial Projects Work */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              A process built for commercial timelines.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display font-bold text-sm">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground mt-12 text-sm"
          >
            We understand scheduling, safety meetings, and coordination with active facilities.
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Commercial fencing FAQ
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Dark Section */}
      <section className="section-padding bg-steel-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="chain-link-bg w-full h-full" />
        </div>

        <div className="container-narrow relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
              Let's talk about your commercial fencing needs.
            </h2>
            <p className="text-lg md:text-xl text-cream/80 max-w-2xl mx-auto mb-10">
              Whether you are planning a new facility or upgrading an existing site, we will help you design a fencing solution that meets your requirements and timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact?type=commercial" className="btn-primary">
                Request a Commercial Quote
                <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link to="/residential" className="inline-flex items-center justify-center px-8 py-4 border-2 border-cream text-cream font-semibold rounded-lg transition-all duration-300 hover:bg-cream hover:text-steel-blue">
                Explore Residential Fencing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
