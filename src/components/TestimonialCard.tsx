import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  variant?: "wood" | "metal";
  delay?: number;
}

export default function TestimonialCard({ 
  quote, 
  author, 
  role, 
  variant = "wood",
  delay = 0 
}: TestimonialCardProps) {
  const bgStyle = variant === "wood" 
    ? "bg-gradient-to-br from-wood/20 to-wood-dark/10 border-wood/30"
    : "bg-gradient-to-br from-metal/20 to-metal-light/10 border-metal/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-2xl border ${bgStyle}`}
    >
      {/* Fence Post Decoration */}
      <div className="absolute -top-4 right-8 flex items-end gap-1">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className={variant === "wood" ? "fence-post w-2" : "fence-post-metal w-2"}
            style={{ height: `${14 + i * 4}px` }}
          />
        ))}
      </div>

      <Quote className="text-primary/30 w-10 h-10 mb-4" />
      
      <blockquote className="text-foreground/90 text-lg leading-relaxed mb-6">
        "{quote}"
      </blockquote>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="font-display text-lg font-semibold text-primary">
            {author.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}