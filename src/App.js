import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionNavigator from './components/QuestionNavigator';
import ModeSelector from './components/ModeSelector';
import QuestionReview from './components/QuestionReview';
import parseAiken from './utils/parseAiken';

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isEndScreen, setIsEndScreen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [mode, setMode] = useState('test');
  const [quizStarted, setQuizStarted] = useState(false);
  const [randomize, setRandomize] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [timeAllowed, setTimeAllowed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [numQuestions, setNumQuestions] = useState('all');

  useEffect(() => {
    let timer = null;
    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && quizStarted) {
      handleEndExam();
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const handleFileLoad = (parsedQuestions) => {
    setQuestions(parsedQuestions);
    resetQuiz();
  };

  const resetQuiz = () => {
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
    if (randomize || numQuestions !== 'all') {
      selected = shuffleArray([...questions]);
    }
    if (numQuestions !== 'all') {
      const totalQuestions = Math.min(parseInt(numQuestions, 10), questions.length);
      selected = selected.slice(0, totalQuestions);
    }

    setSelectedQuestions(selected);
    setQuizStarted(true);
    setTimeRemaining(timeAllowed * 60); // Convert minutes to seconds
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
    setReviewMode(true);
  };

  const getProgressPercentage = () => {
    if (selectedQuestions.length === 0) return 0;
  
    // If quiz is completed, progress is 100%
    if (quizCompleted || isEndScreen) {
      return 100;
    }
  
    // Otherwise, calculate progress as the number of answered/skipped questions
    return ((currentQuestionIndex) / selectedQuestions.length) * 100;
  };
  
  

  return (
    <div style={{ fontFamily: 'Avenir, sans-serif' }}>
      {/* Top Bar */}
      <nav className="navbar navbar-dark fixed-top" style={{ backgroundColor: '#001219' }}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 text-light">Quiz App</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        {quizStarted && (
          <>
            {/* Timer */}
            <div className="text-center mb-3">
              <h5 style={{ color: '#CA6702' }}>
                Time Remaining: {Math.floor(timeRemaining / 60)}:
                {String(timeRemaining % 60).padStart(2, '0')}
              </h5>
            </div>
            {/* Progress Bar */}
            <div className="progress mb-3">
  <div
    className="progress-bar"
    role="progressbar"
    style={{ width: `${getProgressPercentage()}%` }}
    aria-valuenow={getProgressPercentage()}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    {Math.round(getProgressPercentage())}%
  </div>
</div>

          </>
        )}

        <div className="jumbotron">
        {reviewMode ? (
  <div className="text-center">
    <QuestionReview
      questions={selectedQuestions}
      userAnswers={userAnswers}
      score={score}
      totalQuestions={selectedQuestions.length}
    />
    <button
      className="btn btn-primary mt-3"
      onClick={resetQuiz}
    >
      Return to Main Screen
    </button>
    <hr />
    <hr />

  </div>
) : quizCompleted ? (

            <div className="text-center">
              <h2>Quiz Completed!</h2>
              <p>
                Score: {score} / {selectedQuestions.length} (
                {((score / selectedQuestions.length) * 100).toFixed(2)}%)
              </p>
              <button className="btn btn-success me-2" onClick={handleReviewQuiz}>
                Review Quiz
              </button>
              <button className="btn btn-primary" onClick={resetQuiz}>
                Start New Quiz
              </button>
            </div>
          ) : isEndScreen ? (
            <div className="text-center">
              <h2>End Exam</h2>
              <button className="btn btn-danger mt-3" onClick={handleEndExam}>
                Submit Quiz
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
                onPrevious={() => setCurrentQuestionIndex((prev) => prev - 1)}
                selectedAnswer={userAnswers[currentQuestionIndex] || null}
                mode={mode}
              />
            </>
          ) : (
            <div>
              <FileUpload onFileLoad={handleFileLoad} />
              {!quizStarted && questions.length > 0 && (
                <div>
                  <ModeSelector mode={mode} onModeChange={(newMode) => setMode(newMode)} />
                  <div className="form-group mt-3">
                    <label>Number of Questions:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={numQuestions === 'all' ? '' : numQuestions}
                      onChange={(e) => setNumQuestions(e.target.value)}
                      placeholder="Enter number or 'all'"
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Time Allowed (minutes):</label>
                    <input
                      type="number"
                      className="form-control"
                      value={timeAllowed || ''}
                      onChange={(e) => setTimeAllowed(parseInt(e.target.value, 10) || 0)}
                      placeholder="Enter time in minutes"
                    />
                  </div>
                  <div className="form-check mt-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={randomize}
                      onChange={() => setRandomize((prev) => !prev)}
                    />
                    <label className="form-check-label">Randomize Questions</label>
                  </div>
                  <button className="btn btn-primary mt-4" onClick={handleStartQuiz}>
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 fixed-bottom" style={{ backgroundColor: '#001219', color: '#E9D8A6' }}>
        Created by Aditya Saxena
      </footer>
    </div>
  );
}

export default App;
