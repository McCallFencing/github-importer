import { motion } from "framer-motion";

interface FenceDividerProps {
  variant?: "wood" | "metal" | "chain";
  className?: string;
  animated?: boolean;
}

export default function FenceDivider({ 
  variant = "wood", 
  className = "",
  animated = true 
}: FenceDividerProps) {
  const posts = 11;
  
  const postStyle = variant === "metal" 
    ? "fence-post-metal w-3" 
    : "fence-post w-4";
  
  const railStyle = variant === "metal"
    ? "fence-rail-metal"
    : "fence-rail";

  return (
    <div className={`fence-section-divider ${className}`}>
      {/* Top Rail */}
      <div className="absolute top-6 left-0 right-0 px-4">
        <motion.div 
          className={`${railStyle} w-full`}
          initial={animated ? { scaleX: 0 } : undefined}
          whileInView={animated ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>

      {/* Posts */}
      <div className="flex items-end justify-between w-full px-4">
        {[...Array(posts)].map((_, i) => (
          <motion.div
            key={i}
            className={postStyle}
            style={{ height: variant === "metal" ? "60px" : "70px" }}
            initial={animated ? { scaleY: 0, opacity: 0 } : undefined}
            whileInView={animated ? { scaleY: 1, opacity: 1 } : undefined}
            transition={{ 
              duration: 0.5, 
              delay: i * 0.05,
              ease: "easeOut" 
            }}
            viewport={{ once: true }}
          />
        ))}
      </div>

      {/* Bottom Rail */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <motion.div 
          className={`${railStyle} w-full`}
          initial={animated ? { scaleX: 0 } : undefined}
          whileInView={animated ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>

      {/* Chain Link Overlay for chain variant */}
      {variant === "chain" && (
        <div className="absolute inset-0 chain-link-bg opacity-50" />
      )}
    </div>
  );
}