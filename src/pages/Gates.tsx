import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Lock, 
  Cog, 
  Wrench, 
  ClipboardCheck, 
  Ruler, 
  Hammer, 
  CheckCircle
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

// Images
import heroImage from "@/assets/gates/hero-gates.jpg";
import slideGateImage from "@/assets/gates/slide-gate.jpg";
import swingGateImage from "@/assets/gates/swing-gate.jpg";
import barrierArmImage from "@/assets/gates/barrier-arm.jpg";
import cantileverGateImage from "@/assets/gates/cantilever-gate.jpg";
import communityAccessImage from "@/assets/gates/community-access.png";
import cardFobImage from "@/assets/gates/card-fob-access.jpg";
import remoteImage from "@/assets/gates/remote-control.jpg";
import appAccessImage from "@/assets/gates/app-access.jpg";
import intercomImage from "@/assets/gates/intercom-system.jpg";
import residentialGateImage from "@/assets/gates/residential-gate.jpg";
import commercialGateImage from "@/assets/gates/commercial-gate.jpg";

const gateTypes = [
  {
    id: "slide",
    title: "Slide Gates",
    image: slideGateImage,
    description: "Space-efficient gates that glide along a track, ideal for commercial driveways and tight spaces.",
    bullets: ["Runs on track or trackless system", "Best for wide openings", "Minimal swing clearance needed"],
    alt: "Commercial sliding gate on track at industrial facility"
  },
  {
    id: "swing",
    title: "Swing Gates",
    image: swingGateImage,
    description: "Classic dual or single swing gates that open inward or outward, perfect for residential driveways.",
    bullets: ["Elegant curb appeal", "Available in single or dual leaf", "Various decorative styles"],
    alt: "Elegant dual swing gate at luxury residential property"
  },
  {
    id: "barrier",
    title: "Barrier Arms",
    image: barrierArmImage,
    description: "Quick-operating barrier systems for parking lots, garages, and high-traffic commercial entries.",
    bullets: ["Fast cycle times", "Low maintenance", "Ideal for traffic control"],
    alt: "Parking lot barrier arm gate system"
  },
  {
    id: "cantilever",
    title: "Cantilever Gates",
    image: cantileverGateImage,
    description: "Heavy-duty suspended gates with no ground track, perfect for uneven terrain and industrial sites.",
    bullets: ["No ground track required", "Works on any terrain", "Heavy-duty construction"],
    alt: "Heavy-duty cantilever gate at industrial warehouse"
  }
];

const accessControlSystems = [
  {
    title: "Community Access",
    image: communityAccessImage,
    description: "Access control for communities, HOAs, and multi-tenant properties",
    alt: "LiftMaster CapXL community access control unit"
  },
  {
    title: "Card & Fob Access",
    image: cardFobImage,
    description: "Proximity cards and key fobs for quick, contactless entry",
    alt: "Card and fob access reader at gate entrance"
  },
  {
    title: "Remote Control",
    image: remoteImage,
    description: "Handheld transmitters for convenient gate operation from vehicles",
    alt: "Gate remote control device in hand"
  },
  {
    title: "Smartphone App",
    image: appAccessImage,
    description: "Open gates remotely and manage access from your phone",
    alt: "Smartphone app for gate access control"
  },
  {
    title: "Intercom Systems",
    image: intercomImage,
    description: "Video and audio intercoms for visitor verification",
    alt: "Gate intercom system with camera"
  }
];

const processSteps = [
  {
    step: 1,
    title: "Site Evaluation",
    description: "We assess your property, driveway grade, and access requirements.",
    icon: ClipboardCheck
  },
  {
    step: 2,
    title: "System Selection",
    description: "Choose the right gate type and access control for your needs.",
    icon: Ruler
  },
  {
    step: 3,
    title: "Professional Install",
    description: "Expert installation with proper electrical and safety features.",
    icon: Hammer
  },
  {
    step: 4,
    title: "Training & Handoff",
    description: "Full walkthrough of operation, programming, and maintenance.",
    icon: CheckCircle
  }
];

const faqs = [
  {
    question: "Can I add a gate to my existing fence?",
    answer: "Yes, in most cases we can install an automated gate that integrates with your existing fence. We'll assess the fence condition and ensure proper structural support for the gate and operator."
  },
  {
    question: "What power source do automated gates require?",
    answer: "Most gate operators run on standard 110V household power. We run a dedicated circuit to the operator location. Solar-powered options are also available for remote locations without easy access to electricity."
  },
  {
    question: "How wide can a residential driveway gate be?",
    answer: "Single swing gates typically range from 10-16 feet. Dual swing gates can cover openings up to 24 feet. Slide gates are ideal for very wide openings, accommodating spans of 30 feet or more."
  },
  {
    question: "What happens if the power goes out?",
    answer: "All our gate operators include battery backup and manual release mechanisms. You can open the gate manually during extended outages, and the battery backup provides operation during brief outages."
  },
  {
    question: "How long does gate installation take?",
    answer: "A typical residential gate installation takes 1-2 days. Commercial installations may take 2-5 days depending on the gate size, access control complexity, and site preparation requirements."
  },
  {
    question: "Do you offer maintenance and repair services?",
    answer: "Yes, we provide ongoing maintenance plans and repair services for all gate systems. Regular maintenance helps extend the life of your investment and prevents costly breakdowns."
  }
];

// Schema markup
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://mccall.lovable.app/#organization",
  "name": "McCall Commercial Fencing",
  "description": "Automated gate systems, access control, and entry solutions for residential and commercial properties in Johnson City, Kingsport, and Bristol.",
  "url": "https://mccall.lovable.app/gates",
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
    { "@type": "City", "name": "Bristol", "containedInPlace": { "@type": "State", "name": "Virginia" } }
  ],
  "priceRange": "$$"
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
    { "@type": "ListItem", "position": 2, "name": "Gates & Access Control", "item": "https://mccall.lovable.app/gates" }
  ]
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Gate Types and Access Control Systems",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "item": { "@type": "Product", "name": "Slide Gates", "description": "Space-efficient gates that glide along a track, ideal for commercial driveways" } },
    { "@type": "ListItem", "position": 2, "item": { "@type": "Product", "name": "Swing Gates", "description": "Classic dual or single swing gates for residential driveways" } },
    { "@type": "ListItem", "position": 3, "item": { "@type": "Product", "name": "Barrier Arms", "description": "Quick-operating barrier systems for parking lots and high-traffic entries" } },
    { "@type": "ListItem", "position": 4, "item": { "@type": "Product", "name": "Cantilever Gates", "description": "Heavy-duty suspended gates with no ground track" } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get an Automated Gate Installed",
  "description": "The process for getting a new automated gate and access control system installed by McCall Commercial Fencing.",
  "step": [
    { "@type": "HowToStep", "name": "Consultation", "text": "We assess your property, discuss your needs, and recommend the best gate and access control options." },
    { "@type": "HowToStep", "name": "Design & Quote", "text": "We design your system and provide a detailed quote including all electrical requirements." },
    { "@type": "HowToStep", "name": "Installation", "text": "Our team installs your gate, runs electrical, and programs your access control system." },
    { "@type": "HowToStep", "name": "Training & Support", "text": "We train you on operation and provide ongoing maintenance support." }
  ]
};

export default function GatesPage() {
  return (
    <>
      <Helmet>
        <title>Gate Operators & Access Control | Johnson City, Kingsport, Bristol | McCall</title>
        <meta 
          name="description" 
          content="Automated gate systems, access control, slide gates, swing gates, and entry solutions. Residential and commercial installation since 1997. Free estimates." 
        />
        <link rel="canonical" href="https://mccall.lovable.app/gates" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Gate Operators & Access Control | McCall Fencing" />
        <meta property="og:description" content="Automated gates, access control, and entry solutions for homes and businesses in the Tri-Cities. Professional installation." />
        <meta property="og:url" content="https://mccall.lovable.app/gates" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mccall.lovable.app/og-gates.jpg" />
        <meta property="og:image:width" content="1216" />
        <meta property="og:image:height" content="640" />
        <meta property="og:site_name" content="McCall Commercial Fencing" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gate Operators & Access Control | McCall Fencing" />
        <meta name="twitter:description" content="Automated gate installation and access control systems. 25+ years experience." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="gate operators, automatic gate, slide gate, swing gate, access control, driveway gate, commercial gate, residential gate, Johnson City, Kingsport, Bristol" />
        
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <Navigation />

      {/* Hero Section - Matching Commercial/Residential style */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Automated sliding gate opening at commercial property" 
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
        </div>

        <div className="relative z-10 flex-1 flex items-center pt-24 md:pt-28 pb-20 md:pb-28">
          <div className="container-wide w-full">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-2 bg-charcoal/60 text-white border-2 border-gold rounded-full text-sm font-semibold mb-4 md:mb-6 backdrop-blur-sm shadow-lg">
                  Gate Operators & Access Control
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-4xl md:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg"
              >
                Smarter access starts{" "}
                <span className="text-primary drop-shadow-md">at the gate.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl text-white/90 leading-relaxed mb-6 md:mb-8 drop-shadow-md"
              >
                Automated gate systems and access control that protect your property 
                and simplify entry for homes and businesses across the Tri Cities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6"
              >
                <Link to="/contact?type=gates" className="btn-primary text-sm md:text-base">
                  Get a Gate Quote
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <a href="#gate-types" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-charcoal hover:scale-105 text-sm md:text-base">
                  Explore Gate Types
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-sm text-white/70">
                  Trusted since 1997 • Residential & commercial installs • Professional installation
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Ornamental iron fence motif at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-28 overflow-hidden z-10">
          {/* Bottom rail */}
          <div className="absolute bottom-0 left-0 right-0 h-3 md:h-4 bg-gradient-to-b from-metal-light to-metal" 
            style={{ boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 -2px 8px rgba(0,0,0,0.3)" }} 
          />
          {/* Iron pickets with finials */}
          <div className="flex justify-between items-end h-full px-4 md:px-6">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "100%", opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.04 }}
              >
                {/* Spear point finial */}
                <div 
                  className="w-0 h-0 mb-[-1px]"
                  style={{
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderBottom: "10px solid hsl(215 10% 65%)",
                    filter: "drop-shadow(0 -1px 1px rgba(255,255,255,0.4))"
                  }}
                />
                {/* Decorative collar */}
                <div className="w-3 md:w-4 h-1.5 md:h-2 bg-gradient-to-b from-metal-light to-metal rounded-sm mb-[-1px]"
                  style={{ boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)" }}
                />
                {/* Main picket */}
                <div 
                  className="w-1.5 md:w-2 flex-1 bg-gradient-to-b from-metal-light via-metal to-charcoal"
                  style={{ 
                    boxShadow: "inset 1px 0 2px rgba(255,255,255,0.3), inset -1px 0 2px rgba(0,0,0,0.3), 2px 0 4px rgba(0,0,0,0.2)"
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More Than a Gate Section - Light (matching Residential/Commercial) */}
      <section className="pt-24 md:pt-32 pb-20 lg:pb-28 bg-card">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              More than a gate. A point of control.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-6">
              A quality gate system does more than mark your property line—it manages 
              who enters, protects what matters, and operates reliably year after year.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-6">
              We install gate operators and access control systems that combine smooth 
              automation with smart entry management, for both residential and commercial properties.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-16">
              Our gate designers and installers are AFA Certified through the American Fence Association.
            </p>
          </motion.div>

          {/* Icon Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Lock, title: "Controlled access" },
              { icon: Cog, title: "Reliable automation" },
              { icon: Wrench, title: "Clean installs" },
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

      {/* Gate Types Section - Dark (Navy like Residential) */}
      <section id="gate-types" className="section-padding bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
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
              Gate types and configurations
            </h2>
            <p className="text-lg md:text-xl text-cream/80 max-w-3xl mx-auto">
              From elegant residential swing gates to heavy-duty industrial sliders, 
              we install the right system for your application.
            </p>
          </motion.div>

          {/* Alternating Gate Type Rows - Matching Commercial layout */}
          <div className="space-y-16 md:space-y-24">
            {gateTypes.map((gate, index) => (
              <motion.div
                key={gate.id}
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
                      src={gate.image}
                      alt={gate.alt}
                      className="w-full aspect-[4/3] object-cover"
                      width={600}
                      height={450}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-cream mb-4">
                    {gate.title}
                  </h3>
                  <p className="text-cream/80 text-lg mb-6">
                    {gate.description}
                  </p>
                  <ul className="space-y-3">
                    {gate.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3 text-cream/70">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Control Section - Light */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Access control systems
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Control who enters your property with modern access solutions that 
              balance security with convenience.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {accessControlSystems.map((system, index) => (
              <motion.div
                key={system.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={system.image}
                    alt={system.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-1 text-sm md:text-base">
                    {system.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {system.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Residential vs Commercial Section - Dark (Steel Blue like Commercial) */}
      <section className="section-padding bg-steel-blue relative overflow-hidden">
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
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
              Built for homes and businesses
            </h2>
            <p className="text-lg md:text-xl text-cream/80 max-w-3xl mx-auto">
              Whether you're securing a private residence or managing access for a commercial facility, 
              we have the expertise and equipment for your project.
            </p>
          </motion.div>

          <Tabs defaultValue="residential" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 bg-steel-blue-dark border border-cream/20">
              <TabsTrigger 
                value="residential" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-cream/70 font-semibold"
              >
                Residential
              </TabsTrigger>
              <TabsTrigger 
                value="commercial"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-cream/70 font-semibold"
              >
                Commercial
              </TabsTrigger>
            </TabsList>

            <TabsContent value="residential">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={residentialGateImage}
                    alt="Elegant residential driveway gate"
                    className="w-full aspect-[4/3] object-cover"
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-blue/60 via-transparent to-transparent" />
                </div>
                <div className="space-y-6">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-cream">
                    Residential Gate Solutions
                  </h3>
                  <p className="text-cream/80 text-lg">
                    Add curb appeal, security, and convenience to your home with an automated 
                    driveway gate. From ornamental swing gates to modern sliders, we help you 
                    choose a style that complements your property.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Decorative iron, aluminum, and wood options",
                      "Quiet operators for residential neighborhoods",
                      "Smartphone control and visitor management",
                      "Solar power options for remote driveways",
                      "Safety sensors and auto-reverse features"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-cream/70">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact?type=gates"
                    className="inline-flex items-center text-primary font-semibold hover:underline"
                  >
                    Request a residential quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="commercial">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={commercialGateImage}
                    alt="Commercial industrial entry gate"
                    className="w-full aspect-[4/3] object-cover"
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-blue/60 via-transparent to-transparent" />
                </div>
                <div className="space-y-6">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-cream">
                    Commercial Gate Solutions
                  </h3>
                  <p className="text-cream/80 text-lg">
                    Secure your facility, manage employee and visitor access, and project 
                    a professional image with industrial-grade gate systems designed for 
                    high-cycle commercial use.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Heavy-duty slide and cantilever gates",
                      "High-cycle operators for frequent use",
                      "Multi-tenant access control systems",
                      "Integration with security cameras and systems",
                      "Crash-rated and anti-ram options available"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-cream/70">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact?type=gates"
                    className="inline-flex items-center text-primary font-semibold hover:underline"
                  >
                    Request a commercial quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Steps Section - Light (Matching Residential/Commercial) */}
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
              A clear process from install to operation
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We guide you through every step, from initial consultation to final training.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border z-0" />
                )}
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Light */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Gate and access control FAQ
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-display font-medium text-foreground">
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

      {/* Final CTA Section - Dark (Navy) */}
      <section className="section-padding bg-navy">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
              Ready to control access with confidence?
            </h2>
            <p className="text-lg md:text-xl text-cream/80 mb-10 max-w-2xl mx-auto">
              Let's discuss the right gate and access control solution for your property. 
              From residential driveways to commercial facilities, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact?type=gates"
                className="btn-primary"
              >
                Get a Gate Quote
                <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link
                to="/commercial"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-cream/30 text-cream font-semibold rounded-lg transition-all duration-300 hover:bg-cream/10"
              >
                Explore Commercial Fencing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}