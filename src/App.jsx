import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import './App.css';
import { useGemini } from './hooks/useGemini';

function App() {
  const [userInput, setUserInput] = useState('');
  const { messages, sendMessage } = useGemini();
  const [isLoading, setIsLoading] = useState(false);

  function handleChat(event) {
    setIsLoading(true);
    event.preventDefault();
    if (userInput.trim()) {
      sendMessage(userInput);
      setUserInput("");
    }
  }

  function handleChange(event) {
    const { value } = event.target;
    setUserInput(value);
  }

  useEffect(() => {
    if (messages.length > 0) {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="content">
      <div className="response-container">
        {
        messages.map((msg, index) => (
          
            <div key={index} className={`messageBalloon ${msg.role}`}>
              <ReactMarkdown>
              {msg.text}
              </ReactMarkdown>
            </div>
        ))
        }
      </div>

      <div className="input-container">
      {isLoading && <p className="loading">Loading...</p>}
        <form onSubmit={handleChat}>
          <input name="user-input" onChange={handleChange} value={userInput} />
          <button>Ask</button>
        </form>
      </div>
    </div>
  );
}

export default App;