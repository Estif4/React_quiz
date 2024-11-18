import { useState, useCallback, useEffect } from "react";
import questions from "../question.js";
import quizfinshed from "../assets/quiz.png";
import QuestionTimer from "./QuestionTimer.jsx";
import Answerchecker from "./AnswerChecker.jsx";

export default function Quiz() {
  const [useranswer, setuseranswer] = useState([]);
  const [isquizcomplete, setquizcomplete] = useState(false);
  const [shufledchoices, setShufledchoices] = useState([]);
  const [remaingtime, setremaingtime] = useState(5000); // 5 seconds countdown
  const [progressBarWidth, setProgressBarWidth] = useState(100);
  const [page, setPage] = useState("quiz");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeouts, setTimeouts] = useState([]); // Track timeout IDs for clean-up
  const activequestionIndex = useranswer.length;
  const time = 15000;

  const handleAnswerClick = useCallback(
    (answer) => {
      setSelectedAnswer(answer);

      // Delay answer processing by 500ms
      const timeoutId = setTimeout(() => {
        setuseranswer((prev) => {
          const updatedAnswers = [...prev, answer];

          // Check if it's the last question
          if (updatedAnswers.length === questions.length) {
            setquizcomplete(true);
            setPage("completed");
          }

          return updatedAnswers;
        });
      }, 1000);

      // Keep track of timeout IDs for cleanup
      setTimeouts((prev) => [...prev, timeoutId]);
    },
    [activequestionIndex, selectedAnswer]
  );

  // Shuffle choices and reset timer when the question changes
  useEffect(() => {
    if (questions[activequestionIndex]) {
      const choices = [...questions[activequestionIndex].choices];
      choices.sort(() => Math.random() - 0.5);
      setShufledchoices(choices);
      setremaingtime(time);
      setSelectedAnswer(null);
    }
  }, [activequestionIndex]);

  // Cleanup all timeouts when restarting or unmounting
  useEffect(() => {
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [timeouts]);

  // Handle quiz restart
  const handleRestartQuiz = () => {
    setuseranswer([]);
    setquizcomplete(false);
    setPage("quiz");
    setSelectedAnswer(null);
    setremaingtime(5000);
    setTimeouts([]);
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  const handleSeeResultsClick = () => {
    setPage("results");
  };

  const pageComponents = {
    quiz: (
      <div className="flex flex-col justify-center items-center mt-8 space-y-4">
        <div className="bg-gradient-to-r from-cyan-800 to-blue-400 p-4 px-12 w-96 rounded-lg shadow-lg">
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden my-4">
            <QuestionTimer
              remaingtime={remaingtime}
              setremaingtime={setremaingtime}
              progressBarWidth={progressBarWidth}
              setProgressBarWidth={setProgressBarWidth}
              time={time}
              activequestionIndex={activequestionIndex}
              isquizcomplete={isquizcomplete}
              questions={questions}
              handleAnswerClick={handleAnswerClick} // Memoized function passed down
            />
          </div>
          <h1 className="text-white mb-4 text-xl font-semibold font-serif">
            {questions[activequestionIndex]?.question}
          </h1>
          {questions[activequestionIndex] &&
            shufledchoices.map((answer, index) => {
              const isCorrect =
                answer === questions[activequestionIndex].choices[0];

              const buttonColor =
                selectedAnswer === answer
                  ? isCorrect
                    ? "bg-green-400" // Correct answer
                    : "bg-red-500" // Incorrect answer
                  : "bg-blue-500 hover:bg-blue-700"; // Default color

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answer)}
                  className={`${buttonColor} block w-full text-white font-bold py-2 px-4 rounded mb-2`}
                  disabled={!!selectedAnswer}>
                  {answer}
                </button>
              );
            })}
        </div>
      </div>
    ),
    completed: (
      <div className="flex justify-center items-center h-full mt-4 quiz-finished">
        <div className="flex flex-col items-center bg-emerald-400 p-12 rounded-lg">
          <div>
            <img
              src={quizfinshed}
              className="w-24 h-24 rounded-full border border-white p-4"
              alt="Quiz Completed"
            />
          </div>
          <div className="text-3xl font-semibold text-white mt-4">
            Quiz Completed
          </div>
          <button
            onClick={handleSeeResultsClick}
            className="text-white bg-green-600 hover:bg-black text-xl tracking-wider mt-8 px-4 rounded-md">
            See Results
          </button>
          <button
            onClick={handleRestartQuiz} // Restart button added
            className="text-white bg-red-600 hover:bg-black text-xl tracking-wider mt-4 px-4 rounded-md">
            Restart Quiz
          </button>
        </div>
      </div>
    ),
    results: (
      <Answerchecker
        remaingtime={remaingtime}
        setremaingtime={setremaingtime}
        progressBarWidth={progressBarWidth}
        setProgressBarWidth={setProgressBarWidth}
        time={time}
        activequestionIndex={activequestionIndex}
        isquizcomplete={isquizcomplete}
        questions={questions}
        handleAnswerClick={handleAnswerClick}
        useranswer={useranswer}
        setPage={setPage}
        setuseranswer={setuseranswer}
        setquizcomplete={setquizcomplete}
        handleRestartQuiz={handleRestartQuiz} // Pass down restart function
      />
    ),
  };

  // Render the page based on the current state
  return <>{pageComponents[page]}</>;
}
