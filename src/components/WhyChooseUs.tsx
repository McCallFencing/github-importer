import { motion } from "framer-motion";
import { Shield, Award, Users, Clock, Star } from "lucide-react";

const serviceAreas = [
  "Pigeon Forge, TN",
  "Sevierville, TN",
  "Farragut, TN",
  "Kingston, TN",
  "Knoxville, TN",
  "Maryville, TN",
  "Oak Ridge, TN",
  "Rogersville, TN",
  "Loudon, TN",
  "New Tazewell, TN",
  "Tellico Plains, TN",
  "Greeneville, TN",
  "Elizabethton, TN",
  "Cleveland, TN",
  "Chattanooga, TN",
  "Mountain City, TN",
  "Gatlinburg, TN",
  "Bluff City, TN",
  "Blountville, TN",
  "Piney Flats, TN",
  "Colonial Heights, TN",
  "Gate City, VA",
  "Bristol, TN",
  "Abingdon, VA",
  "Tri Cities, TN",
  "Bristol, VA",
  "Johnson City, TN",
  "Kingsport, TN",
  "Charlotte, NC",
];

const reasons = [
  { icon: Shield, title: "Experience you can trust", description: "25+ years building fences that last" },
  { icon: Award, title: "Commercial grade materials", description: "Professional quality for every project" },
  { icon: Users, title: "Large scale capabilities", description: "From backyards to stadiums" },
  { icon: Clock, title: "Local care", description: "Honest communication always" },
];

const reviews = [
  {
    quote: "I highly recommend McCall fencing. They did a great job and it didn't take but maybe two days for them to install 400ft of fence.",
    author: "Matt E",
    rating: 5,
  },
  {
    quote: "Excellent job with our fence at a good price. Built 3 years ago and looks like it did when they built it.",
    author: "C T",
    rating: 5,
  },
  {
    quote: "Very professional company. Easy to work with. Quality service and results.",
    author: "Sarah Nichole Brown",
    rating: 5,
  },
  {
    quote: "Been going for 25 years wouldn't go anywhere else. Best and most honest staff.",
    author: "Caleb Mayo",
    rating: 5,
  },
  {
    quote: "Professionalism in everything they do from start to finish.",
    author: "Marty Watts",
    rating: 5,
  },
  {
    quote: "Great guys who do the work right!",
    author: "Harry Reed",
    rating: 5,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose McCall
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built on experience, delivered with pride
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <reason.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 md:p-12 border border-border"
        >
          {/* Rating Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-4xl font-bold text-foreground">4.5</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/50 text-yellow-400/50"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">Google Reviews</p>
              </div>
            </div>
            <a
              href="https://www.google.com/search?q=McCall+Commercial+Fencing+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              See all reviews →
            </a>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  "{review.quote}"
                </p>
                <p className="text-muted-foreground text-sm font-medium">
                  — {review.author}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
      
      {/* Service Areas Marquee - Full Width */}
      <div className="mt-12 pt-10 border-t border-border overflow-hidden w-full">
        <p className="text-center text-muted-foreground text-sm uppercase tracking-wider mb-6">
          Proudly Serving
        </p>
        <div className="relative">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: "-50%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
            style={{ willChange: "transform" }}
          >
            {[...serviceAreas, ...serviceAreas].map((area, index) => (
              <span
                key={`${area}-${index}`}
                className="font-display text-lg md:text-xl font-semibold text-foreground mx-2"
              >
                {area}
                <span className="text-primary mx-4">•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
