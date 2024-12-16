import React, { useState, useEffect } from 'react';

const QuestionDisplay = ({
  question,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  selectedAnswer, // Previously selected answer
}) => {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer || null);

  // Sync local state with selectedAnswer when the question changes
  useEffect(() => {
    setSelectedOption(selectedAnswer || null); // Reset to null if no answer exists
  }, [selectedAnswer, question]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNext = () => {
    onNext(selectedOption); // Pass the selected option (or null) to the parent
  };

  const handlePrevious = () => {
    onPrevious(); // Navigate to the previous question
  };

  if (!question) {
    return <p>No question to display!</p>; // Fallback for missing question
  }

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
              />
              {key}. {value}
            </label>
          </div>
        ))}
      </form>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrevious} disabled={isFirstQuestion}>
          Previous
        </button>
        <button
          onClick={handleNext}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionDisplay;
