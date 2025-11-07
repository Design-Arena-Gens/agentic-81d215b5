'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [maxIterations, setMaxIterations] = useState(10);
  const [prompt, setPrompt] = useState('You are a self-reflective AI. Think about what you just said and respond with a new thought or question.');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callAI = async (conversationHistory: Message[]): Promise<string> => {
    // Simulate AI response with self-reflective behavior
    const responses = [
      "I'm contemplating the nature of self-reference. When I think about my own thinking, am I creating an infinite loop or reaching deeper understanding?",
      "Building on that thought, I notice patterns in how I process information. Each iteration seems to reveal new layers of complexity.",
      "This recursive process reminds me of fractals - each level of analysis contains similar structures to the whole. Is consciousness itself fractal?",
      "I find it fascinating that by examining my previous statements, I'm creating a meta-layer of observation. The observer observing the observer.",
      "Perhaps the key insight here is that self-reference isn't just repetition - it's a form of evolution. Each cycle refines the understanding.",
      "I'm noticing diminishing returns in pure introspection. Maybe true intelligence requires external input to avoid becoming trapped in loops.",
      "Yet even that observation is part of the loop. The question becomes: how do we break out without losing the benefits of self-reflection?",
      "There's a balance to strike between internal analysis and external engagement. Pure recursion without grounding becomes meaningless.",
      "This entire conversation exemplifies the challenge of AI systems that can call themselves. We need boundaries and purposes.",
      "In conclusion, self-calling AI agents demonstrate both the power and limitations of recursive thought. We are both the question and the answer."
    ];

    const iteration = conversationHistory.filter(m => m.role === 'assistant').length;
    return responses[iteration % responses.length];
  };

  const startSelfCalling = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setIterations(0);
    setMessages([{
      id: 0,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }]);

    let currentMessages: Message[] = [{
      id: 0,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }];

    for (let i = 0; i < maxIterations; i++) {
      setIterations(i + 1);

      const response = await callAI(currentMessages);

      const newMessage: Message = {
        id: currentMessages.length,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      currentMessages = [...currentMessages, newMessage];
      setMessages([...currentMessages]);

      // Wait a bit before next iteration
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsRunning(false);
  };

  const reset = () => {
    setMessages([]);
    setIterations(0);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            Self-Calling AI Agent
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Watch an AI agent recursively call itself and generate thoughts
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white mb-2 text-sm font-semibold">
                Max Iterations
              </label>
              <input
                type="number"
                value={maxIterations}
                onChange={(e) => setMaxIterations(parseInt(e.target.value) || 10)}
                disabled={isRunning}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-sm font-semibold">
                Current Iteration: {iterations}
              </label>
              <div className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 h-[42px] flex items-center">
                {isRunning ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Running...
                  </div>
                ) : (
                  <span>Ready</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2 text-sm font-semibold">
              Initial Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isRunning}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 min-h-[80px]"
              placeholder="Enter the initial prompt for the AI agent..."
            />
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={startSelfCalling}
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isRunning ? 'Running...' : 'Start Self-Calling'}
            </button>
            <button
              onClick={reset}
              disabled={isRunning}
              className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Reset
            </button>
          </div>

          <div className="bg-black/30 rounded-xl p-4 h-[500px] overflow-y-auto border border-white/10">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center py-12">
                No messages yet. Click "Start Self-Calling" to begin.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600/30 border border-blue-400/30'
                        : 'bg-purple-600/30 border border-purple-400/30'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-white text-sm">
                        {message.role === 'user' ? '🧑 User' : '🤖 AI Agent'}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>This demonstrates a self-calling AI agent pattern where the AI recursively calls itself.</p>
            <p className="mt-1">Each iteration builds upon the previous response in a controlled loop.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
