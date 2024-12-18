import React, { useState, useEffect } from 'react';

const QuestionDisplay = ({
  question,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  selectedAnswer, // Pass the selectedAnswer prop
  mode,
}) => {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer || null);
  const [revealAnswer, setRevealAnswer] = useState(false);

  // Sync selectedOption with selectedAnswer prop whenever it changes
  useEffect(() => {
    setSelectedOption(selectedAnswer || null);
  }, [selectedAnswer, question]);

  const handleOptionChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelectedOption(value); // Update local state
  };

  const handleNext = () => {
    setRevealAnswer(false);
    onNext(selectedOption); // Pass selectedOption back to the parent
  };

  const handlePrevious = () => {
    setRevealAnswer(false);
    onPrevious(); // Navigate to the previous question
  };

  const handleReveal = () => {
    setRevealAnswer(true);
  };

  // Map option letters (A, B, C, D, ...) to the shuffled options
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h3>{question.text}</h3>
      <form>
        {question.shuffledOptions.map(([_, value], index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="option"
                value={index} // Use the index of the shuffled option as the value
                checked={selectedOption === index} // Compare selectedOption with index
                onChange={handleOptionChange}
                disabled={mode === 'practice' && revealAnswer} // Disable after reveal in Practice Mode
              />
              {`${optionLetters[index]}].`} {value}
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
          Correct Answer: {`${optionLetters[question.correctAnswerIndex]}].`} {question.shuffledOptions[question.correctAnswerIndex][1]}
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
