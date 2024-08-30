import { useEffect, useState } from 'react';
import './App.css'
import data from './data.json';

function App() {
  const [quizGenre, setQuizGenre] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  function handleQuestionCatch(x) {
    setQuizGenre(x);
  }

  return (
    <>
      {
        quizGenre.length === 0
        ?
        <div className="container">
          <div className="header">
            <DarkMode />
          </div>

          <div className="content">
            <div className="pageTexts">
              <h1 className="welcomeText">Welcome to the</h1>
              <h1 className="promotionText">Frontend Quiz!</h1>
              <p>Pick a subject to get started.</p>
            </div>

            <div className="questionTexts">
              {data.questionAndAnswers.map((x, i) => <label key={i}><button onClick={ () => handleQuestionCatch(x) }><img src={x.icon} alt="" />{x.category}</button></label>)}
            </div>
          </div>
        </div>
        :
        <QuestionPage quizGenre={quizGenre} setQuizGenre={setQuizGenre} currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} />
      }
    </>
  )
}

function DarkMode() {
  const [theme, setTheme] =useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme])

  return (
    <div className="headerInside">
      <img src="./assets/images/dark-mode-sun.png" alt="" />

      <label className="switch">
        <input type="checkbox" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}/>
        <span className="slider round"></span>
      </label>

      <img src="./assets/images/dark-mode-moon.png" alt="" />
    </div>
  )
}

function QuestionPage({quizGenre, setQuizGenre, currentQuestion, setCurrentQuestion}) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSelectedAnswer, setIsSelectedAnswer] = useState(true);

  function handleAnswerSelect(e) {
    if (!submitted) {
      const allAnswers = document.querySelectorAll('.answer');
      allAnswers.forEach((answer) => answer.classList.remove('selected'));

      const selectedAnswer = e.currentTarget;
      selectedAnswer.classList.add('selected');
    }
  }

  const handleAnswer = (x) => {
    if (!submitted) {
      setUserAnswer(x);
    }
  };

  const handleSubmit = () => {
    if (userAnswer === null) return setIsSelectedAnswer(false);
    setSubmitted(true);

    const correctAnswer = quizGenre.questions[currentQuestion].answer;
    const allAnswers = document.querySelectorAll('.answer');

    allAnswers.forEach((answer) => {
      const pText = answer.querySelector('.answerOption').innerText;

      if (pText === correctAnswer) {
        answer.classList.add('correct-answer');
      } 
      else if (pText === userAnswer) {
        answer.classList.add('wrong-answer');
      }
    })

    if (userAnswer === quizGenre.questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    setIsSelectedAnswer(true);
    setSubmitted(true);
  } 

  const handleNextQuestion = () => {
    // Yeni soruya geçmeden önce tüm stilleri temizle
    document.querySelectorAll('.answer').forEach((answer) => {
      answer.classList.remove('correct-answer');
      answer.classList.remove('wrong-answer');
      answer.classList.remove('selected'); // Ekstra olarak seçilen class'ı da temizleyin
    });
  
    if (currentQuestion < quizGenre.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  
    setUserAnswer(null);
    setSubmitted(false);
  };

  useEffect(() => {
    // Sorular değiştikçe stil class'larını temizle
    document.querySelectorAll('.answer').forEach((answer) => {
      answer.classList.remove('correct-answer');
      answer.classList.remove('wrong-answer');
      answer.classList.remove('selected');
    });
  }, [currentQuestion]);

  return (
    <>
      {
        currentQuestion < 10
        ?
        <div className="container">
            <div className="header">
              <div className="questionTitle">
                <img src={quizGenre.icon} alt="" />
                <p>{quizGenre.category}</p>
              </div>

              <DarkMode />
            </div>

            <div className="content">
              <div className="questions">
                <div className="questionTexts">
                  <p>Question {currentQuestion + 1} of 10</p>
                  <h2>{quizGenre.questions[currentQuestion].question}</h2>
                </div>
              </div>

              <div className="answers">
                {quizGenre.questions[currentQuestion].options.map( (answer, i) =>(
                  <div key={i} className="answer" onClick={handleAnswerSelect}>
                    <button onClick={() => handleAnswer(answer)}>
                      <p>{i === 0 && <span>A</span> || i === 1 && <span>B</span> || i === 2 && <span>C</span> || i === 3 && <span>D</span>}</p>
                      <p className='answerOption'>{answer}</p>
                    </button>
                  </div>
                ))}

                {!submitted
                  ?
                  <button onClick={handleSubmit}>Submit Answer</button>
                  :
                  <button onClick={handleNextQuestion}>Next Question</button>
                }

                {!isSelectedAnswer && <p className="error"><img src="./assets/images/select-error.png" alt="" /> Please select an answer</p>}
              </div>
            </div>
        </div>
        :
        <FinishPage quizGenre={quizGenre} setQuizGenre={setQuizGenre} setCurrentQuestion={setCurrentQuestion} score={score} />
      }
    </>
  );
}

function FinishPage({ score, quizGenre, setQuizGenre, setCurrentQuestion }) {

function handlePlayAgain() {
    setQuizGenre([]);
    setCurrentQuestion(0);
}

  return (
    <div className="container">
      <div className="header">
        <div className="questionTitle">
          <img src={quizGenre.icon} alt="Accessibility Icon" />
          <p>{quizGenre.category}</p>
        </div>
        
        <DarkMode />
      </div>

      <div className="content">
        <div className="completeTexts">
          <h2 className="status">Test Tamamlandı</h2>
          <h2 className="scoreText"><b>Başarın...</b></h2>
        </div>

        <div className="userScore">
          <div className="scoreBox">
            <p className="theme"><img src={quizGenre.icon} alt="" />{quizGenre.category}</p>
            <span>{score}</span>
            <p>Doğrunuz var tebrikler 🎉</p>
          </div>

          <button onClick={handlePlayAgain}>Yeni Test Çöz</button>
        </div>
      </div>
    </div>
  )
}

export default App
