import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import parseText from './parseText';
import playAudio from './icon1.svg'
import pauseAudio from './icon2.svg'
import PayPal from "./components/PayPal";
import './App.css';

  const App = () => {
      const [message, setMessage] = useState('');
      const [messages, setMessages] = useState([]);
      const [typing, setTyping] = useState(false);
      const [showScrollButton, setShowScrollButton] = useState(false);
      const bottomRef = useRef(null);
      const [speech, setSpeech] = useState(null);
      const [typingSpeed, setTypingSpeed] = useState(50);
      const [checkout, setCheckOut] = useState(true);
      const [showMenu, setShowMenu] = useState(false);
      const [setUpgradeButtonDisabled] = useState(true);
      const [apiUrl, setApiUrl] = useState('');
      const [inputValue, setInputValue] = useState('');
      const [resultMessage, setResultMessage] = useState('');
      const [isPremiumUser, setIsPremiumUser] = useState(false);
      const [premiumPrice, setPremiumPrice] = useState("4.90$ [45% OFF]");
      const [email, setEmail] = useState('');
      const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
      const [isWelcomeAfterClearVisible, setIsWelcomeAfterClearVisible] = useState(false);
      const [isOpen, setIsOpen] = useState(false);
      const [isPlaying, setIsPlaying] = useState(false);
      const [isClearMenu, setIsClearMenuOpen] = useState(false);
      const [aiMessage, setAiMessage] = useState('');
      const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
      const inputRef = useRef(null);
      const sendMessage = async () => {
        if (!message.trim()) {
          return;
        }
      
        try {
          setIsWelcomeVisible(false);
          setIsWelcomeAfterClearVisible(false);
          setTyping(true);
          const res = await axios.post(apiUrl, { message });
          const typingDuration = Math.max(1000, res.data.response.length * typingSpeed);

          setMessage('');
          
          setTimeout(() => {
            setMessages([...messages, { text: message, sender: 'user' }, { text: res.data.response, sender: 'ai' }]);
            setAiMessage(res.data.response);
            setTyping(false);
          }, typingDuration);
        } catch (err) {
          console.error(err);
        }
      };
    
      const handleClearCancel = async (e) => {
        e.preventDefault();
        setIsClearMenuOpen(false);
      }
      
      const handleClear = async (e) => {
        e.preventDefault();
        setMessages([]);
        setMessage('');
        setIsWelcomeAfterClearVisible(true);
        setIsClearMenuOpen(false);
      }
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('', { email });
          if (response.status === 200) {
            alert('sent successfully!, Thank you');
          } else {
            alert('Failed to send try again later');
          }
        } catch (error) {
          console.error(error);
          alert('Failed to send try again later');
        }
        setEmail('');
        setIsOpen(false);
        setIsSuggestionMenuOpen(false);
      };
    
      const handleScroll = (e) => {
        const chatContainer = e.target;
        const isScrolledUp = chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight - 350;
        setShowScrollButton(isScrolledUp);
      };
    
      const toggleMenu = () => {
        setShowMenu(!showMenu);
        if (isOpen) {
          setIsOpen(false);
        } else if (isSuggestionMenuOpen) {
          setIsSuggestionMenuOpen(false);
        } else if (isClearMenu) {
          setIsClearMenuOpen(false);
        } else if (isWelcomeAfterClearVisible) {
          setIsWelcomeAfterClearVisible(false);
        } else if (isWelcomeVisible) {
          setIsWelcomeVisible(false);
        }
      };
      
      const toggleEmailMenu = () => {
        setIsOpen(!isOpen);
        if (showMenu) {
          setShowMenu(false);
        } else if (isSuggestionMenuOpen) {
          setIsSuggestionMenuOpen(false);
        } else if (isClearMenu) {
          setIsClearMenuOpen(false);
        } else if (isWelcomeAfterClearVisible) {
          setIsWelcomeAfterClearVisible(false);
        } else if (isWelcomeVisible) {
          setIsWelcomeVisible(false);
        }
      };
    
      const toggleSuggestionMenu = () => {
        setIsSuggestionMenuOpen(!isSuggestionMenuOpen);
        if (showMenu) {
          setShowMenu(false);
        } else if (isOpen) {
          setIsOpen(false);
        } else if (isClearMenu) {
          setIsClearMenuOpen(false);
        } else if (isWelcomeAfterClearVisible) {
          setIsWelcomeAfterClearVisible(false);
        } else if (isWelcomeVisible) {
          setIsWelcomeVisible(false);
        }
      };
    
      const toggleClearMenu = () => {
        setIsClearMenuOpen(!isClearMenu);
        if (showMenu) {
          setShowMenu(false);
        } else if (isOpen) {
          setIsOpen(false);
        } else if (isSuggestionMenuOpen) {
          setIsSuggestionMenuOpen(false);
        } else if (isWelcomeAfterClearVisible) {
          setIsWelcomeAfterClearVisible(false);
        } else if (isWelcomeVisible) {
          setIsWelcomeVisible(false);
        }
      };
    
      const saveAction = () => {
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
    
      const openSrc = () => {
        window.open('https://github.com/funmmer/PsyAI');
      }
      const openDiscordServer = () => {
        window.open('https://discord.gg/MMsPbxbfH8');
      }
    
      const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      };
    
      const handleInputChange = async (e) => {
        setInputValue(e.target.value);
       if (e.target.value === "") {
              setResultMessage({ text: 'Success!', color: 'green' });
              setPremiumPrice("0.00$");
              setUpgradeButtonDisabled(false);
        } else {
          setResultMessage({ text: 'Failed', color: 'red' });
          setUpgradeButtonDisabled(true);
        }
      };
    
      const handleChange = (e) => {
        setEmail(e.target.value);
      };

      const exampleCode = async (e) => {
          e.preventDefault();
          setIsWelcomeAfterClearVisible(false);
          setIsWelcomeVisible(false);
          setMessage('Write an example code');
        }

        const exampleAtheism = async (e) => {
            e.preventDefault();
            setIsWelcomeAfterClearVisible(false);
            setIsWelcomeVisible(false);
            setMessage('What is Atheism?');
          }

        const example911 = async (e) => {
            e.preventDefault();
            setIsWelcomeAfterClearVisible(false);
            setIsWelcomeVisible(false);
            setMessage('9/11');
          }

        const exampletrump = async (e) => {
            e.preventDefault();
            setIsWelcomeAfterClearVisible(false);
            setIsWelcomeVisible(false);
            setMessage('Who is Donald Trump?');
          }

          const WelcomeAfterClear = () => {
            return (
              <div className='welcome-div'>
                <h1 className='welcome-text'>Welcome back to <span style={{ textDecoration: 'underline' }}>PsyAI</span></h1>
                  <h2>Examples:</h2>
                <div className='welcome-example'>
                  <button className='welcome-btn' onClick={exampleCode}>Write an example code</button>
                  <button className='welcome-btn' onClick={exampleAtheism}>What is Atheism?</button>
                  <button className='welcome-btn' onClick={example911}>9/11</button>
                  <button className='welcome-btn' onClick={exampletrump}>Who is Donald Trump?</button>
                </div>
                {isPremiumUser && (
                <>
                  <select id="apiUrl" name="apiUrl" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)}>
                    <option value="">QHU 1.0</option>
                    <option value="">QHU 0.5</option>
                    <option value="">GPT-QHU (Beta & Slow)</option>
                  </select>
              </>
              )}
              </div>
            );
          };

       const Welcome = () => {
        return (
          <div className='welcome-div'>
            <h1 className='welcome-text'>Welcome to <span style={{ textDecoration: 'underline' }}>PsyAI</span></h1>
            <div className='welcome-example'>
              <button className='welcome-btn' onClick={exampleCode}>Write an example code</button>
              <button className='welcome-btn' onClick={exampleAtheism}>What is Atheism?</button>
              <button className='welcome-btn' onClick={example911}>9/11</button>
              <button className='welcome-btn' onClick={exampletrump}>Who is Donald Trump?</button>
            </div>
            {isPremiumUser && (
            <>
              <select id="apiUrl" name="apiUrl" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)}>
                <option value="">QHU 1.0</option>
                <option value="">QHU 0.5</option>
                <option value="">GPT-QHU (Beta & Slow)</option>
              </select>
            </>
          )}
          </div>
        );
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
            {checkout ? (
              <PayPal />
            ) : (
              <button
                onClick={() => {
                  setCheckOut(true);
                }}
                className="shop-menu-button"
             >
              Try Again (Iframe Crashed)
            </button>
           )}
           {premiumPrice === "0.00$" && <span className='text-info'>Early access to testers</span>}
           <span className='span-color'>Before you buy the premium plan please read the privacy policy of purchase <a href='https://raw.githubusercontent.com/funmmer/PsyAI/main/PrivacyPolicy.md'>Privacy Policy</a></span>
          </div>
        );
      };

      const handleSpeech = async () => {
        setIsPlaying(!isPlaying);
        const speechSynthesis = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance(aiMessage);
      
        if (/[א-ת]/.test(aiMessage)) { 
          const voices = speechSynthesis.getVoices();
          const voice = voices.find((v) => v.name === 'Google נעים');
          console.log(voices);
          speech.voice = voice;
      
          speech.lang = 'he-IL';
        } else if (/[а-яА-Я]/.test(aiMessage)) {
          const voices = speechSynthesis.getVoices();
          const voice = voices.find((v) => v.lang === 'ru-RU' && v.name === 'Google русский');
          speech.voice = voice;
      
          speech.lang = 'ru-RU';
        } else if (/[ا-ي]/.test(aiMessage)) {
          const voices = speechSynthesis.getVoices();
          const voice = voices.find((v) => v.lang === 'ar-SA' && v.name === 'Microsoft Naayf');
          speech.voice = voice;
        
          speech.lang = 'ar-SA';
        } else {
          speech.lang = 'en-US';
        }
        
        setSpeech(speech);
        speechSynthesis.speak(speech);
        
        if (isPlaying) {
          speechSynthesis.pause();
        } else {
          speechSynthesis.resume();
        }

        speech.onend = () => {
          setIsPlaying(false);
        };
      };      
      
      useEffect(() => {
        const premiumUser = localStorage.getItem('premiumUser');
        if (premiumUser) {
          setTypingSpeed(2);
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
        <>
        {showMenu && <Menu />}
        <div className='right-menu'>
          {!isPremiumUser && (
            <>
              <button onClick={toggleMenu} className='menubtn'>
                Upgrade
              </button>
            </>
          )}
          <div className='right-menu-nim-buttons'>
              <button onClick={openSrc} className='srcbtn'>
                Source Code
              </button>
              <button onClick={toggleEmailMenu} className='reportbtn'>
                Report a bug
              </button>
              <button onClick={toggleClearMenu} className='clearbtn'>
                Clear the chat
              </button>
              <button onClick={saveAction} className='savebtn'>
                Save the chat
              </button>
              <button onClick={openDiscordServer} className='disverbtn'>
                Discord Server
              </button>
              <button onClick={toggleSuggestionMenu} className='suggestionbtn'>
                Suggestion
              </button>
              </div>
              </div>
              {isSuggestionMenuOpen && (
                <form onSubmit={handleSubmit} className='bugForm'>
                  <input
                    className='bugInput'
                    type="text"
                    value={email}
                    onChange={handleChange}
                    placeholder="Tell us about your suggestion"
                  />
                <button className='bugButton' type="submit">Submit</button>
              </form>
              )}
              {isOpen && (
                <form onSubmit={handleSubmit} className='bugForm'>
                  <input
                    className='bugInput'
                    type="text"
                    value={email}
                    onChange={handleChange}
                    placeholder="Tell us about the bug"
                  />
                <button className='bugButton' type="submit">Submit</button>
              </form>
              )}
              {isClearMenu && (
                  <form onSubmit={handleClear} className='clearForm'>
                  <p className='clearText'>Are you sure you want to clear the chat?</p>
                  <button className='clearButton' onClick={handleClearCancel}>Cancel</button>
                  <button className='clearButton' type="submit">Clear</button>
              </form>
              )}
          <div className="app-content">
          <div className="chat-window" id="chat-container" onScroll={handleScroll}>
            <div className="message-container">
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
                  {parseText(msg.text)}
                  {msg.sender === 'ai' && idx === messages.length - 1 && (
                    <button className='play-audio-button' onClick={handleSpeech}>
                      {isPlaying ? <img src={pauseAudio} alt='play-audio' height={35} width={35} /> : <img src={playAudio} alt='play-audio' height={35} width={35} />}
                    </button>
                  )}
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
          {isWelcomeVisible ? (
            <Welcome />
          ) : null}
          {isWelcomeAfterClearVisible ? (
            <WelcomeAfterClear />
          ) : null}
          <div className="input-wrapper">
  <textarea
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
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
        </>
    );
  };

export default App;
