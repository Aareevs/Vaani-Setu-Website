import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Smartphone, Check, ArrowRight } from 'lucide-react';
import {
  VisaLogo,
  HDFCLogo,
  RuPayLogo,
  SBILogo,
  GooglePayLogo,
  PaytmLogo,
  PhonePeLogo
} from './PaymentLogos';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  darkMode?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'upi';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const bankCards: PaymentMethod[] = [
  {
    id: 'visa',
    name: 'Visa',
    type: 'card',
    icon: VisaLogo,
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    type: 'card',
    icon: HDFCLogo,
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'rupay',
    name: 'RuPay',
    type: 'card',
    icon: RuPayLogo,
    color: 'from-green-600 to-green-700'
  },
  {
    id: 'sbi',
    name: 'SBI Card',
    type: 'card',
    icon: SBILogo,
    color: 'from-blue-800 to-blue-900'
  }
];

const upiApps: PaymentMethod[] = [
  {
    id: 'gpay',
    name: 'Google Pay',
    type: 'upi',
    icon: GooglePayLogo,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    type: 'upi',
    icon: PaytmLogo,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    type: 'upi',
    icon: PhonePeLogo,
    color: 'from-purple-500 to-purple-600'
  }
];

export default function PaymentModal({ isOpen, onClose, planName, planPrice, darkMode = false }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPaymentStep('details');
  };

  const handlePayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        onClose();
        setPaymentStep('select');
        setSelectedMethod(null);
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Complete Your Purchase
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {planName} - {planPrice}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {paymentStep === 'select' && (
                <div className="space-y-6">
                  {/* Bank Cards Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Pay with Debit/Credit Card
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {bankCards.map((card) => (
                        <motion.button
                          key={card.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMethodSelect(card)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            darkMode 
                              ? 'border-gray-600 hover:border-blue-500 bg-gray-700' 
                              : 'border-gray-200 hover:border-blue-500 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                            <card.icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {card.name}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Secure payment
                            </p>
                          </div>
                        </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* UPI Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Pay with UPI
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {upiApps.map((app) => (
                        <motion.button
                          key={app.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMethodSelect(app)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            darkMode 
                              ? 'border-gray-600 hover:border-green-500 bg-gray-700' 
                              : 'border-gray-200 hover:border-green-500 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                            <app.icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {app.name}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Fast & secure
                            </p>
                          </div>
                        </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {paymentStep === 'details' && selectedMethod && (
                <div className="space-y-6">
                  <button
                    onClick={() => setPaymentStep('select')}
                    className={`flex items-center gap-2 text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to payment methods
                  </button>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedMethod.color} flex items-center justify-center`}>
                      <selectedMethod.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedMethod.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {planName} - {planPrice}
                      </p>
                    </div>
                  </div>

                  {selectedMethod.type === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                              : 'border-gray-300 bg-white text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              darkMode 
                                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                : 'border-gray-300 bg-white text-gray-900'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              darkMode 
                                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                : 'border-gray-300 bg-white text-gray-900'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@bankname"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                              : 'border-gray-300 bg-white text-gray-900'
                          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        You'll receive a payment request on your UPI app
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                      selectedMethod.type === 'card'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                    }`}
                  >
                    Pay {planPrice}
                  </button>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Processing your payment...
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                    Please wait while we secure your transaction
                  </p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Payment Successful!
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                    Your {planName} has been activated
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}