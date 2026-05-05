import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Trees, 
  Fence, 
  Link2, 
  Sparkles, 
  Shield,
  Eye,
  Heart,
  Home,
  ClipboardCheck,
  Ruler,
  Hammer,
  CheckCircle,
  ChevronDown,
  X
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FenceEstimator from "@/components/FenceEstimator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Hero image
import heroResidential from "@/assets/residential/hero-residential.jpg";

// Fence type images
import woodFenceFull from "@/assets/residential/wood-fence-full.jpg";
import woodFenceDetail from "@/assets/residential/wood-fence-detail.jpg";
import vinylFenceFull from "@/assets/residential/vinyl-fence-full.jpg";
import vinylFenceDetail from "@/assets/residential/vinyl-fence-detail.jpg";
import chainlinkFenceFull from "@/assets/residential/chainlink-fence-full.jpg";
import chainlinkFenceDetail from "@/assets/residential/chainlink-fence-detail.jpg";
import ornamentalFenceFull from "@/assets/residential/ornamental-fence-full.jpg";
import ornamentalFenceDetail from "@/assets/residential/ornamental-fence-detail.jpg";
import poolFenceFull from "@/assets/residential/pool-fence-full.jpg";
import poolFenceDetail from "@/assets/residential/pool-fence-detail.jpg";

// Gallery images
import galleryWood1 from "@/assets/residential/gallery-wood-1.jpg";
import galleryWood2 from "@/assets/residential/gallery-wood-2.jpg";
import galleryWood3 from "@/assets/residential/gallery-wood-3.jpg";
import galleryVinyl1 from "@/assets/residential/gallery-vinyl-1.jpg";
import galleryVinyl2 from "@/assets/residential/gallery-vinyl-2.jpg";
import galleryVinyl3 from "@/assets/residential/gallery-vinyl-3.jpg";
import galleryVinyl4 from "@/assets/residential/gallery-vinyl-4.jpg";
import galleryChainlink1 from "@/assets/residential/gallery-chainlink-1.jpg";
import galleryChainlink2 from "@/assets/residential/gallery-chainlink-2.jpg";
import galleryOrnamental1 from "@/assets/residential/gallery-ornamental-1.jpg";
import galleryOrnamental2 from "@/assets/residential/gallery-ornamental-2.jpg";
import galleryPool1 from "@/assets/residential/gallery-pool-1.jpg";

const fenceTypes = [
  {
    id: "wood",
    title: "Wood Privacy Fencing",
    description: "Classic, warm, and built for true backyard privacy. Wood fencing is a favorite for homeowners who want a natural look and a quiet space that feels tucked in.",
    bullets: ["Full privacy options", "Multiple picket and panel styles", "Great for backyards and pets"],
    icon: Trees,
    fullImage: woodFenceFull,
    detailImage: woodFenceDetail,
  },
  {
    id: "vinyl",
    title: "Vinyl and PVC Fencing",
    description: "Clean lines, low maintenance, and built to stay looking sharp. Vinyl fencing is ideal if you want long term durability without staining or repainting.",
    bullets: ["Low upkeep", "Long lasting finish", "Great for clean, modern curb appeal"],
    icon: Fence,
    fullImage: vinylFenceFull,
    detailImage: vinylFenceDetail,
  },
  {
    id: "chainlink",
    title: "Chain Link Fencing",
    description: "Affordable, durable, and practical. Chain link fencing is a great fit for pet areas, property lines, and homeowners who want secure boundaries with a lighter footprint.",
    bullets: ["Cost effective", "Optional coated finishes", "Add privacy slats if needed"],
    icon: Link2,
    fullImage: chainlinkFenceFull,
    detailImage: chainlinkFenceDetail,
  },
  {
    id: "ornamental",
    title: "Ornamental Aluminum and Steel",
    description: "Elegant, strong, and perfect when you want security without blocking the view. Ornamental fencing is popular for front yards, gardens, and pool areas.",
    bullets: ["Clean, high end look", "Strong perimeter protection", "Ideal for pools and visible spaces"],
    icon: Sparkles,
    fullImage: ornamentalFenceFull,
    detailImage: ornamentalFenceDetail,
  },
  {
    id: "pool",
    title: "Pool and Safety Fencing",
    description: "Safety comes first. We install fences that help meet local code requirements and create clear boundaries for pool areas and family spaces.",
    bullets: ["Safety focused installs", "Gate options available", "Built for peace of mind"],
    icon: Shield,
    fullImage: poolFenceFull,
    detailImage: poolFenceDetail,
  },
];

const galleryImages = [
  { src: galleryWood1, alt: "Wood privacy fence installation in Johnson City Tennessee", category: "wood" },
  { src: galleryWood2, alt: "Cedar wood fence with gate in Kingsport Tennessee", category: "wood" },
  { src: galleryWood3, alt: "Shadowbox wood fence in residential backyard Tennessee", category: "wood" },
  { src: galleryVinyl1, alt: "White vinyl privacy fence in Bristol Tennessee backyard", category: "vinyl" },
  { src: galleryVinyl2, alt: "Tan vinyl fence with lattice top in Tennessee home", category: "vinyl" },
  { src: galleryVinyl3, alt: "White vinyl picket fence front yard Tennessee", category: "vinyl" },
  { src: galleryVinyl4, alt: "White vinyl privacy fence suburban backyard with patio Tennessee", category: "vinyl" },
  { src: galleryChainlink1, alt: "Black coated chain link fence with dog in Tennessee home", category: "chainlink" },
  { src: galleryChainlink2, alt: "Galvanized chain link fence property line Tennessee", category: "chainlink" },
  { src: galleryOrnamental1, alt: "Black ornamental aluminum fence front yard Johnson City", category: "ornamental" },
  { src: galleryOrnamental2, alt: "Decorative ornamental gate with fence in Tennessee", category: "ornamental" },
  { src: galleryPool1, alt: "Pool safety fence installation Tri Cities Tennessee", category: "pool" },
];

const processSteps = [
  {
    step: 1,
    title: "On-site Estimate",
    description: "We learn what you need, measure the space, and talk through options.",
    icon: ClipboardCheck,
  },
  {
    step: 2,
    title: "Design and Pricing",
    description: "We confirm style, height, gates, and timeline, then provide clear pricing.",
    icon: Ruler,
  },
  {
    step: 3,
    title: "Professional Installation",
    description: "Our crew installs your fence with clean lines, solid posts, and attention to detail.",
    icon: Hammer,
  },
  {
    step: 4,
    title: "Final Walkthrough",
    description: "We confirm everything looks right, functions smoothly, and meets expectations.",
    icon: CheckCircle,
  },
];

const faqs = [
  {
    question: "How much does a residential fence cost per foot?",
    answer: "Cost depends on material, height, gates, and terrain. We can share a quick estimate and then confirm with an on-site visit.",
  },
  {
    question: "Do you install fences in Johnson City, Kingsport, and Bristol?",
    answer: "Yes. We serve the Tri-Cities and surrounding areas in Northeast Tennessee.",
  },
  {
    question: "How long does installation usually take?",
    answer: "Many residential projects can be installed quickly once materials and scheduling are confirmed. We will give a timeline upfront.",
  },
  {
    question: "Can you remove an old fence?",
    answer: "Yes. We can remove and haul away existing fencing as part of your project.",
  },
  {
    question: "Do you offer financing?",
    answer: "Yes. Financing options are available. Ask our team and we will walk you through it.",
  },
  {
    question: "Do you install gates?",
    answer: "Yes. We install standard gates and can also add automated gate systems when needed.",
  },
  {
    question: "What fence style is best for dogs?",
    answer: "Many homeowners choose wood privacy or coated chain link, depending on the yard and the size of the pet. We will recommend the safest fit.",
  },
  {
    question: "Do I need a permit or to call before digging?",
    answer: "Requirements vary by location. We will help you understand what is needed and coordinate the right next steps.",
  },
];

const filterOptions = ["All", "Wood", "Vinyl", "Chain link", "Ornamental", "Pool"];

// Schema markup
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://mccall.lovable.app/#organization",
  "name": "McCall Commercial Fencing",
  "description": "Professional residential fence installation in Johnson City, Kingsport, and Bristol TN. Wood, vinyl, chain link, ornamental, and pool fencing with 25+ years of experience.",
  "url": "https://mccall.lovable.app/residential",
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
    { "@type": "ListItem", "position": 2, "name": "Residential Fencing", "item": "https://mccall.lovable.app/residential" }
  ]
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Residential Fence Installation",
  "provider": { "@id": "https://mccall.lovable.app/#organization" },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 36.4167, "longitude": -82.4833 },
    "geoRadius": "50 mi"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Residential Fencing Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wood Privacy Fence Installation", "description": "Classic wood fencing for backyard privacy and curb appeal" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vinyl Fence Installation", "description": "Low maintenance vinyl and PVC fencing solutions" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Chain Link Fence Installation", "description": "Affordable and durable chain link for property boundaries" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ornamental Aluminum Fence Installation", "description": "Elegant ornamental fencing for pools and front yards" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pool Safety Fence Installation", "description": "Code-compliant pool fencing for family safety" } }
    ]
  }
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get a Residential Fence Installed",
  "description": "The process for getting a new residential fence installed by McCall Commercial Fencing in the Tri-Cities area.",
  "step": [
    { "@type": "HowToStep", "name": "Consultation", "text": "Contact us for a free site visit and project consultation." },
    { "@type": "HowToStep", "name": "Planning", "text": "We measure, recommend materials, and provide a detailed estimate." },
    { "@type": "HowToStep", "name": "Installation", "text": "Our crew installs your fence with professional equipment and care." },
    { "@type": "HowToStep", "name": "Inspection", "text": "Final walkthrough ensures every detail meets your expectations." }
  ]
};

export default function ResidentialPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const filteredGallery = activeFilter === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter.toLowerCase().replace(" ", ""));

  return (
    <>
      <Helmet>
        <title>Residential Fencing in Johnson City, Kingsport & Bristol | McCall Fencing</title>
        <meta name="description" content="Professional residential fence installation in the Tri-Cities. Wood, vinyl, chain link, ornamental & pool fencing. 25+ years experience. Free estimates." />
        <link rel="canonical" href="https://mccall.lovable.app/residential" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Residential Fencing in the Tri-Cities | McCall Fencing" />
        <meta property="og:description" content="Wood, vinyl, chain link, and ornamental fence installation. Built with intention, crafted with pride. Free quotes." />
        <meta property="og:url" content="https://mccall.lovable.app/residential" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mccall.lovable.app/og-residential.jpg" />
        <meta property="og:image:width" content="1216" />
        <meta property="og:image:height" content="640" />
        <meta property="og:site_name" content="McCall Commercial Fencing" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Residential Fencing in the Tri-Cities | McCall Fencing" />
        <meta name="twitter:description" content="Wood, vinyl, chain link, and ornamental fence installation. 25+ years experience. Free quotes." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="residential fencing, wood fence, vinyl fence, chain link fence, ornamental fence, pool fence, Johnson City fence, Kingsport fence, Bristol fence, Tennessee fence contractor" />
        
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <img 
            src={heroResidential} 
            alt="Family backyard with beautiful cedar privacy fence at sunset" 
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
                  Residential Fencing
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-4xl md:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg"
              >
                Residential fencing that{" "}
                <span className="text-primary drop-shadow-md">feels like home.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl text-white/90 leading-relaxed mb-6 md:mb-8 drop-shadow-md"
              >
                Privacy, safety, and curb appeal. Built with commercial grade materials and a crew that takes pride in the details.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6"
              >
                <Link to="/contact?type=residential" className="btn-primary text-sm md:text-base">
                  Get a Free Quote
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <a href="#fence-styles" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-charcoal hover:scale-105 text-sm md:text-base">
                  Explore Fence Styles
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-sm text-white/70">
                  Trusted since 1997 • Licensed and insured • Financing available
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Fence motif at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 overflow-hidden z-10">
          <div className="flex justify-between items-end h-full px-2">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 md:w-5 bg-gradient-to-b from-wood to-wood-dark rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.05 }}
                style={{ boxShadow: "inset 2px 0 4px rgba(255,255,255,0.2), inset -2px 0 4px rgba(0,0,0,0.2)" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Built for Real Life Section */}
      <section className="pt-24 md:pt-32 pb-20 lg:pb-28 bg-card">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built for real life, not just day one.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              A residential fence has a job to do. Keep kids safe, give pets room to run, create privacy, and make the whole property feel finished. At McCall, we build fences that hold up to weather, time, and everyday use.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-16">
              We use durable materials, clean installs, and a process that keeps things clear from the first quote to the final walkthrough.
            </p>
          </motion.div>

          {/* Icon Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Eye, title: "Privacy and peace of mind" },
              { icon: Heart, title: "Pet and family safety" },
              { icon: Home, title: "Curb appeal that lasts" },
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

      {/* Fence Options Section - Navy Background */}
      <section id="fence-styles" className="section-padding bg-navy relative overflow-hidden">
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
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
              Choose a fence style that fits your home.
            </h2>
            <p className="text-lg text-cream/70 max-w-3xl mx-auto">
              Every yard is different. We will help you choose the right material, height, and layout for your property, your goals, and your budget.
            </p>
          </motion.div>

          {/* Alternating Fence Type Rows */}
          <div className="space-y-20">
            {fenceTypes.map((fence, index) => (
              <motion.div
                key={fence.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
              >
                {/* Images */}
                <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                  <img 
                    src={fence.fullImage} 
                    alt={`${fence.title} installation in Tri-Cities Tennessee`}
                    className="rounded-xl shadow-lg w-full h-48 md:h-64 object-cover"
                    width={400}
                    height={256}
                    loading="lazy"
                    decoding="async"
                  />
                  <img 
                    src={fence.detailImage} 
                    alt={`${fence.title} detail craftsmanship`}
                    width={400}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className="rounded-xl shadow-lg w-full h-48 md:h-64 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <fence.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-cream">{fence.title}</h3>
                  </div>
                  <p className="text-cream/80 leading-relaxed mb-6">{fence.description}</p>
                  <ul className="space-y-2">
                    {fence.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-center gap-2 text-cream/70">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gate operators link */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16 text-cream/60"
          >
            Looking for automated entry? Gate operators coming soon.
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-card">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Residential Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A few examples of fences we have built for homeowners across the Tri-Cities.
            </p>
          </motion.div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/20"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Gallery Grid - Desktop */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGallery.map((image, i) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setLightboxImage(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  width={400}
                  height={256}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                    View larger
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gallery Carousel - Mobile */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4" style={{ width: `${filteredGallery.length * 280}px` }}>
              {filteredGallery.map((image) => (
                <div 
                  key={image.src} 
                  className="w-64 flex-shrink-0 cursor-pointer"
                  onClick={() => setLightboxImage(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-xl"
                    width={256}
                    height={192}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lightbox Modal */}
          {lightboxImage && (
            <div 
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
                onClick={() => setLightboxImage(null)}
              >
                <X size={32} />
              </button>
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section - Charcoal Background */}
      <section className="section-padding bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
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
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
              A simple process, built to move fast.
            </h2>
          </motion.div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6 mx-auto w-20 h-20">
                  {/* Fence post icon background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-wood to-wood-dark rounded-t-sm" 
                    style={{ boxShadow: "inset 2px 0 4px rgba(255,255,255,0.2), inset -2px 0 4px rgba(0,0,0,0.2)" }} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-cream" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-cream mb-3">{step.title}</h3>
                <p className="text-cream/70">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Calculator CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-cream/60 mb-4">
              Want a faster starting point? Try the fence cost calculator, then we will confirm details on site.
            </p>
            <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
              <DialogTrigger asChild>
                <button className="btn-primary">
                  Try the Calculator
                  <ArrowRight className="ml-2" size={18} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <FenceEstimator />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-card">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Residential Fencing FAQ
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`faq-${i}`}
                  className="bg-background rounded-lg border border-border px-6"
                >
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

      {/* Final CTA Section - Navy Background */}
      <section className="section-padding bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.3) 0%, transparent 50%)`,
          }} />
        </div>

        <div className="container-narrow relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
              Ready to build a fence that lasts?
            </h2>
            <p className="text-lg md:text-xl text-cream/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Tell us what you are thinking. We will help you choose the right style, confirm pricing, and get you on the schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact?type=residential" className="btn-primary text-lg">
                Get a Free Quote
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <span className="inline-flex items-center justify-center px-8 py-4 border-2 border-cream/30 text-cream/60 font-semibold rounded-lg cursor-default text-lg">
                Explore Commercial Fencing (Coming Soon)
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
