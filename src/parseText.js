import './App.css';
import React from "react";

const parseText = (inputText) => {
    const regexBold = /(\*\*.*?\*\*)/g;
    const regexNewline = /(\n)|\\n/g;
    const regexUrl = /(https?:\/\/[^\s]+)/g;
    const regexCode = /(```[\s\S]*?```)/g;
    const regexInlineCode = /(`[^`]*`)/g;
    const regexHyphen = /^-\s+/;
    const regexUnderline = /(_[^_]+_)/g;
    const regexTableLine = /^\|.*\|$/;
    const regexImage = /^!\[(.*?)\]\((.*?)\)$/;
    const regexSettings = /^-(settings)$/;

    const processTable = (tableLines) => {
      return (
        <table>
          <tbody>
            {tableLines.map((line, idx) => (
              <tr key={idx}>
                {line
                  .split('|')
                  .filter((cell) => cell.trim() !== '')
                  .map((cell, jdx) => (
                    <td key={jdx}>{cell.trim()}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
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
        } else if (regexTableLine.test(line)) {
          const tableLines = [line];
          while (regexTableLine.test(line)) {
            line = line.substr(line.indexOf('\n') + 1);
            if (line) {
              tableLines.push(line);
            } else {
              break;
            }
          }
          return processTable(tableLines);
        } else if (line.match(regexHyphen)) {
          line = line.replace(regexHyphen, '• ');
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
  
    const processCodeBlock = (codeBlock) => {
      const code = codeBlock.slice(3, -3);
      // const p = document.createElement('p');
      const header = (
        <div className="code-header">
          <u>Code snippet</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(3, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
          // ref={ref} onMouseEnter={() => {
          //   p.textContent = 'Copy Code';
          //   p.className = 'copy-code-text';
          //   document.body.appendChild(p);
          // }} onMouseLeave={() => {
          //   document.body.removeChild(p);
          // }}  
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockCMD = (codeBlock) => {
      const codeLines = codeBlock.slice(7, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('REM')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>Console Command</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(7, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockJS = (codeBlock) => {
      const codeLines = codeBlock.slice(6, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('//')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>JavaScript</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(6, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockJava = (codeBlock) => {
      const codeLines = codeBlock.slice(8, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('//')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>Java</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(8, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockAsm = (codeBlock) => {
      const codeLines = codeBlock.slice(7, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith(';')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>Assembly</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(7, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockCs = (codeBlock) => {
      const codeLines = codeBlock.slice(6, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('//')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>C#</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(6, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockCpp = (codeBlock) => {
      const codeLines = codeBlock.slice(7, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('//')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          const words = line.split(' ');
          const highlightedWords = words.map((word, j) => {
            if (word.includes('int') || word.includes('return') || word.includes('void') || word.includes('double') || word.includes('float') || word.includes('const') || word.includes('char') || word.includes('using') || word.includes('namespace')) {
              return <span key={j} style={{ color: '#2e95d3' }}>{word} </span>;
            } else if (word.includes('()')) {
              return <span key={j} style={{ color: '#da2737' }}>{word} </span>;
            } else if (word.includes('#include')) {
              return <span key={j} style={{ color: '#e9950c' }}>{word} </span>;
            } else if (word.includes('1') || word.includes('2') || word.includes('3') || word.includes('4') || word.includes('5') || word.includes('6') || word.includes('7') || word.includes('8') || word.includes('9') || word.includes('0')) {
              return <span key={j} style={{ color: '#df3079' }}>{word} </span>;
            } else if (word.startsWith('"') + word.endsWith('"')) {
              return <span key={j} style={{ color: '#608e72' }}>{word} </span>;
            } else if (word.startsWith('<') + word.endsWith('>')) {
              return <span key={j} style={{ color: '#00a67d' }}>{word} </span>;
            } else {
              return <span key={j}>{word} </span>;
            }
          });
          return (
            <>
              <span key={i}>{highlightedWords}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>C++</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(7, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };
    
    const processCodeBlockC = (codeBlock) => {
      const codeLines = codeBlock.slice(5, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('//')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>C</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(5, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };    

    const processCodeBlockTs = (codeBlock) => {
      const codeLines = codeBlock.slice(6, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('//')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>TypeScript</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(6, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockPy = (codeBlock) => {
      const codeLines = codeBlock.slice(6, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('#')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>Python</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(6, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };

    const processCodeBlockChavascript = (codeBlock) => {
      const codeLines = codeBlock.slice(15, -3).split('\n');
      const code = codeLines.map((line, i) => {
        if (line.trim().startsWith('//')) {
          return (
            <>
              <span key={i} style={{ color: 'green' }}>{line}</span>
              <br />
            </>
          );
        } else {
          return (
            <>
              <span key={i}>{line}</span> 
              <br />
            </>
          );
        }
      });
      const header = (
        <div className="code-header">
          <u>Chavascript</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = codeBlock.slice(15, -3);
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };
    
    const processCodeBlockOutput = (codeBlock) => {
      const code = codeBlock.slice(10, -3);
      const header = (
        <div className="code-header">
          <u>Output</u>
          </div>
      );
      const copyButton = (
        <button
          type="button"
          className="copy-code-button"
          onClick={() => {
            const codeText = code;
            navigator.clipboard.writeText(codeText);
            alert("Code copied to clipboard!");
          }}
        >
          copy
        </button>
      );
      return (
        <pre className="code-block">
          {header}
          {code}
          {copyButton}
        </pre>
      );
    };
  
    const parts = inputText.split(regexCode);
    const processedParts = parts.map((part, index) => {
      if (part.startsWith('```cmd') && part.endsWith('```')) {
        return processCodeBlockCMD(part);
      } else if (part.startsWith('```js') && part.endsWith('```')) {
        return processCodeBlockJS(part);
      } else if (part.startsWith('```java') && part.endsWith('```')) {
        return processCodeBlockJava(part);
      } else if (part.startsWith('```asm') && part.endsWith('```')) {
        return processCodeBlockAsm(part);
      } else if (part.startsWith('```chavascript') && part.endsWith('```')) {
        return processCodeBlockChavascript(part);
      } else if (part.startsWith('```cs') && part.endsWith('```')) {
        return processCodeBlockCs(part);
      } else if (part.startsWith('```cpp') && part.endsWith('```')) {
        return processCodeBlockCpp(part);
      } else if (part.startsWith('```c') && part.endsWith('```')) {
        return processCodeBlockC(part);
      } else if (part.startsWith('```ts') && part.endsWith('```')) {
        return processCodeBlockTs(part);
      } else if (part.startsWith('```py') && part.endsWith('```')) {
        return processCodeBlockPy(part);
      } else if (part.startsWith('```output') && part.endsWith('```')) {
        return processCodeBlockOutput(part);
      }
      else if (part.startsWith('```') && part.endsWith('```')) {
        return processCodeBlock(part);
      }
      return part.split(regexNewline).map((line, idx) => (
        <React.Fragment key={idx}>
          {processLine(line)}
          <br />
        </React.Fragment>
      ));
    });
  
    return processedParts;
  };

  export default parseText;
