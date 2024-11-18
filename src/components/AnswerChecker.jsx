import { useState, useEffect } from "react";

export default function Answerchecker({
  setPage,
  questions,
  useranswer,
  setuseranswer,
  setquizcomplete,
  handleRestartQuiz, // Handle restart quiz function passed from parent
}) {
  // State to manage the active color effect
  const [showActiveColor, setShowActiveColor] = useState(true);

  // Calculate statistics
  const totalQuestions = questions.length;
  const answeredCorrectly = useranswer.filter(
    (answer, index) => answer === questions[index].choices[0]
  ).length;
  const answeredIncorrectly = useranswer.filter(
    (answer, index) => answer !== questions[index].choices[0] && answer !== ""
  ).length;
  const skippedQuestions = useranswer.filter((answer) => answer === "").length;

  const correctPercentage = Math.round(
    (answeredCorrectly / totalQuestions) * 100
  );
  const incorrectPercentage = Math.round(
    (answeredIncorrectly / totalQuestions) * 100
  );
  const skippedPercentage = Math.round(
    (skippedQuestions / totalQuestions) * 100
  );

  // Use useEffect to transition from orange to green/red after a delay
  useEffect(() => {
    // Set a timer to change the color after a short delay
    const timer = setTimeout(() => {
      setShowActiveColor(false);
    }, 1000); // 1000ms = 1 second delay

    // Clean up the timer when the component unmounts or if dependencies change
    return () => clearTimeout(timer);
  }, [useranswer]); // Re-run effect whenever user answers

  return (
    <div className="flex flex-col justify-center items-center h-full mt-8 quiz-results">
      <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-cyan-500 p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white mb-6">
          Quiz Results
        </h2>

        {/* Statistics Section */}
        <div className="w-full mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Statistics
            </h3>
            <div className="flex justify-around text-lg text-gray-800 font-medium">
              <div className="flex flex-col items-center">
                <div className="text-green-600">{correctPercentage}%</div>
                <div>Correct</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-red-600">{incorrectPercentage}%</div>
                <div>Incorrect</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-yellow-500">{skippedPercentage}%</div>
                <div>Skipped</div>
              </div>
            </div>
          </div>
        </div>

        {/* List of Questions and Answers */}
        <ul className="w-full max-w-3xl space-y-4">
          {questions.map((question, index) => (
            <li
              key={index}
              className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
                showActiveColor
                  ? "bg-orange-300 text-black font-serif" // Active color initially
                  : question.choices[0] === useranswer[index]
                  ? "bg-green-200 text-black font-serif" // Green if correct
                  : "bg-red-200 text-black font-serif" // Red if incorrect
              }`}>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
                  <strong className="block md:inline">
                    {index + 1}. {question.question}
                  </strong>
                  <span className="block text-sm text-gray-800">
                    Your Answer: {useranswer[index] || "N/A"}, Correct Answer:{" "}
                    {question.choices[0]}
                  </span>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
                      showActiveColor
                        ? "bg-orange-500 text-white" // Active color initially
                        : question.choices[0] === useranswer[index]
                        ? "bg-green-500 text-white" // Green if correct
                        : "bg-red-500 text-white" // Red if incorrect
                    }`}>
                    {showActiveColor
                      ? "Checking..." // Text when showing active color
                      : question.choices[0] === useranswer[index]
                      ? "Correct"
                      : "Incorrect"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Restart Quiz Button */}
        <button
          onClick={handleRestartQuiz}
          className="text-white bg-gradient-to-r from-green-600 to-teal-600 hover:bg-green-700 text-xl tracking-wider mt-8 px-8 py-2 rounded-md shadow-lg transition-all duration-300">
          Restart Quiz
        </button>
      </div>
    </div>
  );
}
