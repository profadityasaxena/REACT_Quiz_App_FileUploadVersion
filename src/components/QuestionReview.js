import React from 'react';

const QuestionReview = ({ questions, userAnswers, score }) => {
  return (
    <div>
      <h2>Quiz Review</h2>
      <p>Your Score: {score} / {questions.length}</p>
      {questions.map((question, index) => (
        <div key={index} className="mb-3">
          <p><strong>Q{index + 1}: {question.text}</strong></p>
          <p>Your Answer: {userAnswers[index] || 'No answer selected'}</p>
          <p>Correct Answer: {question.answer}</p>
          {userAnswers[index] === question.answer ? (
            <p style={{ color: 'green' }}>Correct</p>
          ) : (
            <p style={{ color: 'red' }}>Incorrect</p>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default QuestionReview;
