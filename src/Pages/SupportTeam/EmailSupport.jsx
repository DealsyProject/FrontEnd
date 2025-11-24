import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

function EmailSupport() {
  const form = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs
      .sendForm(
        "service_wwpm3zo",
        "template_4dq40g5",
        form.current,
        "dykdlfyKOa-08cpCY"
      )
      .then(
        (result) => {
          console.log(result.text);
          setIsLoading(false);
          setIsSent(true);
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          setIsLoading(false);
          alert("Failed to send email. Please try again later.");
        }
      );
  };

  const handleCallSupport = () => {
    window.open('tel:+1-800-332-5791');
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (isSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-3">
            Message Sent Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for contacting Dealsy support.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            We'll get back to you within 2 hours with a detailed response.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setIsSent(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Send Another Message
            </button>
            <button
              onClick={() => navigate('/support-faq-options')}
              className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium"
            >
              Browse Help Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-6 transform hover:rotate-6 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you succeed. Choose your preferred way to connect with our support team.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Contact Form</h2>
                <div className="text-sm text-gray-500">
                  Step {currentStep} of 3
                </div>
              </div>

              <form ref={form} onSubmit={sendEmail} className="space-y-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="user_name"
                          required
                          placeholder="Enter your full name"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="user_email"
                          required
                          placeholder="Enter your email"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 font-semibold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Optional phone number"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Issue Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-2">
                      <label className="block text-gray-700 font-semibold">
                        Issue Category
                      </label>
                      <select 
                        name="category"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none"
                      >
                        <option value="">Select a category</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing Issue</option>
                        <option value="account">Account Problem</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 font-semibold">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="Brief description of your issue"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Message */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-2">
                      <label className="block text-gray-700 font-semibold">
                        Detailed Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="8"
                        placeholder="Please describe your issue or question in detail. Include any error messages, steps to reproduce, or other relevant information..."
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-vertical"
                      />
                    </div>

                    <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-700">
                        Our average response time is under 2 hours. For urgent issues, consider using Live Chat.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Next
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Support Channels</h3>
              <div className="space-y-6">
                {/* Live Chat Card */}
                <div 
                  onClick={() => navigate('/customerchat')}
                  className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Live Chat</p>
                      <p className="text-gray-600 text-sm">Instant connection</p>
                      <p className="text-blue-600 text-xs font-medium">Available now</p>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div 
                  onClick={handleCallSupport}
                  className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100 hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Call Support</p>
                      <p className="text-gray-600 text-sm">7012734448</p>
                      <p className="text-green-600 text-xs font-medium">24/7 Available</p>
                    </div>
                  </div>
                </div>

                {/* FAQ Card */}
                <div 
                  onClick={() => navigate('/support-faq-options')}
                  className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Help Center</p>
                      <p className="text-gray-600 text-sm">Instant answers</p>
                      <p className="text-purple-600 text-xs font-medium">Browse articles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl shadow-2xl p-8 text-white transform hover:shadow-2xl transition-all duration-300">
              <h4 className="text-lg font-semibold mb-6">Support Performance</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-blue-100">Live Chat Response</span>
                  <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-sm">Instant</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-blue-100">Phone Wait Time</span>
                  <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-sm">Under 2 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Email Response</span>
                  <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-sm">Under 2 hours</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-blue-100 text-center">
                  🏆 Rated 4.9/5 by 10,000+ customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default EmailSupport;