import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | McCall Commercial Fencing</title>
        <meta name="description" content="Review the terms and conditions for using McCall Commercial Fencing's website and services." />
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
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2025</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using the McCall Commercial Fencing website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Services Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  McCall Commercial Fencing provides residential and commercial fencing installation, repair, and maintenance services throughout Tennessee, Virginia, and North Carolina. Our services include but are not limited to wood fencing, vinyl fencing, chain link fencing, ornamental fencing, pool fencing, and automated gate systems.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Estimates and Pricing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All estimates provided through our website, fence calculator, or in-person consultations are approximations based on the information available at the time. Final pricing may vary based on:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Actual site conditions and terrain</li>
                  <li>Underground utilities or obstacles</li>
                  <li>Permit requirements and fees</li>
                  <li>Material availability and market pricing</li>
                  <li>Changes to project scope requested by the customer</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  A detailed written proposal will be provided before any work begins, and no charges will be incurred until the customer approves the final scope and pricing.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Payment terms will be outlined in your service agreement. A deposit may be required before work begins on larger projects. Final payment is due upon satisfactory completion of the project unless otherwise agreed in writing. We accept various payment methods including cash, check, and major credit cards.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Warranty</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  McCall Commercial Fencing stands behind our workmanship and materials:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Workmanship Warranty:</strong> We provide a warranty on our installation work. Duration and terms vary by project type and will be specified in your service agreement.</li>
                  <li><strong>Material Warranty:</strong> Many of our fencing materials come with manufacturer warranties. We will provide documentation and assist with any warranty claims.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Warranty does not cover damage caused by severe weather events, accidents, improper use, lack of maintenance, or modifications made by others.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Customer Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When engaging our services, customers agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide accurate information about property boundaries and ownership</li>
                  <li>Obtain any necessary permits or HOA approvals (unless otherwise agreed)</li>
                  <li>Ensure access to the work area for our installation team</li>
                  <li>Mark or have utilities marked before installation begins</li>
                  <li>Remove personal property from the work area</li>
                  <li>Notify us of any known underground obstacles or utilities</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Property Lines and Surveys</h2>
                <p className="text-muted-foreground leading-relaxed">
                  It is the customer's responsibility to confirm property lines before fence installation. McCall Commercial Fencing is not responsible for fences installed based on incorrect property line information provided by the customer. We recommend obtaining a professional survey for any project where property lines are uncertain.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Cancellation and Rescheduling</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We understand plans change. Please provide at least 48 hours notice if you need to reschedule an appointment or consultation. For projects with materials already ordered, cancellation may be subject to restocking fees or non-refundable deposits as outlined in your service agreement.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, McCall Commercial Fencing shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our website or services. Our total liability shall not exceed the amount paid for the specific service in question.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Website Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When using our website, you agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Use the website for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to any portion of the website</li>
                  <li>Interfere with the proper functioning of the website</li>
                  <li>Copy, modify, or distribute website content without permission</li>
                  <li>Submit false or misleading information</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website, including text, images, logos, and design elements, is the property of McCall Commercial Fencing and is protected by copyright and trademark laws. You may not reproduce, distribute, or use our content without prior written permission.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the State of Tennessee. Any disputes arising from these terms or our services shall be resolved in the courts of Washington County, Tennessee.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our website or services after changes are posted constitutes acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about these Terms of Service, please contact us at:
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