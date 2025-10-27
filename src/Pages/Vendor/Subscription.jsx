import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState('daily');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user email from location state or localStorage
    const userData = location.state?.userData || JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (userData.email) {
      setUserEmail(userData.email);
    }
  }, [location]);

  const plans = [
    {
      name: 'Basic',
      subtitle: 'For individuals',
      price: billingCycle === 'daily' ? '€49' : '€588',
      period: billingCycle === 'daily' ? '/day' : '/year',
      features: ['List up to 10 products.', 'Access to basic dashboard', 'Chat with customers', 'Basic order tracking']
    },
    {
      name: 'Standard',
      subtitle: 'For medium teams',
      price: '€799',
      period: '/month',
      features: ['List up to 100 products', 'Full profile customization', 'Email support', 'Bill and Invoice Generator']
    },
    {
      name: 'Premium',
      subtitle: 'For large teams',
      price: '€7,999',
      period: '/year',
      features: ['Unlimited product listings', 'Priority chat support with customers', 'Advanced sales reports and sales.']
    }
  ];

  const handleSelectPlan = (planName) => {
    if (!userEmail) {
      toast.error('User information not found. Please register first.');
      return;
    }

    setSelectedPlan(planName);

    // Store subscription in localStorage
    const subscriptions = JSON.parse(localStorage.getItem('userSubscriptions') || '{}');
    subscriptions[userEmail] = {
      plan: planName,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      billingCycle: billingCycle
    };
    
    localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions));

    toast.success(`Successfully subscribed to ${planName} plan!`, {
      position: 'top-right',
      autoClose: 2000,
      onClose: () => {
        navigate('/vendor-dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#6B4E4E] mb-4">Subscription</h1>
          <p className="text-lg text-gray-600 mb-8">Choose your plan to access the platform</p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <button
              onClick={() => setBillingCycle('daily')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                billingCycle === 'daily'
                  ? 'bg-[#6B4E4E] text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                billingCycle === 'yearly'
                  ? 'bg-[#6B4E4E] text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-3xl shadow-lg p-8 text-center border transition duration-300 hover:scale-105 ${
                selectedPlan === plan.name 
                  ? 'bg-[#F5F1E8] border-[#6B4E4E] hover:bg-[#EDE8DC]' 
                  : 'bg-white border border-gray-200 hover:bg-gray-900'
              }`}
            >
              <h2 className="text-2xl font-bold text-[#6B4E4E] mb-2">{plan.name}</h2>
              <p className="text-gray-600 mb-6">{plan.subtitle}</p>
              <div className="mb-8">
                <p className="text-4xl font-bold text-[#6B4E4E]">{plan.price}</p>
                <p className="text-gray-500">{plan.period}</p>
              </div>
              <ul className="mb-8 space-y-4 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-3 px-6 rounded-full font-semibold transition shadow-lg ${
                  selectedPlan === plan.name
                    ? 'bg-white text-[#6B4E4E] border border-[#6B4E4E]'
                    : 'bg-[#6B4E4E] text-white hover:bg-[#5A3E3E]'
                }`}
              >
                {selectedPlan === plan.name ? 'Subscribed' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;