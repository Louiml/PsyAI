import React from 'react';

const parseText = (inputText) => {
    const regexBold = /(\*\*.*?\*\*)/g;
    const regexNewline = /(\n)|\\n/g;
    const regexUrl = /(https?:\/\/[^\s]+)/g;
    const regexCode = /(```[\s\S]*?```)/g;
    const regexInlineCode = /(`[^`]*`)/g;
    const regexHyphen = /^-\s+/; 
    const regexUnderline = /(_[^_]+_)/g;
  
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
        } else if (line.match(regexHyphen)) {
          line = line.replace(regexHyphen, '• ');
          return (
            <React.Fragment>
              <strong>{processLine(line)}</strong>
              {/* <br /> */}
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
          <br />
        </React.Fragment>
      ));
    });
  
    return processedParts;
  };
  
  export default parseText;