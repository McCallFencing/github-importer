import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface AnimatedFenceProps {
  style?: "wood" | "vinyl" | "chainlink" | "ornamental";
  className?: string;
}

export default function AnimatedFence({ style = "wood", className = "" }: AnimatedFenceProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const postHeight = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const railWidth = useTransform(scrollYProgress, [0.2, 0.5], [0, 100]);
  const panelOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  const getPostStyle = () => {
    switch (style) {
      case "vinyl":
        return "bg-gradient-to-b from-cream to-muted";
      case "chainlink":
        return "bg-gradient-to-b from-metal-light to-metal";
      case "ornamental":
        return "bg-gradient-to-b from-charcoal to-foreground";
      default:
        return "bg-gradient-to-b from-wood to-wood-dark";
    }
  };

  const getPanelStyle = () => {
    switch (style) {
      case "vinyl":
        return "bg-cream border border-muted";
      case "chainlink":
        return "chain-link-bg";
      case "ornamental":
        return "bg-gradient-to-b from-charcoal/80 to-charcoal";
      default:
        return "bg-gradient-to-b from-wood to-wood-dark wood-texture";
    }
  };

  const posts = 7;

  return (
    <div ref={ref} className={`relative h-[300px] ${className}`}>
      {/* Posts */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
        {[...Array(posts)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-4 md:w-6 rounded-t-sm ${getPostStyle()}`}
            style={{ 
              height: postHeight,
              boxShadow: "inset 2px 0 4px rgba(255,255,255,0.2), inset -2px 0 4px rgba(0,0,0,0.2), 2px 4px 8px rgba(0,0,0,0.15)"
            }}
            initial={{ height: 0 }}
          />
        ))}
      </div>

      {/* Top Rail */}
      <motion.div
        className={`absolute bottom-[180px] left-8 right-8 h-4 rounded-sm ${getPostStyle()}`}
        style={{ 
          scaleX: useTransform(railWidth, [0, 100], [0, 1]),
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)"
        }}
        initial={{ scaleX: 0 }}
      />

      {/* Bottom Rail */}
      <motion.div
        className={`absolute bottom-[40px] left-8 right-8 h-4 rounded-sm ${getPostStyle()}`}
        style={{ 
          scaleX: useTransform(railWidth, [0, 100], [0, 1]),
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)"
        }}
        initial={{ scaleX: 0 }}
      />

      {/* Panels */}
      <div className="absolute bottom-[40px] left-8 right-8 flex">
        {[...Array(posts - 1)].map((_, i) => (
          <motion.div
            key={i}
            className={`flex-1 h-[140px] rounded-sm ${getPanelStyle()}`}
            style={{ opacity: panelOpacity }}
            initial={{ opacity: 0 }}
          />
        ))}
      </div>

      {/* Ornamental details */}
      {style === "ornamental" && (
        <div className="absolute bottom-[100px] left-8 right-8 flex justify-around">
          {[...Array(posts - 1)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-20 bg-gradient-to-b from-charcoal to-foreground rounded-full"
              style={{ opacity: panelOpacity }}
              initial={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}