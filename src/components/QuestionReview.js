import React from 'react';

const QuestionReview = ({ questions, userAnswers, score, totalQuestions }) => {
  return (
    <div>
      <h2>Quiz Review</h2>
      <p>
        Score: {score} / {totalQuestions} ({((score / totalQuestions) * 100).toFixed(2)}%)
      </p>
      {questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.answer;

        return (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4>Question {index + 1}:</h4>
            <p>{question.text}</p>
            <p>
              <strong>Your Answer: </strong>
              <span
                style={{
                  color: isCorrect ? 'green' : 'red',
                }}
              >
                {userAnswer || 'No Answer'}
              </span>
            </p>
            <p>
              <strong>Correct Answer: </strong>
              <span style={{ color: 'green' }}>{question.answer}</span>
            </p>
            {!isCorrect && userAnswer && (
              <p style={{ color: 'red' }}>Your answer was incorrect.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionReview;
