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
  const [typingSpeed, setTypingSpeed] = useState(50);
  const [showMenu, setShowMenu] = useState(false);
  const [upgradeButtonDisabled, setUpgradeButtonDisabled] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [premiumPrice, setPremiumPrice] = useState("2.51$");
  const inputRef = useRef(null);

  const parseText = (inputText) => {
    const regexBold = /(\*\*.*?\*\*)/g;
    const regexNewline = /(\n)|\\n/g;
    const regexUrl = /(https?:\/\/[^\s]+)/g;
    const regexCode = /(```[\s\S]*?```)/g;
    const regexInlineCode = /(`[^`]*`)/g;
  
    const processLine = (line) => {
      return line.split(regexBold).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={index}>
              {boldText.split(regexUrl).map((text, i) => {
                return text.match(regexUrl) ? (
                  <a key={i} href={text} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                ) : (
                  <React.Fragment key={i}>{text}</React.Fragment>
                );
              })}
            </strong>
          );
        }
  
        return part.split(regexUrl).map((text, i) => {
          return text.match(regexUrl) ? (
            <a key={i} href={text} target="_blank" rel="noreferrer">
              {text}
            </a>
          ) : (
            <React.Fragment key={i}>
              {text.split(regexInlineCode).map((code, ci) => {
                return code.startsWith('`') && code.endsWith('`') ? (
                  <code key={ci} className="code-block">
                    {code.slice(1, -1)}
                  </code>
                ) : (
                  <React.Fragment key={ci}>{code}</React.Fragment>
                );
              })}
            </React.Fragment>
          );
        });
      });
    };
  
    const processCodeBlock = (codeBlock) => {
      const code = codeBlock.slice(3, -3);
      return <pre className="code-block">{code}</pre>;
    };
  
    const parts = inputText.split(regexCode);
    const processedParts = parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        return processCodeBlock(part);
      }
      return part.split(regexNewline).map((line, idx) => (
        <React.Fragment key={idx}>
          {processLine(line)}
          {/* <br /> */}
        </React.Fragment>
      ));
    });
  
    return processedParts;
  };   

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
      const typingDuration = Math.max(1000, res.data.response.length * typingSpeed);
  
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

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const changeTypingSpeed = () => {
    if (premiumPrice === "0.00$") {
      setTypingSpeed(2);
      setIsPremiumUser(true);
      localStorage.setItem('premiumUser', JSON.stringify({ status: true, expiry: Date.now() + 2592000000 }));
    }
  };  

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
  
    const redeemCode = 'MAOR-6969-6969-1UWU';
  
    if (e.target.value === redeemCode) {
      try {
        const response = await fetch('https://chatapi.louiml.net/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: redeemCode }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          setResultMessage({ text: 'Success!', color: 'green' });
          setPremiumPrice("0.00$");
          setUpgradeButtonDisabled(false);
        } else {
          setResultMessage({ text: 'Failed', color: 'red' });
          setUpgradeButtonDisabled(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setResultMessage({ text: 'Failed', color: 'red' });
        setUpgradeButtonDisabled(true);
      }
    } else if (e.target.value === "XCLSV-TESTR-AC3SS-42AI") {
          setResultMessage({ text: 'Success!', color: 'green' });
          setPremiumPrice("0.00$");
          setUpgradeButtonDisabled(false);
    } else {
      setResultMessage({ text: 'Failed', color: 'red' });
      setUpgradeButtonDisabled(true);
    }
  };
  
  const Menu = () => {
    return (
      <div className="menu">
        <div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            className='shop-menu-input'
            onChange={handleInputChange}
            placeholder="Redeem Code"
          />
          {resultMessage && (
            <span style={{ color: resultMessage.color, marginLeft: '10px' }}>
              {resultMessage.text}
            </span>
          )}
        </div>
        <span className='shop-menu-price'>{premiumPrice}</span>
        <button onClick={changeTypingSpeed} className="shop-menu-button" disabled={premiumPrice !== "0.00$"}>
          Upgrade to Premium
       </button>
       {upgradeButtonDisabled && <span className='text-info'>Coming soon</span>}
       {premiumPrice === "0.00$" && <span className='text-info'>Early access to testers</span>}
      </div>
    );
  };
  
  useEffect(() => {
    const premiumUser = JSON.parse(localStorage.getItem('premiumUser'));
    if (premiumUser && premiumUser.status && premiumUser.expiry > Date.now()) {
      setIsPremiumUser(true);
    }
    const premiumUserData = localStorage.getItem("premiumUser");
    if (premiumUserData) {
      const { status, expiry } = JSON.parse(premiumUserData);
      if (status && Date.now() < expiry) {
        setTypingSpeed(2);
        setPremiumPrice("0.00$");
      } else {
        localStorage.removeItem("premiumUser");
      }
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
    const chatWindow = document.querySelector('.chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <div className={`container${darkTheme ? ' dark-theme' : ''}`}>
      <button onClick={toggleTheme} style={{ position: 'fixed', top: '10px', right: '10px' }}>
        Toggle Theme
      </button>
      {!isPremiumUser && (
        <>
          <button onClick={toggleMenu} className='menubtn'>
            Upgrade
          </button>
          {showMenu && <Menu />}
        </>
      )}
      <div className="chat-window" id="chat-container" onScroll={handleScroll}>
        <div className="message-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
              {parseText(msg.text)}
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