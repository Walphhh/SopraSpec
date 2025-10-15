"use client";

import { useState, useRef } from "react";
import { BotMessageSquare, CircleX } from "lucide-react";

export default function SopraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Button - Only show when chatbox is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#0072CE] text-white p-4 rounded-full shadow-lg hover:bg-[#005fa3] transition z-50"
        >
          <BotMessageSquare size={25} />
        </button>
      )}

      {/* Backdrop + Chat Box */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={handleClickOutside}>
          <div
            ref={chatRef}
            className="absolute bottom-0 right-6 w-[400px] h-[450px] bg-white border border-gray-300 rounded-t-lg shadow-lg flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-[#0072CE] text-white rounded-t-lg">
              <span className="font-semibold">Woodsy</span>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer transition hover:text-red-400"
              >
                <CircleX size={30} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="flex items-start space-x-2">
                <img
                  src="/sopra-avatar.png"
                  alt="SOPRA Avatar"
                  className="w-20 h-20 rounded-full border border-[#0072CE] object-cover"
                />
                <div className="bg-gray-100 rounded-lg text-sm max-w-[80%]">
                  <p>
                    Hello! I'm <strong>Woodsy</strong>, your personal project
                    assistant. I’ll be available soon to help you with your
                    projects. Stay tuned!
                  </p>
                </div>
              </div>
            </div>

            {/* Input (disabled) */}
            <div className="border-t p-2">
              <input
                type="text"
                placeholder="Type a message..."
                disabled
                className="w-full p-2 border rounded text-gray-400 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
