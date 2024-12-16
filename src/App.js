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
    } else if (timeRemaining === 0) {
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
  
    // Shuffle the questions array to pick random questions
    if (randomize || numQuestions !== 'all') {
      selected = shuffleArray([...questions]);
    }
  
    // Select the desired number of questions at random
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
    setReviewMode(true);
  };

  const handleStartNewQuiz = () => {
    resetQuiz(); // Reset the quiz state
  };

  const handleQuestionClick = (index) => {
    setIsEndScreen(false);
    setCurrentQuestionIndex(index);
  };

  return (
    <div>
      <h1>Quiz App</h1>
      <FileUpload onFileLoad={handleFileLoad} />
      {!quizStarted && questions.length > 0 && (
        <div>
          <ModeSelector mode={mode} onModeChange={(newMode) => setMode(newMode)} />
          <div>
            <label>
              Number of Questions:
              <input
                type="number"
                value={numQuestions === 'all' ? '' : numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                placeholder="Enter number or 'all'"
              />
            </label>
          </div>
          <div>
            <label>
              Time Allowed (minutes):
              <input
                type="number"
                value={timeAllowed || ''}
                onChange={(e) => setTimeAllowed(parseInt(e.target.value, 10) || 0)}
                placeholder="Enter time in minutes"
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={randomize}
                onChange={() => setRandomize((prev) => !prev)}
              />
              Randomize Questions
            </label>
          </div>
          <button onClick={handleStartQuiz}>Start Quiz</button>
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
          <button onClick={handleReviewQuiz}>Review Quiz</button>
          <button
            onClick={handleStartNewQuiz}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Start New Quiz
          </button>
        </div>
      ) : isEndScreen ? (
        <div>
          <h2>End Exam</h2>
          <button
            onClick={handleEndExam}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Submit Quiz
          </button>
        </div>
      ) : quizStarted && selectedQuestions.length > 0 ? (
        <>
          <QuestionNavigator
            totalQuestions={selectedQuestions.length}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionClick={handleQuestionClick}
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
