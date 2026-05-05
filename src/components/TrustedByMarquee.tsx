import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Partner logos
import kingsportLogo from "@/assets/partners/kingsport.webp";
import bristolLogo from "@/assets/partners/bristol.png";
import etsuLogo from "@/assets/partners/etsu.svg";
import tennesseeLogo from "@/assets/partners/tennessee.png";
import eastmanLogo from "@/assets/partners/eastman.png";
import hardrockLogo from "@/assets/partners/hardrock.png";
import dollywoodLogo from "@/assets/partners/dollywood.webp";
import nascarLogo from "@/assets/partners/nascar.png";
import kentuckySpeedwayLogo from "@/assets/partners/kentucky-speedway.png";
import atlantaSpeedwayLogo from "@/assets/partners/atlanta-speedway.png";
import charlotteSpeedwayLogo from "@/assets/partners/charlotte-speedway.png";
import bristolSpeedwayLogo from "@/assets/partners/bristol-speedway.png";

const partners = [
  { name: "Bristol Motor Speedway", logo: bristolSpeedwayLogo },
  { name: "Eastman Chemical", logo: eastmanLogo },
  { name: "University of Tennessee", logo: tennesseeLogo },
  { name: "NASCAR", logo: nascarLogo },
  { name: "City of Kingsport", logo: kingsportLogo },
  { name: "Charlotte Motor Speedway", logo: charlotteSpeedwayLogo },
  { name: "Hard Rock Cafe", logo: hardrockLogo },
  { name: "East Tennessee State University", logo: etsuLogo },
  { name: "Kentucky Speedway", logo: kentuckySpeedwayLogo },
  { name: "Dollywood", logo: dollywoodLogo },
  { name: "Atlanta Motor Speedway", logo: atlantaSpeedwayLogo },
  { name: "City of Bristol", logo: bristolLogo },
];

export default function TrustedByMarquee() {
  const isMobile = useIsMobile();

  // Faster on mobile (6s) vs desktop (25s)
  const animationDuration = isMobile ? 6 : 25;

  return (
    <section className="py-16 lg:py-20 bg-charcoal overflow-hidden">
      <div className="container-wide mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-cream mb-2">
            Trusted By
          </h2>
          <p className="text-cream/60 text-base">
            Leading organizations across the region
          </p>
        </motion.div>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling track */}
        <div className="flex overflow-hidden">
          <div 
            className="flex items-center gap-16 md:gap-24 animate-marquee"
            style={{ 
              animationDuration: `${animationDuration}s`,
            }}
          >
            {partners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 px-4"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-[140px] md:max-w-[180px] w-auto object-contain"
                  width={180}
                  height={80}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div 
            className="flex items-center gap-16 md:gap-24 animate-marquee"
            style={{ 
              animationDuration: `${animationDuration}s`,
            }}
          >
            {partners.map((partner, index) => (
              <div
                key={`${partner.name}-duplicate-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 px-4"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-[140px] md:max-w-[180px] w-auto object-contain"
                  width={180}
                  height={80}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
