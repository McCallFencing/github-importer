import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Wood fence images
import wood1 from "@/assets/gallery/wood-1.jpg";
import wood2 from "@/assets/gallery/wood-2.jpg";
import wood3 from "@/assets/gallery/wood-3.jpg";
import wood4 from "@/assets/gallery/wood-4.jpg";
import wood5 from "@/assets/gallery/wood-5.jpg";
import wood6 from "@/assets/gallery/wood-6.jpg";
import wood7 from "@/assets/gallery/wood-7.jpg";
import wood8 from "@/assets/gallery/wood-8.jpg";
import wood9 from "@/assets/gallery/wood-9.jpg";

// PVC fence images
import pvc1 from "@/assets/gallery/pvc-1.jpg";
import pvc2 from "@/assets/gallery/pvc-2.jpg";
import pvc3 from "@/assets/gallery/pvc-3.jpg";
import pvc4 from "@/assets/gallery/pvc-4.jpg";
import pvc5 from "@/assets/gallery/pvc-5.jpg";
import pvc6 from "@/assets/gallery/pvc-6.jpg";
import pvc7 from "@/assets/gallery/pvc-7.jpg";
import pvc8 from "@/assets/gallery/pvc-8.jpg";

// Chain link fence images
import chain1 from "@/assets/gallery/chain-1.jpg";
import chain2 from "@/assets/gallery/chain-2.jpg";
import chain3 from "@/assets/gallery/chain-3.jpg";
import chain4 from "@/assets/gallery/chain-4.jpg";
import chain5 from "@/assets/gallery/chain-5.jpg";
import chain6 from "@/assets/gallery/chain-6.jpg";

// Pool fence images
import pool1 from "@/assets/gallery/pool-1.jpg";
import pool2 from "@/assets/gallery/pool-2.jpg";
import pool3 from "@/assets/gallery/pool-3.jpg";
import pool4 from "@/assets/gallery/pool-4.jpg";
import pool5 from "@/assets/gallery/pool-5.jpg";
import pool6 from "@/assets/gallery/pool-6.jpg";

type FenceCategory = "wood" | "pvc" | "chainlink" | "pool";

interface GalleryImage {
  src: string;
  alt: string;
}

const galleryData: Record<FenceCategory, GalleryImage[]> = {
  wood: [
    { src: wood1, alt: "Crossbuck wood ranch fence" },
    { src: wood2, alt: "Cedar privacy fence with arched gate" },
    { src: wood3, alt: "Dark gray painted wood fence with gate" },
    { src: wood4, alt: "Wood privacy fence around backyard patio" },
    { src: wood5, alt: "Natural wood privacy fence with landscaping" },
    { src: wood6, alt: "Classic wood picket fence" },
    { src: wood7, alt: "Board-on-board wood privacy fence" },
    { src: wood8, alt: "White wood picket fence with flowers" },
    { src: wood9, alt: "Shadow box wood fence design" },
  ],
  pvc: [
    { src: pvc1, alt: "White vinyl privacy fence with lattice top" },
    { src: pvc2, alt: "White vinyl privacy fence with landscaping" },
    { src: pvc3, alt: "White vinyl fence with gate and lattice accent" },
    { src: pvc4, alt: "White vinyl picket fence with garden" },
    { src: pvc5, alt: "White vinyl picket fence at cottage home" },
    { src: pvc6, alt: "White vinyl fence around pool area" },
    { src: pvc7, alt: "White vinyl picket fence with ornamental posts" },
    { src: pvc8, alt: "White vinyl privacy fence panels" },
  ],
  chainlink: [
    { src: chain1, alt: "Chain link fence at construction site" },
    { src: chain2, alt: "Close-up of galvanized chain link pattern" },
    { src: chain3, alt: "Commercial chain link fence at stadium" },
    { src: chain4, alt: "Chain link fence at sunset" },
    { src: chain5, alt: "Chain link fence at baseball field" },
    { src: chain6, alt: "Black chain link fence with brick columns" },
  ],
  pool: [
    { src: pool1, alt: "Black aluminum pool fence with landscaping" },
    { src: pool2, alt: "Ornamental iron pool fence" },
    { src: pool3, alt: "Decorative pool fence with brick patio" },
    { src: pool4, alt: "Pool fence around custom pool with waterfall" },
    { src: pool5, alt: "White vinyl pool fence with deck" },
    { src: pool6, alt: "White pool fence around above-ground pool" },
  ],
};

const categories: { id: FenceCategory; label: string }[] = [
  { id: "wood", label: "Wood" },
  { id: "pvc", label: "PVC / Vinyl" },
  { id: "chainlink", label: "Chain Link" },
  { id: "pool", label: "Pool Fencing" },
];

export default function FenceGallery() {
  const [activeCategory, setActiveCategory] = useState<FenceCategory>("wood");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const currentImages = galleryData[activeCategory];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="fence-styles" className="py-24 lg:py-32 bg-background">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Style Gallery
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Our Fence Styles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse through our collection of fence styles to find the perfect match for your property.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {currentImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-muted cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={currentImages[lightboxIndex].src}
              alt={currentImages[lightboxIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {currentImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
