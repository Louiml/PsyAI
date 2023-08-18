import './App.css';
import clipboardIcon from './clipboard.svg'
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PayPal from "./components/PayPal";

const parseText = (inputText) => {
  const regexHr = /(- \* \*)/g;
  const regexNewline = /\r?\n/;
  const regexBold = /(\*\*.*?\*\*)/g;
  const regexUrl = /(https?:\/\/[^\s]+)/g;
  const regexInlineCode = /(`[^`]*`)/g;
  const regexHyphen = /^-\s+/;
  const regexHyphen2 = /^\*\s+/;
  const regexUnderline = /(_[^_]+_)/g;
  const regexImage = /^!\[(.*?)\]\((.*?)\)$/m;
  const regexSettings = /^-(payment)$/;

  const regexCodeBlock = /```(javascript|js|typescript|ts|cpp|c\+\+|cc|c|assembly|asm|ruby|lua|xml|toml|yaml|yml|ino|arduino|python|py|html|css|json|md|markdown|rs|rust|java|kotlin|)(\w*)\n([\s\S]*?)```/g;
  let codeBlocks = [];
  let match;
  while ((match = regexCodeBlock.exec(inputText)) !== null) {
    let language = match[1];
    if (language === 'cpp') language = 'cpp';
    else if (language === 'c++') language = 'cpp';
    else if (language === 'cc') language = 'cpp';
    else if (language === 'c') language = 'c';
    else if (language === 'xml') language = 'xml';
    else if (language === 'toml') language = 'toml';
    else if (language === 'yaml' || language === 'yml') language = 'yaml';
    else if (language === 'assembly') language = 'asm6502';
    else if (language === 'asm') language = 'asm6502';
    else if (language === 'lua') language = 'lua';
    else if (language === 'ruby') language = 'ruby';
    else if (language === 'js') language = 'javacript';
    else if (language === 'javacript') language = 'javacript';
    else if (language === 'ts') language = 'typescript';
    else if (language === 'typescript') language = 'typescript';
    else if (language === 'ino') language = 'ino';
    else if (language === 'arduino') language = 'ino';
    else if (language === 'python') language = 'python';
    else if (language === 'py') language = 'python';
    else if (language === 'html') language = 'html';
    else if (language === 'css') language = 'css';
    else if (language === 'json') language = 'json';
    else if (language === 'md') language = 'markdown';
    else if (language === 'markdown') language = 'markdown';
    else if (language === 'rs' || language === 'rust') language = 'rust';
    else if (language === 'java') language = 'java';
    else if (language === 'kt' || language === 'kotlin') language = 'kotlin';

    let code = match[3].split('\n').filter(line => line.trim() !== '').join('\n');

    codeBlocks.push({ language, code });
  }

  const textLanguage = (codeLanguage) => {
    let language = "";
  
    if (codeLanguage === "cpp" || codeLanguage === "c++" || codeLanguage === "cc") {
      language = "C++";
    } else if (codeLanguage === "c") {
      language = "C";
    } else if (codeLanguage === "asm6502") {
      language = "Assembly";
    } else if (codeLanguage === "javascript" || codeLanguage === "js") {
      language = "JavaScript";
    } else if (codeLanguage === "typescript" || codeLanguage === "ts") {
      language = "Typescript";
    } else if (codeLanguage === "lua") {
      language = "Lua";
    } else if (codeLanguage === "ruby") {
      language = "Ruby";
    } else if (codeLanguage === "xml") {
      language = "XML";
    } else if (codeLanguage === "toml") {
      language = "TOML";
    } else if (codeLanguage === "yaml" || codeLanguage === "yml") {
      language = "Yaml";
    } else if (codeLanguage === "ino" || codeLanguage === "arduino") {
      language = "Arduino";
    } else if (codeLanguage === "py" || codeLanguage === "python") {
      language = "Python";
    } else if (codeLanguage === "html") {
      language = "HRML";
    } else if (codeLanguage === "css") {
      language = "CSS";
    } else if (codeLanguage === "json") {
      language = "JSON";
    } else if (codeLanguage === "markdown") {
      language = "Markdown";
    } else if (codeLanguage === "rust") {
      language = "Rust";
    } else if (codeLanguage === "kt" || codeLanguage === "kotlin") {
      language = "Kotlin";
    } else if (codeLanguage === "java") {
      language = "Java";
    } else {
      language = "Code Snippet"
    }
  
    return language;
  };

  inputText = inputText.replace(regexCodeBlock, 'CODE_BLOCK_PLACEHOLDER');

  const copyCode = (code) => {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };  

    const processLine = (line) => {
      const matches = line.match(regexImage);
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
        } else if (line.match(regexHr)) {
          return (
            <React.Fragment>
              <hr />
            </React.Fragment>
          );
        } else if (line.match(regexHyphen)) {
          line = line.replace(regexHyphen, '');
          return (
            <React.Fragment>
              <strong><span className="non-select">• </span>{processLine(line)}</strong>
            </React.Fragment>
          );
        } else if (line.match(regexHyphen2)) {
          line = line.replace(regexHyphen2, '- ');
          return (
            <React.Fragment>
              <strong>{processLine(line)}</strong>
            </React.Fragment>
          );
        } else if (matches) {
          return (
            <React.Fragment>
              <img alt={matches[1]} id="image" height={180} width={280} src={matches[2]} />
            </React.Fragment>
          );
        } else if (line.match(regexSettings)) {
          return (
            <React.Fragment>
              <PayPal />
            </React.Fragment>
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
                      <React.Fragment key={ci}>
                        {code.split(regexUnderline).map((underlined, ui) => {
                          return underlined.startsWith('_') &&
                            underlined.endsWith('_') ? (
                            <u key={ui}>{underlined.slice(1, -1)}</u>
                          ) : (
                            <React.Fragment key={ui}>{underlined}</React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            });
        });
    };
    const parts = inputText.split(regexNewline);
    const processedParts = parts.map((part, index) => {
      if (part === 'CODE_BLOCK_PLACEHOLDER') {
        const codeBlock = codeBlocks.shift();
        return (
          <>
            <br />
            <div className='syntax-code-block-tab'>
              <span className='syntax-code-block-tab-text-language'>{textLanguage(codeBlock.language)}</span>
              <button
                onClick={() => copyCode(codeBlock.code)}
                className='syntax-code-block-tab-copy-code-button'
              >
                <img alt="copy" src={clipboardIcon} draggable={false} width={20} />
                copy
              </button>
            </div>
            <SyntaxHighlighter 
              className="syntax-code-block" 
              language={codeBlock.language} 
              style={gruvboxDark} 
              showLineNumbers={true}
              wrapLongLines={true}  
              key={index}
            >
              {codeBlock.code}
            </SyntaxHighlighter>
          </>
        );
      }
      return (
        <React.Fragment key={index} style={{ whiteSpace: 'pre-wrap' }}>
          {processLine(part)}
          <br />
        </React.Fragment>
      );
    });

  return processedParts;
};

  export default parseText;
