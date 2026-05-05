import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lastHash = useRef("");

  useEffect(() => {
    if (hash) {
      // Track hash to handle repeated navigation to same hash
      const hashKey = `${pathname}${hash}`;
      
      // Function to scroll to element with retries
      const scrollToHash = (attempts = 0) => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          // Use setTimeout to ensure DOM is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
          lastHash.current = hashKey;
        } else if (attempts < 10) {
          // Retry if element not found (might still be rendering)
          setTimeout(() => scrollToHash(attempts + 1), 100);
        }
      };
      
      scrollToHash();
    } else {
      // Instant scroll to top on page navigation
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      lastHash.current = "";
    }
  }, [pathname, hash]);

  return null;
}
