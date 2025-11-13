import { Check, Star, Users, Building2, Sparkles, Zap, Shield, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import PublicNav from './PublicNav';
import PaymentModal from './ui/PaymentModal';

interface PricingPageProps {
  onNavigate: (page: any) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  isLoggedIn?: boolean;
}

export default function PricingPage({ onNavigate, darkMode = false, toggleDarkMode, isLoggedIn = false }: PricingPageProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string} | null>(null);
  const [activePlan, setActivePlan] = useState<string>('Freemium');
  const [showContactModal, setShowContactModal] = useState(false);

  const handlePurchaseClick = (planName: string, planPrice: string) => {
    setSelectedPlan({ name: planName, price: planPrice });
    setShowPaymentModal(true);
  };
  const plans = [
    {
      name: 'Freemium',
      price: 'Free',
      period: 'Forever',
      icon: Star,
      color: 'from-green-500 to-emerald-500',
      description: 'Perfect for individuals getting started',
      features: [
        'Basic sign language translation',
        'Real-time camera access',
        '30 minutes of tutorial content',
  'American Sign Language (ASL) support',
        'Text-to-speech output',
        'Community forum access',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Vaani Setu Premium',
      price: '₹199',
      period: 'per month',
      icon: Zap,
      color: 'from-blue-500 to-purple-500',
      description: 'Seamless daily communication',
      features: [
        'Everything in Freemium',
        'Unlimited usage',
        'Offline mode',
        'Personalized gesture learning',
        'Priority support',
        'Advanced AI models',
        'No ads',
        'Custom vocabulary',
        'Progress tracking',
      ],
      cta: 'Start Premium',
      popular: true,
    },
    {
      name: 'Family Plan',
      price: '₹499',
      period: 'per month',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      description: 'For families and small groups',
      features: [
        'Everything in Premium',
        'Up to 5 user accounts',
        'Shared learning progress',
        'Family dashboard',
        'Enhanced priority support',
        'Free healthcare consultations',
        'Dedicated account manager',
        'Custom training sessions',
        'Multi-device sync',
      ],
      cta: 'Choose Family Plan',
      popular: false,
    },
    {
      name: 'Enterprise API',
      price: 'Custom',
      period: 'Contact us',
      icon: Building2,
      color: 'from-orange-500 to-red-500',
      description: 'For businesses and organizations',
      features: [
        'Full API access',
        'Unlimited endpoints',
        'Custom integrations',
        'SLA guarantee',
        '24/7 dedicated support',
        'HIPAA compliance',
        'Custom AI model training',
        'White-label options',
        'Analytics dashboard',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      popular: false,
      enterprise: true,
    },
  ];

  const useCases = [
    {
      icon: Heart,
      title: 'Hospitals & Healthcare',
      description: 'Enable seamless doctor-patient communication',
    },
    {
      icon: Shield,
      title: 'Customer Care Centers',
      description: 'Provide accessible support services',
    },
    {
      icon: Users,
      title: 'Universities',
      description: 'Make education inclusive for all',
    },
    {
      icon: Building2,
      title: 'Government & Corporate',
      description: 'Ensure accessibility compliance',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation - Only show PublicNav when not logged in */}
      {!isLoggedIn && (
        <PublicNav onNavigate={onNavigate} currentPage="pricing" darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white py-20 px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Transparent Pricing</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl mb-6"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Start free, upgrade as you grow. Every plan includes our core mission: 
            breaking communication barriers with AI.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl text-gray-900 dark:text-white">{plan.price}</span>
                    {!plan.enterprise && plan.price !== 'Free' && (
                      <span className="text-gray-600 dark:text-gray-400">/{plan.period.split(' ')[1]}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{plan.period}</p>
                </div>

                {(isLoggedIn && activePlan === plan.name) ? (
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-xl mb-6 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  >
                    You are using this plan
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (plan.enterprise) {
                          setShowContactModal(true);
                      } else if (isLoggedIn) {
                        handlePurchaseClick(plan.name, plan.price);
                      } else {
                        onNavigate('signup');
                      }
                    }}
                    className={`w-full py-3 px-6 rounded-xl transition-all mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isLoggedIn && !plan.enterprise ? 'Purchase This Plan' : plan.cta}
                  </button>
                )}

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl text-center mb-4 text-gray-900 dark:text-white">Enterprise Solutions</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Trusted by leading organizations across India to provide accessible communication
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg mb-2 text-gray-900 dark:text-white">{useCase.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{useCase.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg mb-3 text-gray-900 dark:text-white">Can I switch plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate the charges accordingly.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg mb-3 text-gray-900 dark:text-white">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit/debit cards, UPI, net banking, and digital wallets. 
                Enterprise customers can opt for invoice-based billing.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg mb-3 text-gray-900 dark:text-white">Is there a free trial for premium plans?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                The Freemium plan is free forever! For Premium and Family plans, we offer a 14-day 
                money-back guarantee so you can try risk-free.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg mb-3 text-gray-900 dark:text-white">How does the Family Plan work?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                The Family Plan allows up to 5 members to use Vaani Setu under one subscription. 
                Each member gets their own account with personalized learning and shared family dashboard.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-12 text-white">
            <h2 className="text-3xl mb-4">Still Have Questions?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our team is here to help you choose the right plan for your needs
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => isLoggedIn ? onNavigate('dashboard') : onNavigate('signup')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Free Today'}
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
  {/* Footer is rendered centrally by App to avoid duplicates */}

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            if (selectedPlan) {
              setActivePlan(selectedPlan.name);
            }
          }}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          darkMode={darkMode}
        />
      )}

      {/* Contact Modal for Enterprise */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowContactModal(false)}>
          <div 
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full p-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={`text-2xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enterprise Contact</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Interested in our Enterprise API? Our sales team would love to help!
            </p>
            <div className="space-y-4">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</p>
                <a href="mailto:enterprise@vaanisetu.com" className="text-blue-600 hover:text-blue-700 font-semibold">enterprise@vaanisetu.com</a>
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</p>
                <a href="tel:+911800123456" className="text-blue-600 hover:text-blue-700 font-semibold">+91 1800-123-456</a>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
