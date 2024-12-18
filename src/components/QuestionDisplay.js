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
    setSelectedOption(parseInt(e.target.value, 10)); // Ensure `selectedOption` is a number
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

  // Safeguard for undefined or invalid question
  if (!question || !Array.isArray(question.shuffledOptions)) {
    return <p style={{ color: 'red' }}>Error: Question data is not available.</p>;
  }

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h3>{question.text || 'Question not available'}</h3>
      <form>
        {question.shuffledOptions.map(([key, value], index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="option"
                value={index} // Use the index of the shuffled option as the value
                checked={selectedOption === index} // Compare selectedOption as a number
                onChange={handleOptionChange}
                disabled={mode === 'practice' && revealAnswer} // Disable after reveal in Practice Mode
                aria-label={`${key}. ${value}`} // Accessibility improvement
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
        <p style={{ color: 'green' }}>
          Correct Answer: {question.shuffledOptions[question.correctAnswerIndex][0]}.
          {question.shuffledOptions[question.correctAnswerIndex][1]}
        </p>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrevious} disabled={isFirstQuestion}>
          Previous
        </button>
        <button onClick={handleNext} style={{ marginLeft: '10px' }} disabled={selectedOption === null}>
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionDisplay;
