import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Pricing from "../components/home/Pricing";
import Footer from "../components/home/Footer";
import ChatBox from "../components/chat/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/30 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main>
        {/* Visual Hero Intro */}
        <Hero />

        {/* Live Interactive Sandbox / Demo Widget */}
        <section id="demo" className="py-16 px-6 relative bg-gradient-to-b from-transparent to-gray-50/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                Experience the Sandbox demo
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                Test the chat box below! It has smart memory (MongoDB connected), real-time streaming, and has been grounded to answer questions specifically about AstroChat Studio.
              </p>
            </div>

            {/* Chatbox Widget Container with Premium Mockup frame styling */}
            <div className="rounded-3xl border border-gray-200/80 bg-white/40 p-4 sm:p-6 shadow-2xl shadow-blue-900/5 backdrop-blur-xl relative">
              {/* Window Dots to look like a premium interface mockup */}
              <div className="absolute top-5 left-6 flex gap-1.5 hidden sm:flex">
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="text-center text-xs text-gray-400 mb-6 font-semibold tracking-wide uppercase">
                AstroChat Live Widget Sandbox
              </div>
              <ChatBox />
            </div>
          </div>
        </section>

        {/* Feature Value Grid */}
        <Features />

        {/* Pricing Table (Matches system prompt) */}
        <Pricing />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}