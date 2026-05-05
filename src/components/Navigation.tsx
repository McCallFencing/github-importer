import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/mccall-logo-white.png";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Residential", path: "/residential" },
  { name: "Commercial", path: "/commercial" },
  { name: "Gates", path: "/gates" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img 
            src={logo} 
            alt="McCall Commercial Fencing" 
            className={`h-10 md:h-12 w-auto transition-all duration-300 ${
              isScrolled ? "brightness-0" : ""
            }`}
            width={180}
            height={48}
            fetchPriority="high"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`relative font-medium transition-colors duration-300 ${
                  isScrolled 
                    ? location.pathname === item.path 
                      ? "text-primary" 
                      : "text-foreground/80 hover:text-primary"
                    : location.pathname === item.path 
                      ? "text-white" 
                      : "text-white/80 hover:text-white"
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 ${isScrolled ? "bg-primary" : "bg-white"}`} />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link 
          to="/#fence-calculator" 
          className={`hidden lg:block text-sm py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            isScrolled 
              ? "bg-primary text-primary-foreground hover:scale-105" 
              : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-charcoal"
          }`}
        >
          Online Estimate
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 transition-colors duration-300 ${isScrolled ? "text-charcoal" : "text-white"}`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-charcoal/95 backdrop-blur-md"
          >
            <ul className="container-wide pt-10 pb-6 flex flex-col gap-4">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`block py-2 text-lg font-bold ${
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-white hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                <Link to="/#fence-calculator" className="btn-primary w-full text-center mt-4 block">
                  Online Estimate
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
