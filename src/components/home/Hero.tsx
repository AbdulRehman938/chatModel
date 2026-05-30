export default function Hero() {
  return (
    <div className="relative pt-20 pb-16 overflow-hidden">
      {/* Background blobs for premium depth */}
      <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40 mix-blend-multiply animate-pulse" />
      <div className="absolute top-10 right-1/4 -z-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30 mix-blend-multiply animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="text-center px-6 max-w-4xl mx-auto">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-8 animate-fade-in shadow-sm shadow-blue-100/20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          <span>Introducing Streaming & MongoDB Integration</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          Premium AI Chat Systems{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            For Your Web Apps
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Embed beautiful, real-time streaming AI widgets into your React & Express projects in minutes. Save chat history anonymously with MongoDB Atlas.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-500/25 text-center"
          >
            Start Chatting Now
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl transition-all border border-gray-200 shadow-sm text-center"
          >
            Explore Features
          </a>
        </div>
      </div>
    </div>
  );
}
