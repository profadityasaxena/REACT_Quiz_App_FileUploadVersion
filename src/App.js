import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionNavigator from './components/QuestionNavigator';
import ModeSelector from './components/ModeSelector';
import parseAiken from './utils/parseAiken';

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]); // Questions for the current quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isEndScreen, setIsEndScreen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [mode, setMode] = useState('test'); // Default to Test Mode
  const [quizStarted, setQuizStarted] = useState(false); // Track if the quiz has started
  const [randomize, setRandomize] = useState(false); // Track randomizer toggle
  const [score, setScore] = useState(0); // Track the user's score
  const [timeAllowed, setTimeAllowed] = useState(0); // Time allowed for the quiz in minutes
  const [timeRemaining, setTimeRemaining] = useState(null); // Timer countdown
  const [numQuestions, setNumQuestions] = useState('all'); // Number of questions for the quiz

  useEffect(() => {
    const savedQuizState = localStorage.getItem('quizState');
    if (savedQuizState) {
      const {
        questions: savedQuestions,
        selectedQuestions: savedSelectedQuestions,
        currentQuestionIndex: savedIndex,
        userAnswers: savedAnswers,
        isEndScreen: savedEndScreen,
        quizCompleted: savedCompleted,
        mode: savedMode,
        quizStarted: savedQuizStarted,
        randomize: savedRandomize,
        score: savedScore,
        timeAllowed: savedTimeAllowed,
        timeRemaining: savedTimeRemaining,
        numQuestions: savedNumQuestions,
      } = JSON.parse(savedQuizState);

      if (savedQuestions?.length) {
        setQuestions(savedQuestions);
        setSelectedQuestions(savedSelectedQuestions || []);
        setCurrentQuestionIndex(savedIndex || 0);
        setUserAnswers(savedAnswers || {});
        setIsEndScreen(savedEndScreen || false);
        setQuizCompleted(savedCompleted || false);
        setMode(savedMode || 'test');
        setQuizStarted(savedQuizStarted || false);
        setRandomize(savedRandomize || false);
        setScore(savedScore || 0);
        setTimeAllowed(savedTimeAllowed || 0);
        setTimeRemaining(savedTimeRemaining || null);
        setNumQuestions(savedNumQuestions || 'all');
      }
    }
  }, []);

  useEffect(() => {
    if (selectedQuestions.length > 0) {
      const quizState = {
        questions,
        selectedQuestions,
        currentQuestionIndex,
        userAnswers,
        isEndScreen,
        quizCompleted,
        mode,
        quizStarted,
        randomize,
        score,
        timeAllowed,
        timeRemaining,
        numQuestions,
      };
      localStorage.setItem('quizState', JSON.stringify(quizState));
    }
  }, [
    questions,
    selectedQuestions,
    currentQuestionIndex,
    userAnswers,
    isEndScreen,
    quizCompleted,
    mode,
    quizStarted,
    randomize,
    score,
    timeAllowed,
    timeRemaining,
    numQuestions,
  ]);

  useEffect(() => {
    let timer = null;
    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleEndExam(); // Auto-submit quiz when timer expires
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
    setRandomize(false); // Reset randomizer
    setScore(0); // Reset score
    setTimeAllowed(0); // Reset time allowed
    setTimeRemaining(null); // Reset timer
    setNumQuestions('all'); // Reset question selection
    localStorage.removeItem('quizState');
  };

  const handleStartQuiz = () => {
    let selected = [...questions];

    if (numQuestions !== 'all') {
      selected = selected.slice(0, parseInt(numQuestions, 10)); // Select the specified number of questions
    }

    if (randomize) {
      selected = shuffleArray(selected); // Shuffle if random mode is selected
    }

    setSelectedQuestions(selected);
    setQuizStarted(true);
    setTimeRemaining(timeAllowed * 60); // Convert minutes to seconds
  };

  const handleModeChange = (newMode) => {
    if (!quizStarted) {
      setMode(newMode);
    }
  };

  const handleRandomizeToggle = () => {
    if (!quizStarted) {
      setRandomize((prev) => !prev); // Toggle randomizer
    }
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(e.target.value);
  };

  const handleTimeAllowedChange = (e) => {
    setTimeAllowed(parseInt(e.target.value, 10) || 0);
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
    setScore(correctCount); // Update the score state
  };

  const handleEndExam = () => {
    calculateScore(); // Calculate score for both Practice and Test Modes
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
      {!quizStarted && questions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
          <div style={{ margin: '20px 0' }}>
            <label>
              <input
                type="checkbox"
                checked={randomize}
                onChange={handleRandomizeToggle}
              />
              Randomize Questions
            </label>
          </div>
          <div>
            <label>
              Number of Questions:
              <input
                type="number"
                value={numQuestions === 'all' ? '' : numQuestions}
                onChange={handleNumQuestionsChange}
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
                onChange={handleTimeAllowedChange}
                placeholder="Enter time in minutes"
              />
            </label>
          </div>
          <button
            onClick={handleStartQuiz}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Start Quiz
          </button>
        </div>
      )}
      {quizCompleted ? (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Score: {score} / {selectedQuestions.length}</p>
          <p>Percentage: {(score / selectedQuestions.length) * 100}%</p>
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
      ) : quizStarted && selectedQuestions.length > 0 ? (
        <>
          <div style={{ margin: '20px', fontSize: '18px', color: 'red' }}>
            Time Remaining: {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
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
