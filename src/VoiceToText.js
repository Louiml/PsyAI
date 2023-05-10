import React, { useState, useEffect } from 'react';

const VoiceToText = () => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [showTextArea, setShowTextArea] = useState(true);
  const [showInput, setShowInput] = useState(false);

  let recognition;

  useEffect(() => {
    recognition = new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      setTranscription(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error occurred: ', event.error);
      setRecording(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const handleStartRecording = () => {
    setRecording(true);
    recognition.start();
  };

  const handleStopRecording = () => {
    setRecording(false);
    setShowTextArea(false);
    setShowInput(true);
    recognition.stop();
  };

  const handleSaveTranscription = () => {
    // Handle saving the transcription (e.g., send it to the server)
    setShowTextArea(true);
    setShowInput(false);
    setTranscription('');
  };

  return (
    <div>
      {showTextArea && (
        <div>
          <button onClick={handleStartRecording} disabled={recording}>
            Start Recording
          </button>
          <button onClick={handleStopRecording} disabled={!recording}>
            Stop Recording
          </button>
          <div>{transcription}</div>
        </div>
      )}
      {showInput && (
        <div>
          <input type="text" value={transcription} onChange={() => {}} />
          <button onClick={handleSaveTranscription}>Save</button>
        </div>
      )}
    </div>
  );
};

export default VoiceToText;
