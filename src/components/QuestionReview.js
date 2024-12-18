import React from 'react';

const QuestionReview = ({ questions, userAnswers, score, totalQuestions }) => {
  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Quiz Review</h2>
      <p>Your Score: {score} / {totalQuestions}</p>
      {questions.map((question, index) => {
        const userAnswerIndex = userAnswers[index];
        const correctAnswerIndex = question.correctAnswerIndex;

        const userAnswer =
          userAnswerIndex !== undefined
            ? question.shuffledOptions[userAnswerIndex]?.[1]
            : 'No answer selected';
        const correctAnswer = question.shuffledOptions[correctAnswerIndex]?.[1];

        const isCorrect = userAnswerIndex === correctAnswerIndex;

        return (
          <div key={index} style={{ marginBottom: '20px' }}>
            <p>
              <strong>Q{index + 1}: {question.text}</strong>
            </p>
            <p>
              <strong>Your Answer:</strong> {userAnswer || 'No answer selected'}
            </p>
            <p>
              <strong>Correct Answer:</strong> {correctAnswer || 'Not available'}
            </p>
            <p style={{ color: isCorrect ? 'green' : 'red' }}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionReview;
