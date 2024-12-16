import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionNavigator from './components/QuestionNavigator';
import ModeSelector from './components/ModeSelector';
import parseAiken from './utils/parseAiken';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isEndScreen, setIsEndScreen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [mode, setMode] = useState('test'); // Default to Test Mode
  const [quizStarted, setQuizStarted] = useState(false); // Track if the quiz has started

  useEffect(() => {
    const savedQuizState = localStorage.getItem('quizState');
    if (savedQuizState) {
      const {
        questions: savedQuestions,
        currentQuestionIndex: savedIndex,
        userAnswers: savedAnswers,
        isEndScreen: savedEndScreen,
        quizCompleted: savedCompleted,
        mode: savedMode,
        quizStarted: savedQuizStarted,
      } = JSON.parse(savedQuizState);

      if (savedQuestions?.length) {
        setQuestions(savedQuestions);
        setCurrentQuestionIndex(savedIndex || 0);
        setUserAnswers(savedAnswers || {});
        setIsEndScreen(savedEndScreen || false);
        setQuizCompleted(savedCompleted || false);
        setMode(savedMode || 'test');
        setQuizStarted(savedQuizStarted || false);
      }
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const quizState = {
        questions,
        currentQuestionIndex,
        userAnswers,
        isEndScreen,
        quizCompleted,
        mode,
        quizStarted,
      };
      localStorage.setItem('quizState', JSON.stringify(quizState));
    }
  }, [questions, currentQuestionIndex, userAnswers, isEndScreen, quizCompleted, mode, quizStarted]);

  const handleFileLoad = (parsedQuestions) => {
    setQuestions(parsedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsEndScreen(false);
    setQuizCompleted(false);
    setMode('test'); // Reset to default mode
    setQuizStarted(false); // Reset quiz start status
    localStorage.removeItem('quizState');
  };

  const handleStartQuiz = () => {
    setQuizStarted(true); // Mark quiz as started
  };

  const handleModeChange = (newMode) => {
    if (!quizStarted) {
      setMode(newMode); // Allow toggling only if quiz hasn't started
    }
  };

  const handleNextQuestion = (selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption,
    }));

    if (currentQuestionIndex === questions.length - 1) {
      setIsEndScreen(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleEndExam = () => {
    setQuizCompleted(true);
  };

  const handleQuestionClick = (index) => {
    setIsEndScreen(false);
    setCurrentQuestionIndex(index);
  };

  return (
    <div>
      <h1>Quiz App</h1>
      <FileUpload onFileLoad={handleFileLoad} />
      {!quizStarted && <ModeSelector mode={mode} onModeChange={handleModeChange} />}
      {!quizStarted && questions.length > 0 && (
        <button onClick={handleStartQuiz} style={{ margin: '20px', padding: '10px 20px' }}>
          Start Quiz
        </button>
      )}
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
      ) : quizStarted && questions.length > 0 ? (
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
            selectedAnswer={userAnswers[currentQuestionIndex] || null}
            mode={mode} // Pass the mode to QuestionDisplay
          />
        </>
      ) : null}
    </div>
  );
}

export default App;
