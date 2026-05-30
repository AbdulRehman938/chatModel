import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll inside the chat container ONLY (no viewport shift)
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load or generate anonymous persistent userId
  useEffect(() => {
    let id = localStorage.getItem("astro_chat_user_id");
    if (!id) {
      id = "usr_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem("astro_chat_user_id", id);
    }
    setUserId(id);
  }, []);

  // Fetch chat history from DB on load
  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/history/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage }
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, userId })
      });

      if (!res.ok) {
        throw new Error("Failed to connect to chat server");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No stream reader available");
      }

      // Add a blank AI bubble and disable standard typing indicator
      setMessages((prev) => [...prev, { role: "ai", text: "" }]);
      setLoading(false);

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Parse OpenRouter's SSE format stream chunks (data: {...})
        const lines = chunk.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              const content = parsed.choices[0]?.delta?.content || "";
              accumulatedText += content;

              setMessages((prev) => {
                const updated = [...prev];
                if (updated.length > 0) {
                  updated[updated.length - 1] = { role: "ai", text: accumulatedText };
                }
                return updated;
              });
            } catch (e) {
              // Ignore JSON parse errors for incomplete/split stream chunks
            }
          }
        }
      }

    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: error.message || "Oops! Something went wrong connecting to the AI." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] w-full max-w-2xl mx-auto border border-gray-200 rounded-2xl p-4 bg-white/50 backdrop-blur-xl shadow-xl shadow-blue-900/5">
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar"
      >
        
        {/* Loading Skeleton for History */}
        {historyLoading ? (
          <div className="space-y-4 py-2">
            <div className="flex justify-end">
              <div className="bg-gray-200/60 animate-pulse h-12 w-2/3 rounded-2xl rounded-br-sm" />
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-200/60 animate-pulse h-16 w-3/4 rounded-2xl rounded-bl-sm" />
            </div>
            <div className="flex justify-end">
              <div className="bg-gray-200/60 animate-pulse h-10 w-1/2 rounded-2xl rounded-br-sm" />
            </div>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Send a message to start chatting with AI</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[80%] shadow-sm transition-all duration-300 ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white rounded-br-sm"
                    : "mr-auto bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </>
        )}

        {/* Premium Bouncing Dots Typing Indicator */}
        {loading && (
          <div className="mr-auto bg-gray-100 text-gray-500 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 max-w-[80%]">
            <span className="text-sm font-medium mr-1 text-gray-400">AI is thinking</span>
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100">
        <input
          className="flex-1 border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none p-3 rounded-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          disabled={loading || historyLoading}
        />

        <button
          onClick={sendMessage}
          disabled={loading || historyLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-6 font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20"
        >
          Send
        </button>
      </div>
    </div>
  );
}
