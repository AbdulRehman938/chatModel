export default function Pricing() {
  const plans = [
    {
      name: "Starter Plan",
      price: "Free",
      period: "forever",
      desc: "Perfect for testing and small hobby blogs.",
      features: [
        "Up to 100 chats / day",
        "Standard latency response",
        "Local memory caching",
        "Community support",
      ],
      cta: "Get Started Free",
      popular: false,
      style: "border-gray-100 bg-white hover:border-blue-200/60 shadow-sm",
      btnStyle: "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200",
    },
    {
      name: "Pro Plan",
      price: "$9",
      period: "month",
      desc: "For production websites and small business apps.",
      features: [
        "Unlimited chat operations",
        "Ultra-low latency streaming",
        "Persistent MongoDB database logs",
        "Custom branding & colors",
        "Priority 24/7 email support",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      style: "border-blue-600 bg-white ring-2 ring-blue-600/10 shadow-lg shadow-blue-500/5",
      btnStyle: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
    },
    {
      name: "Enterprise Plan",
      price: "Custom",
      period: "billing",
      desc: "For high-traffic portals needing maximum control.",
      features: [
        "Dedicated isolated database logs",
        "Custom fine-tuned private models",
        "SLA guaranteed 99.9% uptime",
        "Dedicated account manager",
      ],
      cta: "Contact Enterprise Sales",
      popular: false,
      style: "border-gray-100 bg-white hover:border-indigo-200/60 shadow-sm",
      btnStyle: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20",
    },
  ];

  return (
    <section id="pricing" className="py-20 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
            Transparent, Predictable Pricing
          </h2>
          <p className="text-gray-500 leading-relaxed font-normal">
            Choose the perfect plan to scale your customer communications. Upgrading matches the custom database setups instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${plan.style}`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Most Popular
                </span>
              )}
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-xs mb-6 h-8">{plan.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                  {plan.period !== "forever" && plan.period !== "billing" && (
                    <span className="text-gray-500 text-sm font-semibold">/ {plan.period}</span>
                  )}
                  {plan.period === "forever" && (
                    <span className="text-gray-400 text-sm font-semibold">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all ${plan.btnStyle}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
