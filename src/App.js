import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionNavigator from './components/QuestionNavigator';
import parseAiken from './utils/parseAiken';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Store user's answers
  const [isEndScreen, setIsEndScreen] = useState(false); // Track if user is on the end screen
  const [quizCompleted, setQuizCompleted] = useState(false); // Track if the quiz is completed

  const handleFileLoad = (parsedQuestions) => {
    setQuestions(parsedQuestions); // Load questions
    setCurrentQuestionIndex(0); // Reset to the first question
    setUserAnswers({}); // Reset user's answers
    setIsEndScreen(false); // Reset end screen state
    setQuizCompleted(false); // Reset quiz completion
  };

  const handleNextQuestion = (selectedOption) => {
    // Save the selected answer (even if it's null)
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption,
    }));

    if (currentQuestionIndex === questions.length - 1) {
      setIsEndScreen(true); // Navigate to the end screen after the last question
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleEndExam = () => {
    setQuizCompleted(true); // Mark the quiz as completed
  };

  const handleQuestionClick = (index) => {
    setIsEndScreen(false); // Exit end screen if navigating back
    setCurrentQuestionIndex(index); // Navigate to the clicked question
  };

  return (
    <div>
      <h1>Quiz App</h1>
      <FileUpload onFileLoad={handleFileLoad} />
      {quizCompleted ? (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your Answers: {JSON.stringify(userAnswers, null, 2)}</p>
        </div>
      ) : isEndScreen ? (
        <div>
          <h2>End Exam</h2>
          <button
            onClick={handleEndExam}
            style={{ marginTop: '20px', padding: '10px 20px' }}
          >
            Submit Quiz
          </button>
        </div>
      ) : questions.length > 0 ? (
        <>
          <QuestionNavigator
            totalQuestions={questions.length}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionClick={handleQuestionClick}
          />
          <QuestionDisplay
            question={questions[currentQuestionIndex]}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
            isFirstQuestion={currentQuestionIndex === 0}
            selectedAnswer={userAnswers[currentQuestionIndex] || null} // Pass saved answer or null
          />
        </>
      ) : null}
    </div>
  );
}

export default App;
