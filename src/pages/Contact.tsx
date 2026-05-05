import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useContactInfo } from "@/hooks/useContactInfo";
import { supabase } from "@/integrations/supabase/client";
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone must be less than 20 characters"),
  address: z.string().trim().min(1, "Project address is required for accurate quotes").max(200, "Address must be less than 200 characters"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const projectTypes = [
  { value: "residential", label: "Residential Fencing" },
  { value: "commercial", label: "Commercial Fencing" },
  { value: "gates", label: "Gate Operators" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { contactInfo, setContactInfo: persistContactInfo } = useContactInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    projectType: "",
    message: "",
  });

  // Initialize form data from persisted contact info
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: contactInfo.name || prev.name,
      email: contactInfo.email || prev.email,
      phone: contactInfo.phone || prev.phone,
    }));
  }, []);

  // Pre-select project type from URL param
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && projectTypes.some(pt => pt.value === typeParam)) {
      setFormData(prev => ({ ...prev, projectType: typeParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Persist contact info fields as user types
    if (name === "name" || name === "email" || name === "phone") {
      persistContactInfo({ [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const projectTypeLabel = projectTypes.find(pt => pt.value === formData.projectType)?.label || formData.projectType;

      // Save lead to database
      const { error: leadError } = await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || null,
        project_type: projectTypeLabel || null,
        message: formData.message || null,
        source: 'contact_form',
        status: 'new',
      });
      if (leadError) console.error('Failed to save lead:', leadError);

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          projectType: projectTypeLabel,
          message: formData.message,
        },
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 1 business day.",
      });
    } catch (error: any) {
      console.error("Failed to send email:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or call us directly at (423) 477-4882.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Contact Us | McCall Fencing</title>
          <meta name="description" content="Contact McCall Fencing for a free quote on residential or commercial fencing in the Tri-Cities area." />
        </Helmet>
        <Navigation />
        
        <section className="min-h-screen flex items-center justify-center bg-card pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Thank you for reaching out!
            </h2>
            <p className="text-muted-foreground mb-8">
              We've received your message and will get back to you within 1 business day. In the meantime, feel free to give us a call.
            </p>
            <a href="tel:+14234774882" className="btn-primary">
              <Phone className="mr-2" size={18} />
              Call (423) 477-4882
            </a>
          </motion.div>
        </section>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact McCall Fencing | Free Fence Estimates in Johnson City, Kingsport, Bristol</title>
        <meta name="description" content="Contact McCall Fencing for a free fence estimate. Call (423) 477-4882 or fill out our form. Serving Johnson City, Kingsport, Bristol & the Tri-Cities." />
        <link rel="canonical" href="https://mccall.lovable.app/contact" />
        
        <meta property="og:title" content="Contact McCall Fencing | Free Estimates" />
        <meta property="og:description" content="Get a free fence quote. Call (423) 477-4882 or fill out our form. Tri-Cities area." />
        <meta property="og:url" content="https://mccall.lovable.app/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mccall.lovable.app/og-contact.jpg" />
        <meta property="og:image:width" content="1216" />
        <meta property="og:image:height" content="640" />
        <meta property="og:site_name" content="McCall Commercial Fencing" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact McCall Fencing | Free Estimates" />
        <meta name="twitter:image" content="https://mccall.lovable.app/og-contact.jpg" />
      </Helmet>

      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-cream/70 max-w-2xl">
              Ready to start your fencing project? Fill out the form below or give us a call. We typically respond within 1 business day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground mb-1">Phone</p>
                    <a href="tel:+14234774882" className="text-primary hover:underline">
                      (423) 477-4882
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground mb-1">Email</p>
                    <a href="mailto:info@mccallfencing.com" className="text-primary hover:underline">
                      info@mccallfencing.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground mb-1">Address</p>
                    <p className="text-muted-foreground">
                      6248 Kingsport Hwy<br />
                      Gray, Tennessee 37615
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground mb-1">Hours</p>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9AM - 5PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="mt-10 p-6 bg-background rounded-xl border border-border">
                <h3 className="font-display font-semibold text-foreground mb-4">Service Areas</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Johnson City, TN</li>
                  <li>• Kingsport, TN</li>
                  <li>• Bristol, TN/VA</li>
                  <li>• Tri-Cities Region</li>
                  <li>• Northeast Tennessee</li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-background rounded-2xl border border-border p-8 md:p-10">
                <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                  Request a Free Quote
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-destructive' : 'border-border'} bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-destructive' : 'border-border'} bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                        placeholder="(555) 555-5555"
                      />
                      {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-destructive' : 'border-border'} bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Project Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                      Project Address *
                      <span className="block text-xs text-muted-foreground font-normal mt-0.5">Required for accurate site assessment and quote</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-destructive' : 'border-border'} bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="123 Main St, City, TN"
                    />
                    {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.projectType ? 'border-destructive' : 'border-border'} bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      <option value="">Select a project type</option>
                      {projectTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {errors.projectType && <p className="text-destructive text-sm mt-1">{errors.projectType}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Tell us about your project *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-destructive' : 'border-border'} bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
                      placeholder="Describe your fencing needs, approximate linear feet, preferred materials, etc."
                    />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
