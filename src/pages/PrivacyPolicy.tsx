import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how BLACKFILES collects, uses, and protects your personal information. Our commitment to data privacy and security."
        path="/privacy"
      />
      <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <span className="classified-stamp mb-4">LEGAL</span>
              <h1 className="text-4xl font-serif font-bold mt-4 mb-2">Privacy Policy</h1>
              <p className="text-muted-foreground font-mono text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="prose-blackfiles space-y-8">
              <section>
                <h2>1. Information We Collect</h2>
                <p>
                  BLACKFILES collects information you provide directly when creating an account, 
                  subscribing to our service, or contacting us. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Email address</li>
                  <li>Password (encrypted)</li>
                  <li>Payment information (processed securely via Stripe)</li>
                  <li>Subscription preferences</li>
                </ul>
              </section>

              <section>
                <h2>2. How We Use Your Information</h2>
                <p>We use collected information to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide and maintain our intelligence publication service</li>
                  <li>Process subscriptions and payments</li>
                  <li>Send service-related communications</li>
                  <li>Enforce access controls based on subscription tier</li>
                  <li>Improve our content and user experience</li>
                </ul>
              </section>

              <section>
                <h2>3. Data Storage & Security</h2>
                <p>
                  Your data is stored securely using industry-standard encryption. Our backend 
                  infrastructure employs enterprise-grade security measures including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>TLS encryption for data in transit</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>Row-level security policies</li>
                  <li>Regular security audits</li>
                </ul>
              </section>

              <section>
                <h2>4. Third-Party Services</h2>
                <p>We use the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Stripe</strong> — Payment processing (PCI DSS compliant)</li>
                  <li><strong>Lovable Cloud</strong> — Authentication and database hosting</li>
                </ul>
                <p className="mt-4">
                  We do not sell, trade, or otherwise transfer your personal information to 
                  outside parties except as described above.
                </p>
              </section>

              <section>
                <h2>5. Cookies & Tracking</h2>
                <p>
                  We use essential cookies for authentication and session management. We do not 
                  use advertising trackers or sell data to third parties.
                </p>
              </section>

              <section>
                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your account and data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2>7. Data Retention</h2>
                <p>
                  We retain your data for as long as your account is active or as needed to 
                  provide services. Upon account deletion, we remove your personal data within 
                  30 days, except where retention is required by law.
                </p>
              </section>

              <section>
                <h2>8. Children's Privacy</h2>
                <p>
                  BLACKFILES is not intended for individuals under 18 years of age. We do not 
                  knowingly collect personal information from children.
                </p>
              </section>

              <section>
                <h2>9. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. We will notify you of any 
                  material changes by posting the new policy on this page and updating the 
                  "Last updated" date.
                </p>
              </section>

              <section>
                <h2>10. Contact Us</h2>
                <p>
                  For questions about this Privacy Policy or to exercise your data rights, 
                  contact us at: <span className="text-classified">privacy@blackfiles.io</span>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
