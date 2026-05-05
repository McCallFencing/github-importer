import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  delay?: number;
}

export default function ServiceCard({ title, description, icon: Icon, image, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="cursor-pointer"
    >
      <div className="service-card h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30">
        {/* Image */}
        {image && (
          <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              width={400}
              height={160}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            <div className="absolute bottom-3 left-4 w-10 h-10 rounded-lg bg-primary/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Icon size={20} className="text-primary-foreground" />
            </div>
          </div>
        )}

        {/* Fence Post Accent - only show if no image */}
        {!image && (
          <div className="absolute -top-3 left-8 flex items-end gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="fence-post w-2 transition-all duration-300"
                style={{ height: `${16 + i * 4}px` }}
              />
            ))}
          </div>
        )}

        <div className={`${image ? '' : 'mt-4'} h-full flex flex-col`}>
          {!image && (
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <Icon size={28} className="text-primary" />
            </div>
          )}

          <h3 className="font-display text-xl font-semibold mb-3 text-foreground transition-colors duration-300">
            {title}
          </h3>

          <p className="text-muted-foreground leading-relaxed flex-grow">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
