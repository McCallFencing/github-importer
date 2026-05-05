import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "primary" | "wood" | "dark";
}

export default function CTASection({
  title = "Your fence should stand strong for years.",
  subtitle = "We build it that way.",
  buttonText = "Get a Free Quote",
  buttonLink = "tel:+14234774882",
  variant = "primary"
}: CTASectionProps) {
  const bgStyles = {
    primary: "bg-primary text-primary-foreground",
    wood: "bg-gradient-to-br from-wood to-wood-dark text-cream",
    dark: "bg-charcoal text-cream"
  };

  return (
    <section className={`section-padding ${bgStyles[variant]} relative overflow-hidden`}>

      <div className="container-narrow relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl font-bold mb-4"
        >
          {title}
        </motion.h2>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl opacity-90 mb-8"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <a
            href={buttonLink}
            className={`inline-flex items-center gap-3 px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              variant === "primary"
                ? "bg-cream text-primary hover:bg-card"
                : "bg-primary text-primary-foreground hover:bg-forest"
            }`}
          >
            {buttonText}
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}