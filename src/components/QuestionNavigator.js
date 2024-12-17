import React from 'react';

const QuestionNavigator = ({ totalQuestions, currentQuestionIndex, onQuestionClick }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0' }}>
      {Array.from({ length: totalQuestions }, (_, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick(index)}
          style={{
            padding: '10px 15px',
            borderRadius: '5px',
            backgroundColor: index === currentQuestionIndex ? '#007bff' : '#f8f9fa',
            color: index === currentQuestionIndex ? '#fff' : '#000',
            border: '1px solid #007bff',
            cursor: 'pointer',
            width: '45px', // Set a fixed width for the buttons
            textAlign: 'center', // Center the text inside the button
          }}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default QuestionNavigator;
