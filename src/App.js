import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionNavigator from './components/QuestionNavigator';
import ModeSelector from './components/ModeSelector';
import QuestionReview from './components/QuestionReview'; // Import QuestionReview
import parseAiken from './utils/parseAiken';

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]); // Questions for the current quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isEndScreen, setIsEndScreen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [mode, setMode] = useState('test');
  const [quizStarted, setQuizStarted] = useState(false);
  const [randomize, setRandomize] = useState(false);
  const [score, setScore] = useState(0);
  const [timeAllowed, setTimeAllowed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [numQuestions, setNumQuestions] = useState('all');
  const [reviewMode, setReviewMode] = useState(false); // Track review mode

  useEffect(() => {
    let timer = null;
    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleEndExam();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const handleFileLoad = (parsedQuestions) => {
    setQuestions(parsedQuestions);
    setSelectedQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsEndScreen(false);
    setQuizCompleted(false);
    setMode('test');
    setQuizStarted(false);
    setRandomize(false);
    setScore(0);
    setTimeAllowed(0);
    setTimeRemaining(null);
    setNumQuestions('all');
    setReviewMode(false);
  };

  const handleStartQuiz = () => {
    let selected = [...questions];

    if (numQuestions !== 'all') {
      selected = selected.slice(0, parseInt(numQuestions, 10));
    }

    if (randomize) {
      selected = shuffleArray(selected);
    }

    setSelectedQuestions(selected);
    setQuizStarted(true);
    setTimeRemaining(timeAllowed * 60);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleNextQuestion = (selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption,
    }));

    if (currentQuestionIndex === selectedQuestions.length - 1) {
      setIsEndScreen(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const calculateScore = () => {
    let correctCount = 0;
    selectedQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  const handleEndExam = () => {
    calculateScore();
    setQuizCompleted(true);
  };

  const handleReviewQuiz = () => {
    setReviewMode(true); // Enable review mode
  };

  return (
    <div>
      <h1>Quiz App</h1>
      <FileUpload onFileLoad={handleFileLoad} />
      {!quizStarted && questions.length > 0 && (
        <div>
          <ModeSelector mode={mode} onModeChange={(newMode) => setMode(newMode)} />
          {/* Add inputs for time allowed and number of questions */}
        </div>
      )}
      {reviewMode ? (
        <QuestionReview
          questions={selectedQuestions}
          userAnswers={userAnswers}
          score={score}
          totalQuestions={selectedQuestions.length}
        />
      ) : quizCompleted ? (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Score: {score} / {selectedQuestions.length}</p>
          <p>Percentage: {(score / selectedQuestions.length) * 100}%</p>
          <button
            onClick={handleReviewQuiz}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Review Quiz
          </button>
        </div>
      ) : quizStarted && selectedQuestions.length > 0 ? (
        <>
          <QuestionNavigator
            totalQuestions={selectedQuestions.length}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionClick={(index) => setCurrentQuestionIndex(index)}
          />
          <QuestionDisplay
            question={selectedQuestions[currentQuestionIndex]}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            isLastQuestion={currentQuestionIndex === selectedQuestions.length - 1}
            isFirstQuestion={currentQuestionIndex === 0}
            selectedAnswer={userAnswers[currentQuestionIndex] || null}
            mode={mode}
          />
        </>
      ) : null}
    </div>
  );
}

export default App;
