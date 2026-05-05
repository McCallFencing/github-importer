import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";
import logoLight from "@/assets/mccall-logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-charcoal text-cream">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column - takes more space */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center mb-6">
              <img 
                src={logoLight} 
                alt="McCall Commercial Fencing" 
                className="h-16 md:h-20 w-auto"
                width={180}
                height={80}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-cream/70 leading-relaxed mb-6">
              Building strong fences and lasting relationships since 1997. Commercial grade quality for every project.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, label: "Visit our Facebook page" },
                { Icon: Linkedin, label: "Visit our LinkedIn page" },
                { Icon: Instagram, label: "Visit our Instagram page" }
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                  aria-label={label}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Services - centered */}
          <div className="md:col-span-3">
            <h4 className="font-display text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="/residential" className="text-cream/70 hover:text-primary transition-colors">Residential Fencing</a></li>
              <li><a href="/commercial" className="text-cream/70 hover:text-primary transition-colors">Commercial Fencing</a></li>
              <li><a href="/gates" className="text-cream/70 hover:text-primary transition-colors">Gate Operators</a></li>
              <li><a href="/about" className="text-cream/70 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-cream/70 hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>


          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="font-display text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+14234774882"
                  className="flex items-center gap-3 text-cream/70 hover:text-primary transition-colors duration-300"
                >
                  <Phone size={18} />
                  (423) 477-4882
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@mccallfencing.com"
                  className="flex items-center gap-3 text-cream/70 hover:text-primary transition-colors duration-300"
                >
                  <Mail size={18} />
                  info@mccallfencing.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-cream/70">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>
                  6248 Kingsport Hwy<br />
                  Gray, Tennessee 37615
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/50 text-sm">
            © {new Date().getFullYear()} McCall Commercial Fencing. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-cream/50 hover:text-cream transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-cream/50 hover:text-cream transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
