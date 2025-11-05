import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import {
  ChevronDown,
  Bell,
  X,
  AlertCircle,
  CheckCircle,
  Copy,
  Search,
  Moon,
  Sun,
  Send,
  Mail,
  MessageSquare,
  User,
  Loader2,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────
// 1. CONTACT FORM VALIDATION (plain JS – no Zod)
// ──────────────────────────────────────────────────────────────────────
const validateContact = (data) => {
  const errors = {};
  if (!data.name || data.name.trim().length < 2)
    errors.name = 'Name must be ≥2 characters';
  if (!data.email || !/^\S+@\S+$/.test(data.email))
    errors.email = 'Invalid email';
  if (!data.subject || data.subject.trim().length < 5)
    errors.subject = 'Subject too short';
  if (!data.message || data.message.trim().length < 10)
    errors.message = 'Message must be ≥10 characters';
  return { errors, isValid: Object.keys(errors).length === 0 };
};

// ──────────────────────────────────────────────────────────────────────
// 2. MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────
export default function Helpcenter() {
  // ── Dark mode ─────────────────────────────────────────────────────
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('help-center-dark');
    return saved === 'true';
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('help-center-dark', String(dark));
  }, [dark]);

  // ── Notifications (mock real-time) ─────────────────────────────────
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New Feature',
      message: 'Dark mode is now available!',
      time: '2 hrs ago',
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Update Successful',
      message: 'Your profile has been updated.',
      time: '5 hrs ago',
      read: true,
    },
    {
      id: 3,
      type: 'alert',
      title: 'Action Required',
      message: 'Verify your email to continue.',
      time: '1 day ago',
      read: false,
    },
  ]);

  // Simulate new notification every 30 s (demo)
  useEffect(() => {
    const id = setInterval(() => {
      const newNotif = {
        id: Date.now(),
        type: ['info', 'success', 'alert'][Math.floor(Math.random() * 3)],
        title: 'Live Update',
        message: 'A new FAQ has been added.',
        time: 'just now',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
      toast.success('New notification!');
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All cleared');
  };

  const remove = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ── FAQ data + search ─────────────────────────────────────────────
  const faqsRaw = [
    {
      id: 1,
      category: 'Account',
      question: 'How do I reset my password?',
      answer:
        'Click **Forgot Password** on the login screen → enter your email → we’ll send a secure reset link (expires in 30 min).',
      tags: ['password', 'login'],
    },
    {
      id: 2,
      category: 'Security',
      question: 'Is my data safe?',
      answer:
        'Yes. We use **end-to-end encryption**, store data on encrypted servers, and never share it without consent.',
      tags: ['privacy', 'encryption'],
    },
    {
      id: 3,
      category: 'Usage',
      question: 'Can I use the app offline?',
      answer:
        'You can view cached content. Syncing, new entries, and updates require an internet connection.',
      tags: ['offline'],
    },
    {
      id: 4,
      category: 'Billing',
      question: 'What are the subscription plans?',
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Free</strong> – Basic features, 1 GB storage
          </li>
          <li>
            <strong>Pro ($9.99/mo)</strong> – Unlimited storage, priority support
          </li>
          <li>
            <strong>Team ($29.99/mo)</strong> – Collaboration, admin tools, SSO
          </li>
        </ul>
      ),
      tags: ['pricing', 'subscription'],
    },
    {
      id: 5,
      category: 'Support',
      question: 'How do I contact support?',
      answer:
        'Use the form below or email **support@yourapp.com**. Typical response time: **4–6 hrs** (business days).',
      tags: ['contact'],
    },
  ];

  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return faqsRaw;
    const term = search.toLowerCase();
    return faqsRaw.filter(
      (f) =>
        f.question.toLowerCase().includes(term) ||
        (typeof f.answer === 'string' && f.answer.toLowerCase().includes(term)) ||
        f.tags.some((t) => t.toLowerCase().includes(term))
    );
  }, [search]);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const copyAnswer = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  // ── Contact form (react-hook-form) ───────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    const { errors: validationErrors, isValid } = validateContact(data);
    if (!isValid) {
      Object.entries(validationErrors).forEach(([key, msg]) => {
        setError(key, { message: msg });
      });
      return;
    }

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Contact form:', data);
    toast.success('Message sent – we’ll reply soon!');
    reset();
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-right" />
      <div className={`min-h-screen transition-colors ${dark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Help Center
            </h1>
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 px-4">
          {/* ── FAQ SECTION ─────────────────────────────────────── */}
          <section className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No FAQs match your search.
                </p>
              ) : (
                filteredFaqs.map((faq) => {
                  const plainAnswer =
                    typeof faq.answer === 'string'
                      ? faq.answer
                      : faq.answer.props.children
                          .map((c) => (typeof c === 'string' ? c : ''))
                          .join(' ');
                  return (
                    <div
                      key={faq.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        aria-expanded={openFaq === faq.id}
                        aria-controls={`faq-${faq.id}`}
                      >
                        <div>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            [{faq.category}]
                          </span>{' '}
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {faq.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            openFaq === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {openFaq === faq.id && (
                        <div
                          id={`faq-${faq.id}`}
                          className="px-5 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">{faq.answer}</div>
                            <button
                              onClick={() => copyAnswer(plainAnswer)}
                              className="ml-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              title="Copy answer"
                            >
                              <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {faq.tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* ── CONTACT FORM ─────────────────────────────────────── */}
            <section className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-blue-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Still need help? Contact Us
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      Name
                    </label>
                    <input
                      {...register('name')}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    {...register('subject')}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.subject.message}
                      </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </section>
          </section>

          {/* ── NOTIFICATION PANEL ───────────────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No new notifications
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.type === 'success' ? CheckCircle : AlertCircle;
                    const iconColor =
                      n.type === 'success'
                        ? 'text-green-600'
                        : n.type === 'alert'
                        ? 'text-yellow-600'
                        : 'text-blue-600';
                    const bg =
                      n.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : n.type === 'alert'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20'
                        : 'bg-blue-50 dark:bg-blue-900/20';

                    return (
                      <div
                        key={n.id}
                        className={`${bg} p-3 rounded-lg border ${
                          n.type === 'success'
                            ? 'border-green-200 dark:border-green-700'
                            : n.type === 'alert'
                            ? 'border-yellow-200 dark:border-yellow-700'
                            : 'border-blue-200 dark:border-blue-700'
                        } relative group transition`}
                        onClick={() => !n.read && markAsRead(n.id)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(n.id);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="flex gap-3">
                          <div className={`${iconColor}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-medium text-sm ${
                                n.read ? 'text-gray-500' : 'text-gray-800 dark:text-gray-100'
                              }`}
                            >
                              {n.title}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                              {n.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="mt-4 w-full text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}