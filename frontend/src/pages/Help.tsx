export default function Help() {
  const faqs = [
    {
      question: "How do I interpret the risk signals in the dashboard?",
      answer: "Risk signals are AI-generated indicators based on employee patterns including performance, engagement, and tenure data. Red indicators require immediate attention, while orange indicates monitoring needed."
    },
    {
      question: "What does the attrition risk score mean?",
      answer: "The attrition risk score predicts the likelihood of an employee leaving within the next 6 months. It's calculated using machine learning algorithms that analyze historical patterns, performance metrics, and engagement scores."
    },
    {
      question: "How is the skills assessment calculated?",
      answer: "Skills proficiency is calculated based on self-assessments, peer reviews, project outcomes, and training completion rates. The system aggregates these data points to provide team-level skill insights."
    },
    {
      question: "Can I export dashboard data?",
      answer: "Yes, most dashboard data can be exported to CSV or PDF formats. Look for the export button in the top-right corner of each section."
    },
    {
      question: "How often is the data updated?",
      answer: "Dashboard data is updated in real-time for most metrics. Performance and engagement data is typically refreshed weekly, while budget information is updated monthly."
    },
    {
      question: "Who has access to sensitive employee data?",
      answer: "Access is role-based. HR personnel see company-wide data, leaders see their department data, and managers see their direct reports only. All access is logged and audited."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-xl">❓</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600">Find answers to common questions and get support</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Guide</h3>
            <p className="text-sm text-gray-600 mb-4">Comprehensive documentation for all features</p>
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View Guide →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Start Chat →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 text-xl">🎥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600 mb-4">Watch step-by-step video guides</p>
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Watch Videos →
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100">
        <div className="px-6 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">Still need help?</h3>
          <p className="text-primary-700 text-sm mb-4">
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors">
              Contact Support
            </button>
            <button className="bg-white text-primary-700 px-6 py-3 rounded-xl font-medium hover:bg-primary-50 transition-colors border border-primary-200">
              Email Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 