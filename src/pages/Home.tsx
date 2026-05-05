import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin, Clock, Phone, Mail, Trees, Fence, Link2, Shield, Lock, Sparkles, Box, Map, ExternalLink, Home } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FenceStyleSelector from "@/components/FenceStyleSelector";
import ServiceCard from "@/components/ServiceCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProjectGallery from "@/components/ProjectGallery";
import TrustedByMarquee from "@/components/TrustedByMarquee";

import CTASection from "@/components/CTASection";
import FenceDivider from "@/components/FenceDivider";
import FenceEstimator from "@/components/FenceEstimator";
import FenceGallery from "@/components/FenceGallery";
import heroFence from "@/assets/hero-fence.jpg";

// SEO Schema Markup
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://mccall.lovable.app/#organization",
  "name": "McCall Commercial Fencing",
  "alternateName": "McCall Fencing",
  "description": "Professional fence installation contractor serving the Tri-Cities area of Tennessee and Virginia since 1997. Specializing in residential, commercial, and industrial fencing including wood, vinyl, chain link, ornamental, and high-security solutions.",
  "url": "https://mccall.lovable.app",
  "logo": "https://mccall.lovable.app/mccall-logo.png",
  "image": "https://mccall.lovable.app/hero-fence.jpg",
  "telephone": "+1-423-477-4882",
  "email": "info@mccallfencing.com",
  "foundingDate": "1997",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6248 Kingsport Hwy",
    "addressLocality": "Gray",
    "addressRegion": "TN",
    "postalCode": "37615",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 36.4167,
    "longitude": -82.4833
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "areaServed": [
    { "@type": "City", "name": "Johnson City", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Kingsport", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Bristol", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Bristol", "containedInPlace": { "@type": "State", "name": "Virginia" } },
    { "@type": "City", "name": "Gray", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Elizabethton", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Greeneville", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Abingdon", "containedInPlace": { "@type": "State", "name": "Virginia" } }
  ],
  "sameAs": [
    "https://www.google.com/search?q=McCall+Commercial+Fencing"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "6",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Matt E" },
      "reviewBody": "I highly recommend McCall fencing. They did a great job and it didn't take but maybe two days for them to install 400ft of fence."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "C T" },
      "reviewBody": "Excellent job with our fence at a good price. Built 3 years ago and looks like it did when they built it."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Sarah Nichole Brown" },
      "reviewBody": "Very professional company. Easy to work with. Quality service and results."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Caleb Mayo" },
      "reviewBody": "Been going for 25 years wouldn't go anywhere else. Best and most honest staff."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Marty Watts" },
      "reviewBody": "Professionalism in everything they do from start to finish."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Harry Reed" },
      "reviewBody": "Great guys who do the work right!"
    }
  ],
  "priceRange": "$$",
  "paymentAccepted": "Cash, Check, Credit Card",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Fencing Services",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Residential Fencing",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wood Fence Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vinyl Fence Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Chain Link Fence Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ornamental Fence Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pool Fence Installation" } }
        ]
      },
      {
        "@type": "OfferCatalog",
        "name": "Commercial Fencing",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "High Security Fencing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Industrial Fencing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Anti-Ram Barrier Fencing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sports Field Fencing" } }
        ]
      },
      {
        "@type": "OfferCatalog",
        "name": "Gate Installation",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Gate Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Access Control Systems" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Slide Gate Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Swing Gate Installation" } }
        ]
      }
    ]
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://mccall.lovable.app/#website",
  "url": "https://mccall.lovable.app",
  "name": "McCall Commercial Fencing",
  "description": "Professional fence installation in Johnson City, Kingsport, and Bristol TN",
  "publisher": { "@id": "https://mccall.lovable.app/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://mccall.lovable.app/?s={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://mccall.lovable.app/#webpage",
  "url": "https://mccall.lovable.app",
  "name": "McCall Commercial Fencing | Tri-Cities Fence Contractor Since 1997",
  "description": "Professional fence installation in Johnson City, Kingsport, and Bristol. Wood, vinyl, chain link, ornamental, and commercial fencing with 25+ years of experience. Get a free estimate today.",
  "isPartOf": { "@id": "https://mccall.lovable.app/#website" },
  "about": { "@id": "https://mccall.lovable.app/#organization" },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://mccall.lovable.app/hero-fence.jpg"
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-description", ".company-intro"]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://mccall.lovable.app"
    }
  ]
};

// Service images
import woodFenceImg from "@/assets/services/wood-fence.jpg";
import pvcFenceImg from "@/assets/services/pvc-fence.jpg";
import chainLinkImg from "@/assets/services/chain-link.jpg";
import ornamentalImg from "@/assets/services/ornamental-fence.jpg";
import highSecurityImg from "@/assets/services/high-security-fence.jpg";
import wroughtIronImg from "@/assets/services/wrought-iron-fence.jpg";
import aluminumImg from "@/assets/services/aluminum-fence.jpg";
import diyFenceImg from "@/assets/services/diy-fence.png";

type FenceStyle = "wood" | "vinyl" | "chainlink";

// Feature flag: Set to true to show the "Draw Your Fence" estimate tool section
const SHOW_DRAW_YOUR_FENCE_SECTION = false;

const services = [
  {
    title: "Wood Fencing",
    description: "Classic pine or cedar with customizable styles, colors, and finishes for lasting beauty.",
    icon: Trees,
    image: woodFenceImg,
  },
  {
    title: "PVC / Vinyl",
    description: "Low maintenance, rot-resistant fencing in a variety of colors. Built to last a lifetime.",
    icon: Fence,
    image: pvcFenceImg,
  },
  {
    title: "Chain Link",
    description: "Cost-effective and durable. Customizable colors and gauges for any property.",
    icon: Link2,
    image: chainLinkImg,
  },
  {
    title: "Ornamental",
    description: "Decorative fencing that handles any terrain. Beautiful, functional security.",
    icon: Sparkles,
    image: ornamentalImg,
  },
  {
    title: "High Security",
    description: "Tall structures with anti-climb features for properties requiring maximum protection.",
    icon: Shield,
    image: highSecurityImg,
  },
  {
    title: "Wrought Iron",
    description: "Timeless strength and elegance. Outlasts wood, vinyl, and composite materials.",
    icon: Lock,
    image: wroughtIronImg,
  },
  {
    title: "Aluminum",
    description: "Lightweight, durable, and nearly maintenance-free with ornamental options.",
    icon: Building2,
    image: aluminumImg,
  },
  {
    title: "DIY Fence Kits",
    description: "Commercial-grade materials delivered to you with a customized installation plan.",
    icon: Box,
    image: diyFenceImg,
  },
];


export default function HomePage() {
  const [selectedStyle, setSelectedStyle] = useState<FenceStyle>("chainlink");

  const getPostColor = () => {
    switch (selectedStyle) {
      case "vinyl": return "from-cream to-muted";
      case "chainlink": return "from-metal-light to-metal";
      default: return "from-wood to-wood-dark";
    }
  };

  const getPanelStyle = () => {
    switch (selectedStyle) {
      case "vinyl": return "bg-cream border border-muted";
      case "chainlink": return "chain-link-bg bg-metal/10";
      default: return "wood-slats";
    }
  };

  const renderWoodSlats = () => (
    <div className="absolute bottom-[20px] md:bottom-[40px] left-0 right-0 flex gap-0.5 md:gap-2 px-1">
      {[...Array(40)].map((_, slatIndex) => (
        <motion.div
          key={`${selectedStyle}-slat-${slatIndex}`}
          className="flex-1 h-[80px] md:h-[215px] relative wood-slat rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 2.0 + slatIndex * 0.04, ease: "easeOut" }}
        />
      ))}
    </div>
  );

  const renderOrnamentalFence = () => (
    <div className="absolute bottom-[20px] md:bottom-[40px] left-0 right-0 px-1">
      {/* Vertical Pickets */}
      <div className="flex justify-between items-end h-[80px] md:h-[200px]">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={`ornamental-picket-${i}`}
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3, delay: 2.0 + i * 0.02, ease: "easeOut" }}
            style={{ transformOrigin: "bottom" }}
          >
            {/* Spear Point Top */}
            <div 
              className="w-1 md:w-1.5 h-3 md:h-4 bg-gradient-to-t from-charcoal to-charcoal/80"
              style={{
                clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)"
              }}
            />
            {/* Main Picket */}
            <div 
              className="w-0.5 md:w-1 h-[70px] md:h-[190px] bg-gradient-to-b from-charcoal via-charcoal/90 to-charcoal"
              style={{
                boxShadow: "1px 0 2px rgba(255,215,0,0.2), -1px 0 2px rgba(0,0,0,0.3)"
              }}
            />
            {/* Decorative Scroll - every 5th picket */}
            {i % 5 === 2 && (
              <motion.div
                className="absolute top-[40px] md:top-[50px] w-4 md:w-6 h-4 md:h-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 2.5 + i * 0.02 }}
              >
                <svg viewBox="0 0 24 24" className="w-full h-full text-gold drop-shadow-md">
                  <path 
                    fill="currentColor" 
                    d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.8 3.7L12 12l2.7-1.8c1.1-.9 1.8-2.2 1.8-3.7C16.5 4 14.5 2 12 2zm0 7c-1.4 0-2.5-1.1-2.5-2.5S10.6 4 12 4s2.5 1.1 2.5 2.5S13.4 9 12 9z"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      {/* Horizontal Rail Accent */}
      <motion.div
        className="absolute top-[60px] md:top-[80px] left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r from-charcoal via-gold/30 to-charcoal"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, delay: 2.3 }}
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
      />
    </div>
  );

  const renderOtherPanels = () => (
    <div className={`absolute bottom-[20px] md:bottom-[40px] left-0 right-0 h-[80px] md:h-[200px] px-1 ${selectedStyle === "chainlink" ? "chain-link-bg" : ""}`}>
      {selectedStyle !== "chainlink" && (
        <div className="flex h-full">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`${selectedStyle}-panel-${i}`}
              className={`flex-1 h-full rounded-sm ${getPanelStyle()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 2.0 + i * 0.1, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
      {selectedStyle === "chainlink" && (
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.0, ease: "easeOut" }}
        />
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>McCall Commercial Fencing | Tri-Cities Fence Contractor Since 1997</title>
        <meta name="description" content="Professional fence installation in Johnson City, Kingsport, and Bristol TN. Wood, vinyl, chain link, ornamental, and commercial fencing with 25+ years of experience. Get a free estimate today." />
        <link rel="canonical" href="https://mccall.lovable.app/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="McCall Commercial Fencing | Tri-Cities Fence Contractor Since 1997" />
        <meta property="og:description" content="Professional fence installation in Johnson City, Kingsport, and Bristol. Wood, vinyl, chain link, ornamental fencing with 25+ years experience. Free estimates." />
        <meta property="og:url" content="https://mccall.lovable.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mccall.lovable.app/og-home.jpg" />
        <meta property="og:image:width" content="1216" />
        <meta property="og:image:height" content="640" />
        <meta property="og:image:alt" content="McCall Commercial Fencing - Professional fence installation in the Tri-Cities" />
        <meta property="og:site_name" content="McCall Commercial Fencing" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="McCall Commercial Fencing | Tri-Cities Fence Contractor Since 1997" />
        <meta name="twitter:description" content="Professional fence installation in Johnson City, Kingsport, and Bristol. 25+ years experience. Free estimates." />
        <meta name="twitter:image" content="https://mccall.lovable.app/og-home.jpg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="keywords" content="fence contractor, fence installation, Tri-Cities fencing, Johnson City fence, Kingsport fence, Bristol fence, wood fence, vinyl fence, chain link fence, commercial fencing, residential fencing, Tennessee fence company" />
        <meta name="author" content="McCall Commercial Fencing" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroFence} 
            alt="Industrial fence around raceway track at sunset" 
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center pt-32 pb-36 md:pt-0 md:pb-40">
          <div className="container-wide w-full">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-3 py-1.5 bg-charcoal/60 text-white border border-gold rounded-full text-xs font-semibold mb-4 md:mb-6 backdrop-blur-sm shadow-lg">
                  Trusted Since 1997
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-4xl md:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg"
              >
                A Stronger Fence{" "}
                <span className="text-primary drop-shadow-md">Starts Here</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mb-6 md:mb-8 drop-shadow-md"
              >
                Crafted protection for homes, businesses, and the spaces that matter.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-12"
              >
                <button 
                  type="button"
                  onClick={() => {
                    const element = document.getElementById('fence-calculator');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 text-sm cursor-pointer"
                >
                  Online Estimate
                  <ArrowRight className="ml-2" size={16} aria-hidden="true" />
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const element = document.getElementById('fence-styles');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-charcoal hover:scale-105 text-sm cursor-pointer"
                >
                  Explore Fencing Styles
                </button>
              </motion.div>

              {/* Fence Style Selector */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-30"
              >
                <p className="text-xs md:text-sm text-white/70 mb-3 md:mb-4">Select a fence style to preview:</p>
                <FenceStyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated Fence Building */}
        <div className="absolute -bottom-[20px] md:-bottom-[40px] left-0 right-0 h-[150px] md:h-[350px] pointer-events-none overflow-hidden z-10">
          <div className="h-full relative w-full">
            {/* Posts */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`${selectedStyle}-post-${i}`}
                  className={`w-2 md:w-6 rounded-t-sm bg-gradient-to-b ${getPostColor()}`}
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                  style={{
                    boxShadow: "inset 2px 0 4px rgba(255,255,255,0.2), inset -2px 0 4px rgba(0,0,0,0.2), 2px 4px 8px rgba(0,0,0,0.15)"
                  }}
                />
              ))}
            </div>

            {/* Rails */}
            <motion.div
              key={`${selectedStyle}-rail-top`}
              className={`absolute bottom-[100px] md:bottom-[240px] left-0 right-0 h-2 md:h-4 rounded-sm bg-gradient-to-r ${getPostColor()}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
              style={{
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)"
              }}
            />
            <motion.div
              key={`${selectedStyle}-rail-bottom`}
              className={`absolute bottom-[20px] md:bottom-[40px] left-0 right-0 h-2 md:h-4 rounded-sm bg-gradient-to-r ${getPostColor()}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 1.7, ease: "easeOut" }}
              style={{
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)"
              }}
            />

            {/* Panels */}
            {/* Panels - Wood Slats or Other Styles */}
            {selectedStyle === "wood" ? renderWoodSlats() : renderOtherPanels()}
          </div>
        </div>
      </section>

      {/* Intro Block */}
      <section className="pt-40 md:pt-52 pb-20 lg:pb-32 bg-card">
        
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built with Intention. Crafted with Pride.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              For more than twenty-five years, McCall Commercial Fencing has built fences that last. 
              Our work protects homes, secures industrial sites, and supports stadiums and businesses 
              across the Tri-Cities. Every fence is built with intention, precision, and pride.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-8 md:py-12 bg-background border-y border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 justify-center md:justify-start"
            >
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground uppercase tracking-wide">6248 Kingsport Hwy</p>
                <p className="text-muted-foreground">Gray, Tennessee 37615</p>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 justify-center"
            >
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground uppercase tracking-wide">Monday-Friday: 9AM to 5PM</p>
                <p className="text-muted-foreground">Saturday / Sunday: Closed</p>
              </div>
            </motion.div>

            {/* Phone & Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 justify-center md:justify-end"
            >
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <a href="tel:+14234774882" className="font-display font-bold text-foreground uppercase tracking-wide hover:text-primary transition-colors block">
                  (423) 477-4882
                </a>
                <a href="mailto:info@mccallfencing.com" className="text-primary hover:underline">
                  email us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free Estimate Tool Section */}
      {SHOW_DRAW_YOUR_FENCE_SECTION && (
      <section id="estimate-tool" className="section-padding bg-charcoal relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-semibold mb-6">
                <Map size={16} />
                Free Online Tool
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-6">
                Draw Your Fence,{" "}
                <span className="text-primary">Get Your Estimate</span>
              </h2>
              <p className="text-lg text-cream/70 leading-relaxed mb-8">
                Use our interactive property mapping tool to draw exactly where you want your fence. 
                Get an instant cost estimate based on your property's dimensions and your chosen materials. 
                It's free, fast, and helps you plan your project with confidence.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Draw fence lines directly on your property map",
                  "Choose from multiple fence styles and materials",
                  "Get instant pricing estimates",
                  "Save and share your project plans"
                ].map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-cream/80"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <a
                href="https://fenceindustry.com/geodraw/geo_app.php?acc=19-b463097136ab-bb3100"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3"
              >
                Try the Free Estimate Tool
                <ExternalLink size={18} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Stylized map/drawing visualization */}
              <div className="relative bg-charcoal-light rounded-2xl border border-primary/20 p-8 shadow-2xl">
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5">
                  {/* Simulated map grid */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(hsl(var(--cream)/0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--cream)/0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }} />
                  
                  {/* Simulated property outline */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                    <motion.path
                      d="M 80 220 L 80 80 L 320 80 L 320 220 Z"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray="10 5"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                    {/* Corner markers */}
                    {[[80, 80], [320, 80], [320, 220], [80, 220]].map(([x, y], i) => (
                      <motion.circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="8"
                        fill="hsl(var(--primary))"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.2 }}
                        viewport={{ once: true }}
                      />
                    ))}
                  </svg>
                  
                  {/* House icon in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.5 }}
                      viewport={{ once: true }}
                      className="w-16 h-16 bg-cream/20 rounded-lg flex items-center justify-center"
                    >
                      <Home className="w-8 h-8 text-cream/60" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Estimate display */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cream/70 text-sm">Estimated Linear Feet:</span>
                    <span className="text-primary font-bold">480 ft</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From residential privacy to industrial security, we build fences for every need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                {...service}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fence Style Gallery */}
      <FenceGallery />

      {/* Interactive Fence Estimator */}
      <FenceEstimator />

      <FenceDivider variant="metal" />

      <WhyChooseUs />

      <ProjectGallery />

      <TrustedByMarquee />

      <CTASection buttonText="Contact Us Today" buttonLink="/contact" />

      <Footer />
    </>
  );
}