import React from 'react';

const parseText = (inputText) => {
    // const ref = React.createRef();
    const regexBold = /(\*\*.*?\*\*)/g;
    const regexNewline = /(\n)|\\n/g;
    const regexUrl = /(https?:\/\/[^\s]+)/g;
    const regexCode = /(```[\s\S]*?```)/g;
    const regexInlineCode = /(`[^`]*`)/g;
    const regexHyphen = /^-\s+/;
    const regexUnderline = /(_[^_]+_)/g;
    const regexTableLine = /^\|.*\|$/;
    const regexImage = /!\[(.*?)\]\((.*?)\)/g;

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
        } else if (line.match(regexImage)) {
          return (
            <React.Fragment>
                <img alt="$1" src="$2"/>
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
            const codeText = code;
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
  
    const parts = inputText.split(regexCode);
    const processedParts = parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
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