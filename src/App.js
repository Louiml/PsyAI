import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import parseText from './parseText';
import playAudio from './icon1.svg'
import pauseAudio from './icon2.svg'
import PayPal from "./components/PayPal";
import Select from 'react-select'
import './App.css';

  const App = () => {
      const [message, setMessage] = useState('');
      const [messages, setMessages] = useState([]);
      const [typing, setTyping] = useState(false);
      const [showScrollButton, setShowScrollButton] = useState(false);
      const bottomRef = useRef(null);
      const [speech, setSpeech] = useState(null);
      const [typingSpeed, setTypingSpeed] = useState(15);
      const [checkout, setCheckOut] = useState(true);
      const [showMenu, setShowMenu] = useState(false);
      const [setUpgradeButtonDisabled] = useState(true);
      const [apiUrl, setApiUrl] = useState('');
      const [inputValue, setInputValue] = useState('');
      const [resultMessage, setResultMessage] = useState('');
      const [isPremiumUser, setIsPremiumUser] = useState(false);
      const [premiumPrice, setPremiumPrice] = useState("14.90$ (2 Months)");
      const [email, setEmail] = useState('');
      const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
      const [isWelcomeAfterClearVisible, setIsWelcomeAfterClearVisible] = useState(false);
      const [isOpen, setIsOpen] = useState(false);
      const [isPlaying, setIsPlaying] = useState(false);
      const [isClearMenu, setIsClearMenuOpen] = useState(false);
      const [aiMessage, setAiMessage] = useState('');
      const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
      const inputRef = useRef(null);
      const [isMenuVisible, setMenuVisible] = useState(true);
      const [modelChooseName, setModelChooseName] = useState("");

      const toggleMenuVisible = () => {
        setMenuVisible(!isMenuVisible);
      };

      const optionsPremium = [
        
      ]

      const nonOptionsPremium = [
        
      ]

      const customStyles = {
        control: (base, state) => ({
          ...base,
          background: "#2C2C2C",
          borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
          borderColor: state.isFocused ? "#4D90FE" : "#666",
          boxShadow: state.isFocused ? null : null,
          "&:hover": {
            borderColor: state.isFocused ? "#4D90FE" : "#666",
          },
        }),
        menu: (base) => ({
          ...base,
          borderRadius: 0,
          hyphens: "auto",
          marginTop: 0,
          textAlign: "left",
          wordWrap: "break-word",
          padding: "5px",
          backgroundColor: "#2C2C2C",
          color: "white",
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          return {
            ...styles,
            backgroundColor: isDisabled
              ? null
              : isSelected
              ? "#4D90FE"
              : isFocused
              ? "#666"
              : null,
            color: isDisabled
              ? "#ccc"
              : isSelected
              ? "white"
              : "white",
            cursor: isDisabled ? "not-allowed" : "default",
            ":active": {
              ...styles[":active"],
              backgroundColor: !isDisabled && (isSelected ? "#4D90FE" : "#666"),
            },
          };
        },
        singleValue: (base) => ({
          ...base,
          color: "white",
        }),
        input: (base) => ({
          ...base,
          color: "white",
        }),
      };

      const sendMessage = async () => {
        if (!message.trim()) {
          return;
        }

        if (message.length > 3153) {
          console.error("Error: The message length exceeds the maximum limit of characters.");
          alert("Error: The message length exceeds the maximum limit of characters.");
          return;
      }
    
        if (message.trim() === '+/[clear') {
          setMessages([]);
          setMessage('');
          return;
        }

        if (message.trim() === '+/[reportmenu') {
          setIsOpen(true);
          setIsClearMenuOpen(false);
          setIsSuggestionMenuOpen(false);
          setIsWelcomeVisible(false);
          setShowMenu(false);
          setIsWelcomeAfterClearVisible(false);
          setMessage('');
          return;
        } else if (message.trim() === '+/[clearmenu') {
          setIsClearMenuOpen(true);
          setIsOpen(false);
          setIsSuggestionMenuOpen(false);
          setShowMenu(false);
          setIsWelcomeVisible(false);
          setIsWelcomeAfterClearVisible(false);
          setMessage('');
          return;
        } else if (message.trim() === '+/[suggestionmenu') {
          setIsSuggestionMenuOpen(true);
          setIsOpen(false);
          setIsClearMenuOpen(false);
          setShowMenu(false);
          setIsWelcomeVisible(false);
          setIsWelcomeAfterClearVisible(false);
          setMessage('');
          return;
        } else if (message.trim() === '+/[welcomemenu') {
          setIsSuggestionMenuOpen(false);
          setIsOpen(false);
          setIsClearMenuOpen(false);
          setShowMenu(false);
          setIsWelcomeVisible(true);
          setIsWelcomeAfterClearVisible(false);
          setMessage('');
          return;
        } else if (message.trim() === '+/[welcomeafterclearmenu') {
          setIsSuggestionMenuOpen(false);
          setIsOpen(false);
          setIsClearMenuOpen(false);
          setIsWelcomeVisible(false);
          setShowMenu(false);
          setIsWelcomeAfterClearVisible(true);
          setMessage('');
          return;
        } else if (message.trim() === '+/[upgrademenu') {
          setIsSuggestionMenuOpen(false);
          setIsOpen(false);
          setIsClearMenuOpen(false);
          setIsWelcomeVisible(false);
          setShowMenu(true);
          setIsWelcomeAfterClearVisible(false);
          setMessage('');
          return;
        }

        if (message.trim() === '') {
          const premiumUser = localStorage.getItem('premiumUser');
          if (premiumUser) {
            setIsPremiumUser(false);
            localStorage.removeItem('premiumUser');
            setMessage('');
            window.location.reload();  
          }
          else {
            localStorage.setItem('premiumUser', JSON.stringify({ status: true, expiry: Date.now() + 5184000000 }));
            setMessage('');
            window.location.reload();  
            return;
          }
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
          const response = await axios.post('https://chatesender.louiml.net/api/send-email', { email });
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
        window.open('https://github.com/louiml/PsyAI');
      }
      const openDiscordServer = () => {
        window.open('https://discord.gg/yRbxpA4uGR');
      }
    
      const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      };
    
      const handleInputChange = async (e) => {
        setInputValue(e.target.value);
        setResultMessage({ text: 'Failed', color: 'red' });
        setUpgradeButtonDisabled(true);
      };
    
      const handleChange = (e) => {
        setEmail(e.target.value);
      };

      const exampleCode = async (e) => {
          e.preventDefault();
          setMessage("Write an example code");
          setIsWelcomeAfterClearVisible(false);
          setIsWelcomeVisible(false);
          sendMessage(message);
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
                {isPremiumUser && (
                <>
                  <span className='premium-tag'>Premium</span>
                </>
                )}
                <div className='welcome-example-div'>
                  <h2>Examples:</h2>
                  <div className='welcome-example'>
                    <button className='welcome-btn' onClick={exampleCode}>Write an example code</button>
                    <button className='welcome-btn' onClick={exampleAtheism}>What is Atheism?</button>
                    <button className='welcome-btn1' onClick={example911}>9/11</button>
                    <button className='welcome-btn1' onClick={exampletrump}>Who is Donald Trump?</button>
                  </div>
                </div>
                {!isPremiumUser && (
                <>
                  <Select 
                  styles={customStyles}
                  className='modelSelect' 
                  options={nonOptionsPremium} 
                  value={nonOptionsPremium.find(option => option.value === apiUrl)}
                  onChange={(selectedOption) => {
                    setApiUrl(selectedOption.value);
                    setModelChooseName(selectedOption.label);
                  }} 
                />
              </>
              )}
                {isPremiumUser && (
                <>
                 <Select 
                  styles={customStyles} 
                  className='modelSelect' 
                  options={optionsPremium} 
                  value={optionsPremium.find(option => option.value === apiUrl)}
                  onChange={(selectedOption) => {
                    setApiUrl(selectedOption.value);
                    setModelChooseName(selectedOption.label);
                  }} 
                />
              </>
              )}
              <p className='notice'><strong className='notice-strong'>NOTICE:</strong> Many of our servers are currently undergoing a transition phase. During this time, they will be temporarily unavailable. We appreciate your understanding and patience as we work to enhance our infrastructure. Should you have any questions or concerns, please do not hesitate to contact our support team. Thank you for your cooperation.</p>
              </div>
            );

          };

       const Welcome = () => {
        return (
          <div className='welcome-div'>
            <h1 className='welcome-text'>Welcome to <span style={{ textDecoration: 'underline' }}>PsyAI</span></h1>
            {isPremiumUser && (
              <>
                <span className='premium-tag'>Premium</span>
              </>
            )}
                <div className='welcome-example-div'>
                  <h2>Examples:</h2>
                  <div className='welcome-example'>
                    <button className='welcome-btn' onClick={exampleCode}>Write an example code</button>
                    <button className='welcome-btn' onClick={exampleAtheism}>What is Atheism?</button>
                    <button className='welcome-btn1' onClick={example911}>9/11</button>
                    <button className='welcome-btn1' onClick={exampletrump}>Who is Donald Trump?</button>
                  </div>
                </div>
            {!isPremiumUser && (
                <>
                  <Select 
                  styles={customStyles}
                  className='modelSelect' 
                  options={nonOptionsPremium} 
                  value={nonOptionsPremium.find(option => option.value === apiUrl)}
                  onChange={(selectedOption) => {
                    setApiUrl(selectedOption.value);
                    setModelChooseName(selectedOption.label);
                  }} 
                />
              </>
              )}
            {isPremiumUser && (
            <>
                <Select 
                  styles={customStyles}
                  className='modelSelect' 
                  options={optionsPremium} 
                  value={optionsPremium.find(option => option.value === apiUrl)}
                  onChange={(selectedOption) => {
                    setApiUrl(selectedOption.value);
                    setModelChooseName(selectedOption.label);
                  }} 
                />
            </>
          )}
          <p className='notice'><strong className='notice-strong'>NOTICE:</strong> Many of our servers are currently undergoing a transition phase. During this time, they will be temporarily unavailable. We appreciate your understanding and patience as we work to enhance our infrastructure. Should you have any questions or concerns, please do not hesitate to contact our support team. Thank you for your cooperation.</p>
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
           <span className='span-color'>Before you buy the premium plan please read the privacy policy of purchase <a href='https://raw.githubusercontent.com/louiml/PsyAI/main/PrivacyPolicy.md'>Privacy Policy</a></span>
          </div>
        );
      };

      const handleSpeech = async () => {
        setIsPlaying(!isPlaying);
      
        const getVoice = (langCode) => {
          const voices = window.speechSynthesis.getVoices();
          return voices.find((v) => v.lang === langCode);
        };
      
        const speechSynthesis = window.speechSynthesis;
      
        let cleanedMessage = aiMessage.replace(/(\*|```python|```javascript|```c\+\+|```c#|```c|```rust|```java|```assembly|```typescript|```output)/g, ' ');
      
        const speech = new SpeechSynthesisUtterance(cleanedMessage);
      
        if (/[א-ת]/.test(aiMessage)) speech.voice = getVoice('he-IL');
        else if (/[日-月]/.test(aiMessage)) { speech.voice = getVoice('ja-JP', 'Google 日本人') }
        else if (/[ا-ي]/.test(aiMessage)) { speech.voice = getVoice('ar-SA', 'Microsoft Naayf') }
        else if (/[가-힣]/.test(aiMessage)) { speech.voice = getVoice('ko-KR', 'Google 한국의') }
        else if (/[äöüß]/.test(aiMessage)) { speech.voice = getVoice('de-DE', 'Google Deutsch') }
        else if (/[ğüşöçİ]/.test(aiMessage)) {speech.voice = getVoice('tr-TR', 'Google Türk') }
        else if (/[éèêëàâîïôùûüÿç]/.test(aiMessage)) { speech.voice = getVoice('fr-FR', 'Google Français') }
        else if (/[áéíóúüñ]/.test(aiMessage)) { speech.voice = getVoice('es-ES', 'Google Español') }
        else if (/[а-яА-ЯЁё]/.test(aiMessage)) speech.voice = getVoice('ru-RU');
        else if (/[Α-Ωα-ω]/.test(aiMessage)) speech.voice = getVoice('el-GR');
        else if (/[一-龯]/.test(aiMessage)) speech.voice = getVoice('zh-CN'); 
        else if (/[ह-ॿ]/.test(aiMessage)) speech.voice = getVoice('hi-IN');
        else if (/[粵-鵱]/.test(aiMessage)) speech.voice = getVoice('zh-HK');
        else if (/[ạảầẩậấẫắằẳặẵ]/.test(aiMessage)) speech.voice = getVoice('vi-VN');
        else if (/[म-ह]/.test(aiMessage)) speech.voice = getVoice('mr-IN');
        else if (/[ఁ-౯]/.test(aiMessage)) speech.voice = getVoice('te-IN');
        else if (/[஀-௿]/.test(aiMessage)) speech.voice = getVoice('ta-IN');
        else if (/[י-ײֿ]/.test(aiMessage)) speech.voice = getVoice('yi');
        else if (/[áàãâéêíóõôúç]/.test(aiMessage)) speech.voice = getVoice('pt-PT');
        else speech.lang = 'en-US'; 

        setSpeech(speech);

        if (isPlaying) {
          speechSynthesis.cancel();
        } else {
          speechSynthesis.speak(speech); 
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
            <div className='model-name'>
              <span className='model-name-text'>{modelChooseName}</span>
            </div>
          <div className='menu-positions'>
          <div className='right-menu'>
      {isMenuVisible && !isPremiumUser && (
        <>
          <button onClick={toggleMenu} className='menubtn'>
            Upgrade
          </button>
        </>
      )}
      {isMenuVisible && (
        <>
          <div className='hidebtn'><button className='hidebtnposition' onClick={toggleMenuVisible} alt="f">
            ❌ 
          </button></div>
        </>
      )}
      {!isMenuVisible && (
        <div className='showbtn'><button className='showbtnposition' onClick={toggleMenuVisible}>
          👁
        </button></div>
      )}
      {isMenuVisible && (
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
      )}
    </div>
    </div>
    <div className="message-container">
    {messages.map((msg, idx) => (
  <div key={idx} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
    {msg.sender === 'user' ? (
      <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
    ) : (
      parseText(msg.text)
    )}
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
          if (apiUrl === '' ) {
              console.log("Disabled");
              e.preventDefault();
          } else {
              e.preventDefault();
              sendMessage();
          }
      } 
  }}  
    required={true}
  />
  <button 
  onClick={sendMessage} 
  disabled={typing || apiUrl === ''}
  style={typing || apiUrl === '' ? {cursor: "not-allowed", backgroundColor: "#333"} : {}}
>
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
