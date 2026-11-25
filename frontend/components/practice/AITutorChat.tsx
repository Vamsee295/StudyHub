"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AITutorChatProps {
  questionId: string;
}

export function AITutorChat({ questionId }: AITutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI Tutor. Need help with this question?" }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const query = input.trim();
    setInput("");
    
    // Optimistically add user message
    const newMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setIsStreaming(true);

    try {
      // Add empty assistant message that will be populated via stream
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      
      const token = localStorage.getItem("pathward_access_token") || "";
      // In a real app we might get the token from supabase session properly
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/practice/questions/${questionId}/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query: query,
          chat_history: newMessages.slice(0, -1) // Exclude current query
        })
      });

      if (!response.ok) throw new Error("Failed to connect to tutor");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        // SSE lines look like: data: {"chunk": "text"} or just data: text
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            // Append to the last message (the assistant one)
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content += data;
              return updated;
            });
          }
        }
      }
    } catch (error) {
      console.error("Tutor stream error:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Sorry, I'm having trouble connecting right now.";
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-paper-2 border-t border-hair">
      <div className="flex items-center gap-2 p-3 border-b border-hair bg-card">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-paper" />
        </div>
        <h3 className="text-[13px] font-semibold text-ink">AI Tutor</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-paper-2 border-[1.5px] border-hair text-body' 
                : 'bg-accent-soft text-accent-ink'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className={`text-[13px] leading-relaxed max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-card border-[1.5px] border-hair text-ink px-3 py-2 rounded-xl rounded-tr-sm' 
                : 'text-ink pt-1 whitespace-pre-wrap'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isStreaming && messages[messages.length - 1].content === "" && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-soft text-accent-ink flex items-center justify-center shrink-0">
              <Loader2 className="w-3 h-3 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-card border-t border-hair">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder="Ask for a hint..."
            className="w-full bg-paper-2 border-[1.5px] border-hair rounded-md pl-3 pr-10 py-2 text-[13px] text-ink placeholder:text-mute focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 text-body hover:text-accent-ink disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
