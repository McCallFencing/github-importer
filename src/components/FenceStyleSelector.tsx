import { motion } from "framer-motion";

interface FenceStyleSelectorProps {
  selected: "wood" | "vinyl" | "chainlink";
  onSelect: (style: "wood" | "vinyl" | "chainlink") => void;
}

const styles = [
  { id: "chainlink" as const, name: "Chain Link", color: "from-metal-light to-metal" },
  { id: "wood" as const, name: "Wood", color: "from-wood to-wood-dark" },
  { id: "vinyl" as const, name: "Vinyl", color: "from-cream to-muted" },
];

export default function FenceStyleSelector({ selected, onSelect }: FenceStyleSelectorProps) {
  return (
    <div className="flex flex-wrap justify-start gap-2 md:gap-4">
      {styles.map((style) => (
        <motion.button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`relative px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${
            selected === style.id
              ? "bg-white/20 backdrop-blur-sm shadow-lg text-white"
              : "bg-white/5 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/10"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-2 md:gap-3">
            {/* Mini fence preview */}
            <span className="flex items-end gap-0.5">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 md:w-1.5 bg-gradient-to-b ${style.color} rounded-t-sm`}
                  style={{ height: `${8 + i * 2}px` }}
                />
              ))}
            </span>
            {style.name}
          </span>
          {selected === style.id && (
            <motion.span
              layoutId="selector-bg"
              className="absolute inset-0 border-2 border-white rounded-lg md:rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}