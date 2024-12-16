import React, { useState, useEffect } from 'react';

const QuestionDisplay = ({
  question,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  selectedAnswer,
  mode, // Receive the mode as a prop
}) => {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer || null);
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    setSelectedOption(selectedAnswer || null);
  }, [selectedAnswer, question]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNext = () => {
    setRevealAnswer(false);
    onNext(selectedOption);
  };

  const handlePrevious = () => {
    setRevealAnswer(false);
    onPrevious();
  };

  const handleReveal = () => {
    setRevealAnswer(true);
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h3>{question.text}</h3>
      <form>
        {Object.entries(question.options).map(([key, value]) => (
          <div key={key}>
            <label>
              <input
                type="radio"
                name="option"
                value={key}
                checked={selectedOption === key}
                onChange={handleOptionChange}
                disabled={mode === 'practice' && revealAnswer} // Disable after reveal in Practice Mode
              />
              {key}. {value}
            </label>
          </div>
        ))}
      </form>
      {mode === 'practice' && !revealAnswer && (
        <button onClick={handleReveal} style={{ margin: '10px 0' }}>
          Reveal Answer
        </button>
      )}
      {revealAnswer && mode === 'practice' && (
        <p style={{ color: 'green' }}>Correct Answer: {question.answer}</p>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrevious} disabled={isFirstQuestion}>
          Previous
        </button>
        <button onClick={handleNext} style={{ marginLeft: '10px' }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionDisplay;
