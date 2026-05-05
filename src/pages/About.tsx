import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TrustedByMarquee from "@/components/TrustedByMarquee";

// Use existing project images for authentic feel
import heroImage from "@/assets/about/hero-about.jpg";
import projectBristol from "@/assets/commercial/project-bristol-speedway.jpg";
import projectCharlotte from "@/assets/commercial/project-charlotte-speedway.jpg";
import projectEastman from "@/assets/commercial/project-eastman-chemical.jpg";
import projectNuclear from "@/assets/commercial/project-nuclear-facility.jpg";

const beliefs = [
  {
    title: "Built to last",
    description: "We use quality materials and proven installation methods because fences should perform for years, not seasons."
  },
  {
    title: "Clear communication",
    description: "We believe in straightforward pricing, realistic timelines, and honest conversations."
  },
  {
    title: "Respect for the site",
    description: "Homes, businesses, and active facilities deserve clean, professional work."
  },
  {
    title: "Safety first",
    description: "From planning through installation, safety is part of how we operate."
  },
  {
    title: "Pride in the work",
    description: "Every fence reflects our name and our reputation."
  }
];

const stats = [
  { label: "Decades of experience", value: "2+" },
  { label: "Projects completed", value: "100k+" },
  { label: "Regional capability", value: "Commercial" }
];

const clients = [
  { name: "Bristol Motor Speedway", image: projectBristol },
  { name: "Charlotte Motor Speedway", image: projectCharlotte },
  { name: "Eastman Chemical", image: projectEastman },
  { name: "Nuclear Fuel Services", image: projectNuclear }
];

// Schema markup
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://mccall.lovable.app/#organization",
  "name": "McCall Commercial Fencing",
  "url": "https://mccall.lovable.app",
  "logo": "https://mccall.lovable.app/mccall-logo.png",
  "foundingDate": "1997",
  "description": "Commercial and residential fencing contractor serving the Tri-Cities region since 1997. Trusted by Bristol Motor Speedway, Eastman Chemical, and thousands of homeowners.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6248 Kingsport Hwy",
    "addressLocality": "Gray",
    "addressRegion": "TN",
    "postalCode": "37615",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-423-477-4882",
    "contactType": "customer service",
    "email": "info@mccallfencing.com"
  },
  "sameAs": []
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "McCall Commercial Fencing",
  "description": "Commercial and residential fencing contractor serving the Tri-Cities region since 1997.",
  "url": "https://mccall.lovable.app/about",
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
  "areaServed": [
    { "@type": "City", "name": "Johnson City", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Kingsport", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Bristol", "containedInPlace": { "@type": "State", "name": "Tennessee" } },
    { "@type": "City", "name": "Bristol", "containedInPlace": { "@type": "State", "name": "Virginia" } }
  ],
  "priceRange": "$$-$$$"
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mccall.lovable.app" },
    { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://mccall.lovable.app/about" }
  ]
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About McCall Commercial Fencing",
  "description": "Learn about McCall Commercial Fencing, serving the Tri-Cities with quality residential and commercial fencing since 1997.",
  "url": "https://mccall.lovable.app/about",
  "mainEntity": { "@id": "https://mccall.lovable.app/#organization" }
};

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About McCall Fencing | Trusted Tri-Cities Fence Contractor Since 1997</title>
        <meta name="description" content="Learn about McCall Commercial Fencing. 25+ years serving Johnson City, Kingsport, and Bristol. Trusted by Bristol Motor Speedway, Eastman Chemical & homeowners." />
        <link rel="canonical" href="https://mccall.lovable.app/about" />
        
        <meta property="og:title" content="About McCall Fencing | Trusted Since 1997" />
        <meta property="og:description" content="25+ years of quality fence installation in the Tri-Cities. Bristol Motor Speedway, Eastman Chemical & thousands of homes." />
        <meta property="og:url" content="https://mccall.lovable.app/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mccall.lovable.app/og-about.jpg" />
        <meta property="og:image:width" content="1216" />
        <meta property="og:image:height" content="640" />
        <meta property="og:site_name" content="McCall Commercial Fencing" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About McCall Fencing | Trusted Since 1997" />
        <meta name="twitter:image" content="https://mccall.lovable.app/og-about.jpg" />
        
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(aboutPageSchema)}</script>
      </Helmet>

      <Navigation />

      {/* Hero Section - Matching other pages, no fence animation */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Large scale commercial fence installation at industrial facility" 
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
                  About Us
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-4xl md:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg"
              >
                Built on experience.{" "}
                <span className="text-primary drop-shadow-md">Trusted for decades.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl text-white/90 leading-relaxed mb-6 md:mb-8 drop-shadow-md"
              >
                Since 1997, McCall Commercial Fencing has helped protect homes, businesses, 
                and facilities across the Tri Cities and beyond.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6"
              >
                <Link to="/contact" className="btn-primary text-sm md:text-base">
                  Contact our team
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-sm text-white/70">
                  Residential and commercial fencing • Trusted since 1997
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <TrustedByMarquee />

      {/* Our Story Section - Light */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              Our story
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-3xl">
              <p>
                McCall Commercial Fencing was incorporated in 2004 with a simple goal: build fences 
                that last, stand behind our work, and treat people the right way. Those principles 
                continue to guide everything we do today.
              </p>
              <p>
                What began as a local fencing company has grown into one of the region's most 
                trusted commercial and residential fencing contractors. As our projects have 
                expanded in size and complexity, our standards have remained unchanged—quality 
                craftsmanship, honest communication, and pride in a job done right.
              </p>
              <p>
                At the heart of McCall Commercial Fencing is owner Larry McCall, who brings more 
                than 40 years of hands-on fencing experience to every project. Larry is still 
                actively involved in the field, often working alongside his crews—with his loyal 
                dog Rosie by his side—training the next generation, sharing hard-earned knowledge, 
                and continuing to learn as the industry evolves.
              </p>
              <p>
                From backyard fences to high-security industrial installations, every project is 
                approached with care, experience, and attention to detail. We don't cut corners, 
                and we don't walk away from a job until it meets our standards. Our reputation 
                has been built one project at a time, and we're proud to stand behind our work—today 
                and for years to come.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Subtle fence divider */}
        <div className="container-wide mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </section>

      {/* What We Believe In - Dark, Restrained */}
      <section className="py-20 lg:py-28 bg-charcoal">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream">
              What we believe in
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {beliefs.map((belief, index) => (
              <motion.div
                key={belief.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <h3 className="font-display text-xl font-semibold text-cream mb-3">
                  {belief.title}
                </h3>
                <p className="text-cream/70 leading-relaxed">
                  {belief.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience That Scales - Light */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              Experience that scales
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-16">
              <p>
                McCall's experience spans residential neighborhoods, industrial facilities, 
                municipal properties, and high visibility venues. Our crews understand how 
                to work efficiently on active sites, coordinate with other teams, and meet 
                the expectations of large scale projects.
              </p>
              <p>
                Whether the job is big or small, the same standards apply.
              </p>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-border"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Notable Projects - Dark */}
      <section className="py-20 lg:py-28 bg-navy">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
              Trusted by leading organizations
            </h2>
            <p className="text-lg text-cream/70 max-w-2xl">
              Over the years, McCall has completed fencing projects for major facilities 
              and organizations across the region.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3]">
                  <img
                    src={client.image}
                    alt={`${client.name} fencing project`}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display font-semibold text-cream text-lg">
                    {client.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-sm text-cream/50 mt-8"
          >
            Project examples shown. Additional clients include municipal and school systems.
          </motion.p>
        </div>
      </section>


      {/* Local Roots - Light */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              Local roots. Regional reach.
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                McCall Commercial Fencing is proudly based in the Tri Cities, serving 
                Johnson City, Kingsport, Bristol, and surrounding communities in Northeast Tennessee. 
                Our regional reach allows us to support larger commercial projects while staying 
                connected to the local homeowners and businesses we serve every day.
              </p>
              <p>
                This balance is what sets us apart.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Subtle fence divider */}
        <div className="container-wide mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </section>

      {/* Team Approach - Light */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              A team built for the work
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Our success comes from experienced crews, reliable partners, and a hands-on 
                approach to every project. We invest in training, equipment, and safety so 
                our team can deliver consistent results in the field.
              </p>
              <p>
                You will work with people who know the job, respect the site, and care 
                about the outcome.
              </p>
            </div>

            <p className="text-muted-foreground/70 mt-8 text-base">
              Leadership, project managers, and crews working together from start to finish.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Dark, Calm */}
      <section className="py-20 lg:py-28 bg-charcoal">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
              Ready to work with a team you can trust?
            </h2>
            <p className="text-lg text-cream/70 mb-10 max-w-2xl mx-auto">
              Whether you are planning a residential fence, a commercial project, or a 
              secure access system, we are ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Contact our team
                <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link
                to="/commercial"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-cream/30 text-cream font-semibold rounded-lg transition-all duration-300 hover:bg-cream/10"
              >
                Explore commercial fencing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}