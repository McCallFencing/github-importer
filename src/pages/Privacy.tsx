import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | McCall Commercial Fencing</title>
        <meta name="description" content="Learn how McCall Commercial Fencing collects, uses, and protects your personal information." />
      </Helmet>
      
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2025</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  McCall Commercial Fencing ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our fencing services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Request a free estimate or quote</li>
                  <li>Contact us through our website, phone, or email</li>
                  <li>Schedule a consultation or service appointment</li>
                  <li>Sign up for newsletters or promotional materials</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This information may include your name, email address, phone number, physical address, property details, and any other information you choose to provide regarding your fencing project.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide accurate estimates and quotes for fencing projects</li>
                  <li>Communicate with you about your project or inquiry</li>
                  <li>Schedule and complete installation or repair services</li>
                  <li>Send you information about our services, promotions, or industry updates (with your consent)</li>
                  <li>Improve our website and customer service</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business, such as payment processors or scheduling software, provided they agree to keep your information confidential. We may also disclose your information if required by law or to protect our rights and safety.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website may use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings. Disabling cookies may affect some functionality of our website.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, please contact us using the information below.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-muted/50 rounded-lg">
                  <p className="font-semibold">McCall Commercial Fencing</p>
                  <p className="text-muted-foreground">6248 Kingsport Hwy</p>
                  <p className="text-muted-foreground">Gray, Tennessee 37615</p>
                  <p className="text-muted-foreground mt-2">Phone: (423) 477-4882</p>
                  <p className="text-muted-foreground">Email: info@mccallfencing.com</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}