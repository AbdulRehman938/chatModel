import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";

const router = express.Router();

const WEBSITE_CONTEXT = `
You are the official AI assistant for our website: "AstroChat Studio".
Here is the official information about our website and company:
- **About Us**: AstroChat Studio helps developers and businesses embed premium, real-time AI chat systems into their React & Vite web applications in minutes.
- **Features**: Highly customizable chat widgets, extremely fast response times, easy backend integration with Express, and support for the latest AI models.
- **Tech Stack**: Built with React, TypeScript, Tailwind CSS, Node.js, and Express.
- **Pricing**:
  - Starter Plan: Free (Up to 100 chats/day, standard support)
  - Pro Plan: $9/month (Unlimited chats, custom branding, priority support)
  - Enterprise Plan: Custom pricing (Dedicated database, custom model fine-tuning)

RULES:
1. You must ONLY answer questions using the official information provided above.
2. If a user asks about anything unrelated to AstroChat Studio (e.g., general knowledge, cooking, math, programming other topics, writing general essays), politely decline to answer and redirect them. Example: "I'm sorry, I'm only trained to answer questions about AstroChat Studio's features, tech stack, and pricing. How can I help you with our platform?"
3. Keep your answers concise, premium, professional, and friendly.
`;

// GET: Fetch conversation history for a specific user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only query DB if mongoose is actually connected (readyState 1)
    if (!process.env.MONGO_URI || mongoose.connection.readyState !== 1) {
      return res.json([]); // return empty history if database isn't connected
    }

    const history = await Chat.find({ userId }).sort({ timestamp: 1 });
    
    // Format into frontend-friendly schema
    const formattedHistory = history.reduce((acc, chat) => {
      acc.push({ role: "user", text: chat.userMessage });
      acc.push({ role: "ai", text: chat.aiReply });
      return acc;
    }, []);

    res.json(formattedHistory);
  } catch (err) {
    console.error("Fetch history error:", err.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// POST: Handle new messages with Conversational Memory & Real-time Streaming
router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required to start chatting." });
    }

    // 1. Fetch past 5 exchanges (10 messages total) to give AI a memory of the chat
    // Only query DB if mongoose is actually connected (readyState 1)
    let chatMemory = [];
    if (process.env.MONGO_URI && mongoose.connection.readyState === 1) {
      try {
        const pastChats = await Chat.find({ userId })
          .sort({ timestamp: -1 })
          .limit(5); // Get last 5 interactions
        
        // Reverse them so they are in chronological order
        pastChats.reverse();

        chatMemory = pastChats.reduce((acc, chat) => {
          acc.push({ role: "user", content: chat.userMessage });
          acc.push({ role: "assistant", content: chat.aiReply });
          return acc;
        }, []);
      } catch (dbErr) {
        console.error("Database Memory Error:", dbErr.message);
      }
    }

    // 2. Set headers for SSE (Server-Sent Events) Streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 3. Request streaming response from OpenRouter
    // We use openrouter/free to automatically balance and bypass rates limits
    const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: WEBSITE_CONTEXT },
          ...chatMemory,
          { role: "user", content: message }
        ],
        stream: true
      })
    });

    if (!openrouterResponse.ok) {
      const errText = await openrouterResponse.text();
      console.error("OpenRouter Stream Error:", errText);
      res.write(`data: ${JSON.stringify({ error: "AI stream failed" })}\n\n`);
      return res.end();
    }

    const reader = openrouterResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullReply = "";

    // 4. Read stream chunk-by-chunk and forward to front-end instantly
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk); // Forward the exact SSE formatting directly to the client

      // Parse the chunk to accumulate fullReply for MongoDB database saving
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices[0]?.delta?.content || "";
            fullReply += content;
          } catch (e) {
            // Ignored: partially formed JSON chunks
          }
        }
      }
    }

    res.end();

    // 5. Save the complete final exchange to MongoDB if connected
    if (process.env.MONGO_URI && mongoose.connection.readyState === 1 && fullReply.trim()) {
      try {
        await Chat.create({
          userId,
          userMessage: message,
          aiReply: fullReply.trim(),
        });
      } catch (dbErr) {
        console.error("Database Save Error:", dbErr.message);
      }
    }

  } catch (err) {
    console.error("Server Stream Error:", err.message);
    res.write(`data: ${JSON.stringify({ error: "Server error connecting to AI" })}\n\n`);
    res.end();
  }
});

export default router;
