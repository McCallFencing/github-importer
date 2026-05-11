import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Ruler, RotateCcw, Sparkles, Link, TreePine, Fence, Phone, Minus, Plus, Mail, ArrowLeft, ArrowRight, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type FenceType = "galvanized-chainlink" | "black-chainlink" | "privacy-pine" | "privacy-cedar" | "picket-pine" | "aluminum-ornamental" | "pvc-privacy";
type CalculatorMode = "install" | "diy";

interface FenceOption {
  id: FenceType;
  name: string;
  description: string;
  heights: number[];
  pricePerFoot: Record<number, number>;
  singleGatePrice: number;
  doubleGatePrice: number;
  color: string;
  icon: React.ReactNode;
}

const fenceOptions: FenceOption[] = [
  {
    id: "galvanized-chainlink",
    name: "Galvanized Chain Link",
    description: "Standard silver galvanized finish",
    heights: [4, 5, 6],
    pricePerFoot: { 4: 19, 5: 20, 6: 21.5 },
    singleGatePrice: 300,
    doubleGatePrice: 700,
    color: "from-zinc-300 to-zinc-400",
    icon: <Link size={24} className="text-zinc-600" />
  },
  {
    id: "black-chainlink",
    name: "Black Chain Link",
    description: "Vinyl-coated black finish",
    heights: [4, 5, 6],
    pricePerFoot: { 4: 21, 5: 22, 6: 23.75 },
    singleGatePrice: 400,
    doubleGatePrice: 800,
    color: "from-zinc-700 to-zinc-900",
    icon: <Link size={24} className="text-zinc-100" />
  },
  {
    id: "privacy-pine",
    name: "Privacy - Pressure Treated Pine",
    description: "72\" privacy fence",
    heights: [6],
    pricePerFoot: { 6: 37.5 },
    singleGatePrice: 500,
    doubleGatePrice: 1000,
    color: "from-amber-600 to-amber-800",
    icon: <Fence size={24} className="text-amber-100" />
  },
  {
    id: "privacy-cedar",
    name: "Privacy - Prestained Cedar",
    description: "72\" premium privacy fence",
    heights: [6],
    pricePerFoot: { 6: 45 },
    singleGatePrice: 625,
    doubleGatePrice: 1250,
    color: "from-orange-700 to-red-900",
    icon: <TreePine size={24} className="text-orange-100" />
  },
  {
    id: "picket-pine",
    name: "Picket - Pressure Treated Pine",
    description: "48\" decorative picket fence",
    heights: [4],
    pricePerFoot: { 4: 30 },
    singleGatePrice: 425,
    doubleGatePrice: 850,
    color: "from-yellow-600 to-yellow-800",
    icon: <Fence size={24} className="text-yellow-100" />
  },
  {
    id: "aluminum-ornamental",
    name: "Black Flat Top Aluminum",
    description: "48\" ornamental fence",
    heights: [4],
    pricePerFoot: { 4: 43 },
    singleGatePrice: 400,
    doubleGatePrice: 800,
    color: "from-gray-800 to-gray-950",
    icon: <Link size={24} className="text-gray-300" />
  },
  {
    id: "pvc-privacy",
    name: "Privacy - White PVC",
    description: "72\" vinyl privacy fence",
    heights: [6],
    pricePerFoot: { 6: 42 },
    singleGatePrice: 400,
    doubleGatePrice: 800,
    color: "from-gray-100 to-white",
    icon: <Fence size={24} className="text-gray-500" />
  }
];

const QUICK_FOOTAGE = [100, 200, 300, 400];

// Zod validation schema for contact form
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone must be less than 20 characters"),
  address: z.string().trim().min(1, "Install address is required").max(300, "Address must be less than 300 characters"),
});

type ContactData = z.infer<typeof contactSchema>;

export default function FenceEstimator() {
  const { toast } = useToast();
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>("install");
  const [selectedType, setSelectedType] = useState<FenceType | null>(null);
  const [height, setHeight] = useState<number>(6);
  const [linearFeet, setLinearFeet] = useState<number>(200);
  const [singleGates, setSingleGates] = useState(0);
  const [doubleGates, setDoubleGates] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contactInfo, setContactInfo: persistContactInfo } = useContactInfo();
  const [contactData, setContactData] = useState<ContactData>({ name: '', email: '', phone: '', address: '' });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  // Initialize contact data from persisted info
  useEffect(() => {
    setContactData({
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address || '',
    });
  }, []);

  const selectedFence = fenceOptions.find(f => f.id === selectedType);

  useEffect(() => {
    if (!showResults && !showContactForm) return;

    const section = document.getElementById("fence-calculator");
    if (!section) return;

    // Wait a frame so layout updates after we reveal results.
    requestAnimationFrame(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [showResults, showContactForm]);

  // When fence type changes, set height to first available
  const handleFenceSelect = (fenceId: FenceType) => {
    setSelectedType(fenceId);
    const fence = fenceOptions.find(f => f.id === fenceId);
    if (fence && !fence.heights.includes(height)) {
      setHeight(fence.heights[0]);
    }
  };

  const estimate = useMemo(() => {
    if (!selectedFence) return null;

    const pricePerFoot = selectedFence.pricePerFoot[height] || 0;

    if (calculatorMode === "install") {
      // Install mode: prices already include installation
      // Small job multiplier (2x) only applies to install mode
      const isSmallFootage = linearFeet < 40;
      const multiplier = isSmallFootage ? 2 : 1;
      const baseMaterialCost = pricePerFoot * linearFeet;
      const materialCost = baseMaterialCost * multiplier;
      
      // Gate costs at full price for install
      const singleGateCost = singleGates * selectedFence.singleGatePrice;
      const doubleGateCost = doubleGates * selectedFence.doubleGatePrice;
      const gateCosts = singleGateCost + doubleGateCost;
      
      // Apply variance for estimate range (no 1.75x multiplier - prices already include install)
      const lowEstimate = Math.round(materialCost * 0.95) + gateCosts;
      const highEstimate = Math.round(materialCost * 1.15) + gateCosts;
      
      return {
        baseMaterialCost,
        materialCost,
        singleGateCost,
        doubleGateCost,
        gateCosts,
        pricePerFoot,
        isSmallFootage,
        multiplier,
        lowEstimate,
        highEstimate,
        mode: "install" as const
      };
    }

    // DIY mode: 25% discount on materials, no small job multiplier
    const baseMaterialCost = pricePerFoot * linearFeet;
    const materialCost = Math.round(baseMaterialCost * 0.75);
    
    // Gate costs also reduced by 25% for DIY
    const singleGateCost = Math.round(singleGates * selectedFence.singleGatePrice * 0.75);
    const doubleGateCost = Math.round(doubleGates * selectedFence.doubleGatePrice * 0.75);
    const gateCosts = singleGateCost + doubleGateCost;
    
    const total = materialCost + gateCosts;
    
    return {
      baseMaterialCost,
      materialCost,
      singleGateCost,
      doubleGateCost,
      gateCosts,
      total,
      pricePerFoot,
      isSmallFootage: false,
      multiplier: 1,
      mode: "diy" as const
    };
  }, [selectedFence, height, linearFeet, singleGates, doubleGates, calculatorMode]);

  const handleReset = () => {
    setSelectedType(null);
    setHeight(6);
    setLinearFeet(200);
    setSingleGates(0);
    setDoubleGates(0);
    setShowResults(false);
    setShowContactForm(false);
    setContactData({ name: '', email: '', phone: '', address: '' });
    setContactErrors({});
  };

  const handleCalculate = () => {
    if (selectedType) {
      setShowContactForm(true);
    }
  };

  const handleContactChange = (field: keyof ContactData, value: string) => {
    setContactData(prev => ({ ...prev, [field]: value }));
    // Persist the contact info as user types
    persistContactInfo({ [field]: value });
    // Clear error for this field when user types
    if (contactErrors[field]) {
      setContactErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleContactSubmit = async () => {
    const result = contactSchema.safeParse(contactData);
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setContactErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const emailPayload = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        address: contactData.address,
        calculatorMode,
        fenceType: selectedType,
        fenceName: selectedFence?.name || '',
        height,
        linearFeet,
        singleGates,
        doubleGates,
        estimateLow: estimate?.mode === "install" ? estimate.lowEstimate : undefined,
        estimateHigh: estimate?.mode === "install" ? estimate.highEstimate : undefined,
        totalDiy: estimate?.mode === "diy" ? estimate.total : undefined,
        materialCost: estimate?.materialCost,
        gateCosts: estimate?.gateCosts,
      };

      // Save lead to database
      const { error: leadError } = await supabase.from('leads').insert({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        address: contactData.address || null,
        source: 'estimate_calculator',
        status: 'new',
        calculator_mode: calculatorMode,
        fence_type: selectedType,
        fence_name: selectedFence?.name || null,
        fence_height: height ? Number(height) : null,
        linear_feet: linearFeet ? Number(linearFeet) : null,
        single_gates: singleGates ? Number(singleGates) : 0,
        double_gates: doubleGates ? Number(doubleGates) : 0,
        estimate_low: estimate?.mode === "install" ? Math.round(estimate.lowEstimate) : null,
        estimate_high: estimate?.mode === "install" ? Math.round(estimate.highEstimate) : null,
        estimate_total: estimate?.mode === "diy" ? Math.round(estimate.total) : null,
        material_cost: estimate?.materialCost ? Math.round(estimate.materialCost) : null,
        gate_costs: estimate?.gateCosts ? Math.round(estimate.gateCosts) : null,
      });
      if (leadError) {
        console.error('Failed to save lead:', leadError);
        toast({
          title: "Couldn't save your request",
          description: "Your estimate was generated but we couldn't save it on our end. Please call (423) 477-4882 so we don't miss you.",
          variant: "destructive",
        });
      }

      const { data, error } = await supabase.functions.invoke('send-estimate-email', {
        body: emailPayload,
      });

      if (error) {
        console.error('Failed to send estimate email:', error);
        toast({
          title: "Email failed to send",
          description: "Your estimate is ready, but we couldn't send the confirmation email. Please call us at (423) 477-4882.",
          variant: "destructive",
        });
      } else {
        
        toast({
          title: "Estimate sent!",
          description: "Check your email for a copy of your estimate.",
        });
      }
    } catch (err) {
      console.error('Error sending estimate email:', err);
      toast({
        title: "Email failed to send",
        description: "Your estimate is ready, but we couldn't send the confirmation email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowContactForm(false);
      setShowResults(true);
    }
  };

  const handleBackToCalculator = () => {
    setShowContactForm(false);
  };

  const hasMultipleHeights = selectedFence && selectedFence.heights.length > 1;

  // Get display price per foot for fence cards
  const getDisplayPricePerFoot = (fence: FenceOption, heightOverride?: number) => {
    const basePrice = heightOverride ? fence.pricePerFoot[heightOverride] : Object.values(fence.pricePerFoot)[0];
    if (calculatorMode === "install") {
      // Install: show range based on variance (prices already include install)
      return {
        low: Math.round(basePrice * 0.95),
        high: Math.round(basePrice * 1.15),
        isRange: true
      };
    }
    // DIY: show 25% discounted price
    return { single: Math.round(basePrice * 0.75), isRange: false };
  };

  // Header content based on mode
  const headerContent = {
    install: {
      badge: "Installation Estimate",
      title: "Fence Installation Calculator",
      subtitle: "Get a ballpark estimate for professional fence installation"
    },
    diy: {
      badge: "Materials Estimate",
      title: "DIY Fence Materials Calculator",
      subtitle: "Professional-grade materials at DIY prices — delivery priced separately by location"
    }
  };

  return (
    <section id="fence-calculator" className="section-padding bg-muted/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--foreground)) 0px, hsl(var(--foreground)) 2px, transparent 2px, transparent 40px)`,
        }} />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold mb-6">
            <Calculator size={16} />
            {headerContent[calculatorMode].badge}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            {headerContent[calculatorMode].title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {headerContent[calculatorMode].subtitle}
          </p>

          {/* Mode Tabs */}
          <Tabs 
            value={calculatorMode} 
            onValueChange={(value) => setCalculatorMode(value as CalculatorMode)}
            className="inline-flex"
          >
            <TabsList className="bg-background border border-border shadow-sm">
              <TabsTrigger 
                value="install" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5"
              >
                Professional Install
              </TabsTrigger>
              <TabsTrigger 
                value="diy" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5"
              >
                DIY Materials
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults && !showContactForm ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Step 1: Fence Type Selection */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                    Choose Your Fence Style
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fenceOptions.map((fence, index) => (
                      <motion.button
                        key={fence.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleFenceSelect(fence.id)}
                        className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                          selectedType === fence.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/50 hover:bg-background/80"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${fence.color} flex items-center justify-center mb-4`}>
                          {fence.icon}
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-1 text-sm">{fence.name}</h3>
                        <p className="text-xs text-muted-foreground">{fence.description}</p>
                        <p className="text-xs text-primary font-semibold mt-2">
                          {(() => {
                            const price = getDisplayPricePerFoot(fence);
                            return price.isRange 
                              ? `From $${price.low} - $${price.high}/ft installed`
                              : `From $${price.single}/ft`;
                          })()}
                        </p>
                        {selectedType === fence.id && (
                          <motion.div
                            layoutId="selected-fence"
                            className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Call for Quote Note */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      <Phone size={14} className="inline mr-2" />
                      Need <strong>Pool Fencing</strong> or other specialty options? 
                      <a href="tel:423-477-3032" className="text-primary font-semibold ml-1 hover:underline">Call for a quote</a>
                    </p>
                  </div>
                </div>

                {/* Step 2: Height Selection (only for chain link) */}
                {hasMultipleHeights && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                      Select Fence Height
                    </h3>
                    <div className="flex gap-4">
                      {selectedFence.heights.map((h) => (
                        <button
                          key={h}
                          onClick={() => setHeight(h)}
                          className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all duration-300 ${
                            height === h
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-end justify-center gap-2">
                            <div 
                              className={`w-4 rounded-t transition-all ${height === h ? "bg-primary" : "bg-muted-foreground/30"}`}
                              style={{ height: `${h * 6}px` }}
                            />
                            <span className="font-display font-bold text-lg">{h} ft</span>
                          </div>
                          <p className="text-sm mt-2">
                            {(() => {
                              const price = getDisplayPricePerFoot(selectedFence, h);
                              return price.isRange 
                                ? `$${price.low} - $${price.high}/ft`
                                : `$${price.single}/ft`;
                            })()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Linear Feet */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: selectedType ? 1 : 0.4 }}
                  className={selectedType ? "" : "pointer-events-none"}
                >
                  <h3 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {hasMultipleHeights ? "3" : "2"}
                    </span>
                    Estimate Linear Feet
                  </h3>
                  <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Ruler className="text-primary" size={24} aria-hidden="true" />
                        <label htmlFor="linear-feet-input" className="text-muted-foreground">Total fence length</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="linear-feet-input"
                          type="text"
                          inputMode="numeric"
                          aria-label="Total fence length in feet"
                          value={linearFeet}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            if (raw === '') {
                              setLinearFeet(0);
                            } else {
                              const val = parseInt(raw, 10);
                              setLinearFeet(Math.min(500, val));
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (isNaN(val) || val < 0) {
                              setLinearFeet(0);
                            } else if (val > 500) {
                              setLinearFeet(500);
                            }
                          }}
                          className="w-24 text-2xl font-display font-bold text-primary text-right bg-muted/50 border border-border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <span className="text-lg text-muted-foreground font-medium" aria-hidden="true">ft</span>
                      </div>
                    </div>
                    <Slider
                      value={[linearFeet]}
                      onValueChange={(value) => setLinearFeet(value[0])}
                      min={0}
                      max={500}
                      step={5}
                      className="my-6"
                      aria-label="Adjust fence length"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span>0 ft</span>
                      <span>500 ft</span>
                    </div>
                    
                    {/* Quick select buttons */}
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Quick footage selection">
                      <span className="text-sm text-muted-foreground mr-2" id="quick-select-label">Quick select:</span>
                      {QUICK_FOOTAGE.map((ft) => (
                        <button
                          key={ft}
                          type="button"
                          onClick={() => setLinearFeet(ft)}
                          aria-label={`Set fence length to ${ft} feet`}
                          aria-pressed={linearFeet === ft}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            linearFeet === ft 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-foreground hover:bg-muted/80"
                          }`}
                        >
                          {ft} ft
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Step 4: Gates */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: selectedType ? 1 : 0.4 }}
                  className={selectedType ? "" : "pointer-events-none"}
                >
                  <h3 className="text-xl font-display font-semibold text-foreground mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {hasMultipleHeights ? "4" : "3"}
                    </span>
                    Add Gates (Optional)
                  </h3>
                  <div className="bg-background rounded-2xl p-6 border border-border shadow-sm space-y-6">
                    {/* Single Gates */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">Single Gates (Walk Gates)</p>
                        <p className="text-sm text-muted-foreground">
                          ${selectedFence?.singleGatePrice.toLocaleString() || "—"} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3" role="group" aria-label="Single gate quantity">
                        <button
                          type="button"
                          onClick={() => setSingleGates(Math.max(0, singleGates - 1))}
                          disabled={singleGates === 0}
                          aria-label="Remove single gate"
                          className="w-10 h-10 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={18} aria-hidden="true" />
                        </button>
                        <span className="text-2xl font-bold text-primary w-8 text-center" aria-live="polite">{singleGates}</span>
                        <button
                          type="button"
                          onClick={() => setSingleGates(Math.min(10, singleGates + 1))}
                          aria-label="Add single gate"
                          className="w-10 h-10 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center"
                        >
                          <Plus size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Double Gates */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-foreground font-medium">Double Gates (Drive Gates)</p>
                        <p className="text-sm text-muted-foreground">
                          ${selectedFence?.doubleGatePrice.toLocaleString() || "—"} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3" role="group" aria-label="Double gate quantity">
                        <button
                          type="button"
                          onClick={() => setDoubleGates(Math.max(0, doubleGates - 1))}
                          disabled={doubleGates === 0}
                          aria-label="Remove double gate"
                          className="w-10 h-10 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={18} aria-hidden="true" />
                        </button>
                        <span className="text-2xl font-bold text-primary w-8 text-center" aria-live="polite">{doubleGates}</span>
                        <button
                          type="button"
                          onClick={() => setDoubleGates(Math.min(5, doubleGates + 1))}
                          aria-label="Add double gate"
                          className="w-10 h-10 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center"
                        >
                          <Plus size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Gate Subtotal */}
                    {(singleGates > 0 || doubleGates > 0) && selectedFence && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-4 border-t border-border"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gate Subtotal</span>
                          <span className="font-semibold text-foreground">
                            ${(singleGates * selectedFence.singleGatePrice + doubleGates * selectedFence.doubleGatePrice).toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Calculate Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center pt-6"
                >
                  <Button
                    onClick={handleCalculate}
                    disabled={!selectedType}
                    size="lg"
                    className="btn-primary text-lg px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calculator className="mr-2" size={20} />
                    Calculate My Estimate
                  </Button>
                </motion.div>
              </motion.div>
            ) : showContactForm ? (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-xl mx-auto"
              >
                <div className="bg-background rounded-3xl border border-border p-8 md:p-10 shadow-lg">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Mail className="text-primary" size={32} />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                      Almost There!
                    </h3>
                    <p className="text-muted-foreground">
                      Enter your info to see your personalized estimate.
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-foreground font-medium mb-2 flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Smith"
                        value={contactData.name}
                        onChange={(e) => handleContactChange('name', e.target.value)}
                        className={contactErrors.name ? "border-destructive" : ""}
                      />
                      {contactErrors.name && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground font-medium mb-2 flex items-center gap-2">
                        <Mail size={16} className="text-primary" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={contactData.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        className={contactErrors.email ? "border-destructive" : ""}
                      />
                      {contactErrors.email && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-foreground font-medium mb-2 flex items-center gap-2">
                        <Phone size={16} className="text-primary" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(423) 555-1234"
                        value={contactData.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        className={contactErrors.phone ? "border-destructive" : ""}
                      />
                      {contactErrors.phone && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-foreground font-medium mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        Install Location Address *
                      </Label>
                      <AddressAutocomplete
                        id="address"
                        placeholder="123 Main St, Johnson City, TN 37601"
                        value={contactData.address}
                        onChange={(val) => handleContactChange('address', val)}
                        className={contactErrors.address ? "border-destructive" : ""}
                      />
                      {contactErrors.address && (
                        <p className="text-sm text-destructive mt-1">{contactErrors.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button
                      onClick={handleBackToCalculator}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft size={18} className="mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleContactSubmit}
                      size="lg"
                      className="btn-primary flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          See My Estimate
                          <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                {/* Results Header */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Sparkles className="text-primary" size={40} />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                    {calculatorMode === "install" ? "Your Installation Estimate" : "Your Materials Estimate"}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedFence?.name} • {height}ft height • {linearFeet.toLocaleString()} linear feet
                    {singleGates > 0 && ` • ${singleGates} single gate${singleGates > 1 ? 's' : ''}`}
                    {doubleGates > 0 && ` • ${doubleGates} double gate${doubleGates > 1 ? 's' : ''}`}
                  </p>
                </div>

                {/* Estimate Breakdown */}
                <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-lg">
                  <div className="p-8 space-y-4">
                    {estimate?.isSmallFootage ? (
                      <>
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">
                            Base {calculatorMode === "install" ? "Installation" : "Materials"} ({linearFeet.toLocaleString()} ft × {calculatorMode === "install" ? `~$${Math.round(estimate.pricePerFoot * 1.75)}` : `$${estimate.pricePerFoot}`}/ft)
                          </span>
                          <span className="text-foreground font-semibold">
                            ${calculatorMode === "install" ? Math.round(estimate.baseMaterialCost * 1.75).toLocaleString() : estimate.baseMaterialCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border bg-amber-50 dark:bg-amber-950/30 -mx-8 px-8">
                          <span className="text-amber-700 dark:text-amber-400">
                            Small footage increase (under 40 ft)
                          </span>
                          <span className="text-amber-700 dark:text-amber-400 font-semibold">
                            2× multiplier
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">
                            Adjusted {calculatorMode === "install" ? "Installation" : "Materials"} Total
                          </span>
                          <span className="text-foreground font-semibold">
                            ${estimate.materialCost.toLocaleString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground">
                          {calculatorMode === "install" ? "Installation" : "Materials"} ({linearFeet.toLocaleString()} ft × ${estimate?.pricePerFoot}/ft)
                        </span>
                        <span className="text-foreground font-semibold">
                          ${estimate?.materialCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {singleGates > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground">
                          Single Gates ({singleGates} × ${selectedFence?.singleGatePrice.toLocaleString()})
                        </span>
                        <span className="text-foreground font-semibold">
                          ${estimate?.singleGateCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {doubleGates > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground">
                          Double Gates ({doubleGates} × ${selectedFence?.doubleGatePrice.toLocaleString()})
                        </span>
                        <span className="text-foreground font-semibold">
                          ${estimate?.doubleGateCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-primary/10 p-8">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-display font-semibold text-foreground">
                        {calculatorMode === "install" ? "Estimated Installation Range" : "Estimated Materials Total"}
                      </span>
                      <span className="text-3xl font-display font-bold text-primary">
                        {calculatorMode === "install" && estimate?.mode === "install"
                          ? `$${estimate.lowEstimate.toLocaleString()} - $${estimate.highEstimate.toLocaleString()}`
                          : estimate?.mode === "diy" ? `$${estimate.total.toLocaleString()}` : ""
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    {calculatorMode === "install" 
                      ? "*This is an approximate estimate. Actual costs may vary based on site conditions, terrain, accessibility, and project-specific requirements assessed during your free on-site evaluation. Delivery not included."
                      : "*Materials pricing only — delivery not included. Delivery fees vary by location and will be quoted separately. Final pricing based on site conditions and terrain."
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="group"
                  >
                    <RotateCcw size={18} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Start Over
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="btn-primary"
                  >
                    <a href="/contact">
                      Request Free Quote
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
