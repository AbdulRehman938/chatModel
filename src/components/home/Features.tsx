export default function Features() {
  const features = [
    {
      title: "Real-time Streaming",
      desc: "Experience zero latency. Messages stream word-by-word instantly from OpenRouter for a fluid, natural conversation feel.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "Conversational Memory",
      desc: "Our database connection recalls your chat logs instantly. The AI remembers the context of your conversation on every prompt.",
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bg: "bg-indigo-50 border-indigo-100",
    },
    {
      title: "Anonymous MongoDB Security",
      desc: "Absolute privacy by design. We only store anonymous run-time user IDs, preserving full GDPR/CCPA compliance.",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      bg: "bg-teal-50 border-teal-100",
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
            Engineered For Visual & Technical Excellence
          </h2>
          <p className="text-gray-500 leading-relaxed font-normal">
            AstroChat Studio combines a state-of-the-art tech stack with gorgeous designs to wow your site visitors instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl border border-gray-100 bg-white hover:border-blue-200/50 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.bg} mb-6 transition-all duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
