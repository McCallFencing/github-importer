import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import bristolSpeedway from "@/assets/projects/bristol-speedway.jpg";
import mountainResidence from "@/assets/projects/mountain-residence.jpg";
import eastmanChemical from "@/assets/projects/eastman-chemical.jpg";
import communityPool from "@/assets/projects/community-pool.jpg";
import sportsComplex from "@/assets/projects/sports-complex.jpg";
import airportSecurity from "@/assets/projects/airport-security.jpg";
import lakefrontEstate from "@/assets/projects/lakefront-estate.jpg";
import distributionCenter from "@/assets/projects/distribution-center.jpg";
import vineyardEstate from "@/assets/projects/vineyard-estate.jpg";

interface Project {
  title: string;
  category: string;
  location: string;
  image: string;
  span: string;
}

const projects: Project[] = [
  { 
    title: "Bristol Motor Speedway", 
    category: "Commercial Security", 
    location: "Bristol, TN",
    image: bristolSpeedway,
    span: "md:col-span-2 md:row-span-2"
  },
  { 
    title: "Mountain View Residence", 
    category: "Wood Privacy", 
    location: "Johnson City, TN",
    image: mountainResidence,
    span: "md:row-span-2"
  },
  { 
    title: "Eastman Chemical", 
    category: "Industrial Chain Link", 
    location: "Kingsport, TN",
    image: eastmanChemical,
    span: "md:row-span-2"
  },
  { 
    title: "Heritage Community Pool", 
    category: "Safety Fencing", 
    location: "Bristol, VA",
    image: communityPool,
    span: ""
  },
  { 
    title: "Sports Complex", 
    category: "Athletic Perimeter", 
    location: "Johnson City, TN",
    image: sportsComplex,
    span: ""
  },
  { 
    title: "Tri-Cities Airport", 
    category: "Security Perimeter", 
    location: "Blountville, TN",
    image: airportSecurity,
    span: "md:col-span-2"
  },
  { 
    title: "Lakefront Estate", 
    category: "Ornamental Iron", 
    location: "Boone Lake, TN",
    image: lakefrontEstate,
    span: ""
  },
  { 
    title: "Distribution Center", 
    category: "High Security", 
    location: "Gray, TN",
    image: distributionCenter,
    span: ""
  },
  { 
    title: "Highland Vineyard Estate", 
    category: "Ornamental Iron", 
    location: "Jonesborough, TN",
    image: vineyardEstate,
    span: "md:col-span-2"
  },
];

export default function ProjectGallery() {
  return (
    <section className="py-24 lg:py-32 bg-charcoal relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255,255,255,0.03) 100px, rgba(255,255,255,0.03) 101px)`
        }} />
      </div>

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 text-gold rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Our Portfolio
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-white/50 text-lg">
              From backyard privacy to stadium security, every project showcases our commitment to excellence.
            </p>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-2xl ${project.span}`}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={`${project.title} - ${project.category} fence by McCall Commercial Fencing in ${project.location}`}
                className="absolute inset-0 w-full h-full object-cover"
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-gold text-charcoal text-xs font-bold uppercase tracking-wider rounded-md">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="flex items-center gap-1.5 text-white/60 text-sm">
                  <MapPin size={14} />
                  {project.location}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { value: "500+", label: "Projects Completed" },
            { value: "25+", label: "Years Experience" },
            { value: "50M+", label: "Feet Installed" },
            { value: "100%", label: "Client Satisfaction" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-gold mb-2">
                {stat.value}
              </div>
              <div className="text-white/40 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
