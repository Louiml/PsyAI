import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    if (message.trim() === '+/[clear') {
      setMessages([]);
      setMessage('');
      return;
    }

    if (message.trim() === '+/[save') {
      try {
        const chatHistory = { messages };
        const chatHistoryBlob = new Blob([JSON.stringify(chatHistory, null, 2)], { type: 'application/json' });
        const downloadUrl = URL.createObjectURL(chatHistoryBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'chat_history.json';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setMessage('');
        return;
      } catch (err) {
        console.error(err);
        alert('Failed to save chat.');
        return;
      }
    }  
  
    try {
      setTyping(true);
      const res = await axios.post('https://ironcladpurpleunits.tupac3.repl.co/api/message', { message });
      setTimeout(() => {
        console.log("%cSEARCHING!", "font-size: 45px; color: yellow; background: black;");
        setTimeout(() => {
          console.log("%ca b c d e f g h i j k l m n o p q r s t u v w x y z\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n1 2 3 4 5 6 7 8 9 0\n± ! @ # $ % ^ & * ( ) _ + - = § £ ™ ¡ ¢ ∞ § ¶ • ª º – ≠\nœ ∑ ´ ® † ¥ ¨ ˆ ø π “ ‘ å ß ∂ ƒ © ˙ ˚ ¬ … æ « ` ~ Ω ≈ ç √ ∫ ˜ µ ≤ ≥ ÷ ₩\nÈ É Ê Ë Ē Ė Ę À Á Â Ä Æ Ã Ā Ś Š Ÿ Û Ü Ù Ú Ū Î Ï Í Ī Į Ì Ô Ö Ò Ó Œ Ō Õ Ł Ž Ź Ż Ç Ć Č Ñ Ń\nè é ê ë ē ė ę à á â ä æ ã ā ś š ÿ û ü ù ú ū î ï í ī į ì ô ö ò ó œ ō õ ł ž ź ż ç ć č ñ ń", "font-size: 15px; color: white");
          setTimeout(() => {
            console.log("%cGENERATING.", "font-size: 25px; color: red");
            setTimeout(() => {
              console.log("%cANSWER IS ALMOST READY.", "font-size: 35px; color: green");
          }, 7000)
        }, 5000)
      }, 5000)
    }, 4000)
      const typingDuration = Math.max(1000, res.data.response.length * 50);
  
      setTimeout(() => {
        setMessages([...messages, { text: message, sender: 'user' }, { text: res.data.response, sender: 'ai' }]);
        setTyping(false);
      }, typingDuration);
      setMessage('');
    } catch (err) {
      console.error(err);
    }
  };  

  const toggleTheme = () => {
    const body = document.getElementById("app-body");
    setDarkTheme(!darkTheme);
    body.classList.toggle("dark-theme");
  };

  const handleScroll = (e) => {
    const chatContainer = e.target;
    const isScrolledUp = chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight - 350;
    setShowScrollButton(isScrolledUp);
  };

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    const chatWindow = document.querySelector('.chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <div className={`container${darkTheme ? ' dark-theme' : ''}`}>
      <button onClick={toggleTheme} style={{ position: 'fixed', top: '10px', right: '10px' }}>
        Toggle Theme
      </button>
      <div className="chat-window" id="chat-container" onScroll={handleScroll}>
        <div className="message-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
              {msg.text}
            </div>
          ))}
          {typing && (
            <div className="ai-message">
              <div className="typing-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef}></div>
      </div>
      <div className="input-wrapper">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          required={true}
        />
        <button onClick={sendMessage} disabled={typing}>
          Send
        </button>
      </div>
      {showScrollButton && (
        <button className="scroll-to-bottom-btn" onClick={scrollToBottom}>
          ⬇
        </button>
      )}
    </div>
  );
}

export default App;
