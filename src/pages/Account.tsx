import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { AccessBadge } from '@/components/AccessBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { User, CreditCard, Shield, Calendar, Mail, Crown, Lock } from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const { user, accessLevel, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-classified border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const subscriptionDetails = {
    public: {
      name: 'Free Tier',
      price: '$0/month',
      description: 'Access to public intelligence briefings',
      features: ['Public content access', 'Issue previews', 'Founding member updates'],
    },
    professional: {
      name: 'Professional',
      price: '$4.99/month',
      description: 'Expanded analysis for verified analysts',
      features: ['All public content', 'Professional-tier intelligence', 'Early access to reports', 'Priority support'],
    },
    restricted: {
      name: 'Restricted',
      price: '$9.99/month',
      description: 'Complete archive access for elite analysts',
      features: ['All content tiers', 'Restricted intelligence', 'Full archive access', 'Exclusive briefings', 'Direct analyst contact'],
    },
  };

  const currentPlan = subscriptionDetails[accessLevel];

  return (
    <>
      <SEO
        title="Account"
        description="Manage your BLACKFILES account, subscription, and billing settings."
        path="/account"
      />
      <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <span className="classified-stamp mb-4">SECURE</span>
              <h1 className="text-4xl font-serif font-bold mt-4 mb-2">Account</h1>
              <p className="text-muted-foreground">
                Manage your profile and subscription settings
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Card */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-sm">
                      <User className="w-5 h-5 text-classified" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Profile</CardTitle>
                      <CardDescription>Your account information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-mono text-sm">{user.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member since</p>
                      <p className="font-mono text-sm">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Access Level</p>
                      <AccessBadge level={accessLevel} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Card */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-sm">
                      <Crown className="w-5 h-5 text-classified" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Subscription</CardTitle>
                      <CardDescription>Your current plan</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-sm border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-semibold text-lg">{currentPlan.name}</span>
                      <span className="font-mono text-classified">{currentPlan.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{currentPlan.description}</p>
                    <ul className="space-y-2">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-classified rounded-full" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {accessLevel === 'public' && (
                    <div className="space-y-2">
                      <Button variant="classified" className="w-full gap-2" disabled>
                        <Lock className="w-4 h-4" />
                        Upgrade to Professional
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Paid tiers launching soon
                      </p>
                    </div>
                  )}

                  {accessLevel === 'professional' && (
                    <div className="space-y-2">
                      <Button variant="classified" className="w-full gap-2" disabled>
                        <Lock className="w-4 h-4" />
                        Upgrade to Restricted
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Paid tiers launching soon
                      </p>
                    </div>
                  )}

                  {accessLevel === 'restricted' && (
                    <div className="p-3 bg-classified/10 border border-classified/30 rounded-sm">
                      <p className="text-sm text-classified text-center font-mono">
                        ● MAXIMUM ACCESS GRANTED
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing Card */}
              <Card className="bg-card border-border md:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-sm">
                      <CreditCard className="w-5 h-5 text-classified" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Billing</CardTitle>
                      <CardDescription>Payment methods and history</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 bg-secondary rounded-full mb-4">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-serif text-lg mb-2">No payment methods</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                      Payment processing will be available soon. 
                      You'll be able to add credit cards and manage billing here.
                    </p>
                    <Button variant="outline" disabled className="gap-2">
                      <CreditCard className="w-4 h-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      </div>
    </>
  );
};

export default Account;
