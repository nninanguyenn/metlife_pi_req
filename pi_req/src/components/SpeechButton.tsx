import React from "react";

interface SpeechButtonProps {
  onResult: (text: string) => void;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ onResult }) => {
  const handleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.onerror = () => {
      alert("Speech recognition error.");
    };
    recognition.start();
  };

  return (
    <button
      type="button"
      style={{
        marginLeft: 8,
        background: "#0073c6",
        color: "#fff",
        border: "none",
        borderRadius: 20,
        width: 36,
        height: 36,
        cursor: "pointer",
        fontSize: 18,
      }}
      title="Speak"
      onClick={handleSpeech}
    >
      🎤
    </button>
  );
};

export default SpeechButton;
