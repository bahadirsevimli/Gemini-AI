import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { useState } from 'react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export function useGemini() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (userInput) => {
    try {
      const formattedMessages = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));
      
      const chatSession = model.startChat({
        generationConfig,
        history: formattedMessages,  // ✅ Doğru format!
      });

      const result = await chatSession.sendMessage(userInput);
      const botResponse = result.response.candidates[0].content.parts[0].text;
      console.log(result.response.candidates);

      setMessages((prev) => [
        ...prev,
        { role: 'user', text: userInput },
        { role: 'assistant', text: botResponse },
      ]);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };

  return { messages, sendMessage };
}



/* async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "selam"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Selam! Nasılsın?"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run(); */