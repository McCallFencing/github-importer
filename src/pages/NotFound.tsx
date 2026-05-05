import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-xl text-center px-6">
        <div className="flex items-end justify-center gap-2 mb-12">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="fence-post w-6"
              style={{ 
                height: i === 2 ? "60px" : "120px",
                transform: i === 2 ? "rotate(15deg)" : "none"
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
        <h1 className="font-display text-6xl md:text-8xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Looks like this fence section is missing.</p>
        <Link to="/" className="btn-primary">
          <Home className="mr-2" size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;