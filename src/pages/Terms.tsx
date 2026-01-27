import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Review the terms and conditions for using BLACKFILES intelligence publication. Subscription tiers, intellectual property, and user obligations."
        path="/terms"
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
              <h1 className="text-4xl font-serif font-bold mt-4 mb-2">Terms of Service</h1>
              <p className="text-muted-foreground font-mono text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="prose-blackfiles space-y-8">
              <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using BLACKFILES ("the Service"), you agree to be bound by these 
                  Terms of Service. If you disagree with any part of these terms, you may not 
                  access the Service.
                </p>
              </section>

              <section>
                <h2>2. Description of Service</h2>
                <p>
                  BLACKFILES is a subscription-based intelligence publication providing analysis 
                  on shadow economies, exploit fusion, and systemic financial risk. Content is 
                  organized into three access tiers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Public</strong> — Free access to selected content</li>
                  <li><strong>Professional</strong> — $4.99/month for expanded analysis</li>
                  <li><strong>Restricted</strong> — $9.99/month for full archive access</li>
                </ul>
              </section>

              <section>
                <h2>3. User Accounts</h2>
                <p>
                  You are responsible for maintaining the confidentiality of your account 
                  credentials. You agree to notify us immediately of any unauthorized use of 
                  your account. We reserve the right to suspend or terminate accounts that 
                  violate these terms.
                </p>
              </section>

              <section>
                <h2>4. Subscription & Billing</h2>
                <p>
                  Paid subscriptions are billed monthly in advance. By subscribing, you authorize 
                  us to charge your payment method on a recurring basis. You may cancel at any 
                  time, with access continuing until the end of your billing period.
                </p>
                <p className="mt-4">
                  <strong>Refunds:</strong> We offer a 7-day refund policy for first-time 
                  subscribers who are unsatisfied with the service.
                </p>
              </section>

              <section>
                <h2>5. Intellectual Property</h2>
                <p>
                  All content on BLACKFILES, including text, graphics, analysis, and 
                  methodology, is the exclusive property of BLACKFILES and protected by 
                  copyright law. You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Reproduce, distribute, or republish content without permission</li>
                  <li>Use content for commercial purposes without a license</li>
                  <li>Share account credentials or access with others</li>
                  <li>Scrape, download, or archive content programmatically</li>
                </ul>
              </section>

              <section>
                <h2>6. Disclaimer</h2>
                <p>
                  BLACKFILES content is provided for informational and educational purposes only. 
                  It does not constitute financial, legal, or professional advice. We make no 
                  guarantees about the accuracy, completeness, or timeliness of any content.
                </p>
                <div className="sidebar-element my-6">
                  <p className="text-sm text-foreground">
                    <strong>Important:</strong> Past analysis does not predict future outcomes. 
                    Always conduct your own research and consult qualified professionals before 
                    making financial decisions.
                  </p>
                </div>
              </section>

              <section>
                <h2>7. Limitation of Liability</h2>
                <p>
                  In no event shall BLACKFILES be liable for any indirect, incidental, special, 
                  consequential, or punitive damages arising from your use of the Service. Our 
                  total liability shall not exceed the amount you paid for the Service in the 
                  preceding 12 months.
                </p>
              </section>

              <section>
                <h2>8. Prohibited Conduct</h2>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Attempt to circumvent access controls or security measures</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                  <li>Share, resell, or redistribute subscription access</li>
                </ul>
              </section>

              <section>
                <h2>9. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your access immediately, without 
                  prior notice, for conduct that we determine violates these Terms or is harmful 
                  to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2>10. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of 
                  the United States, without regard to conflict of law provisions.
                </p>
              </section>

              <section>
                <h2>11. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will provide notice 
                  of material changes via email or through the Service. Continued use after 
                  changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2>12. Contact</h2>
                <p>
                  For questions about these Terms, contact us at: 
                  <span className="text-classified"> legal@blackfiles.io</span>
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

export default Terms;
