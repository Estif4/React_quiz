import { useEffect } from "react";

export default function QuestionTimer({
  remaingtime,
  setremaingtime,
  progressBarWidth,
  setProgressBarWidth,
  time,
  activequestionIndex,
  isquizcomplete,
  questions,
  handleAnswerClick,
}) {
  useEffect(() => {
    if (!isquizcomplete && activequestionIndex < questions.length) {
      const timer = setTimeout(() => {
        handleAnswerClick(""); // Automatically answer after time expires
      }, time);

      // Cleanup the timeout when the component unmounts or state changes
      return () => clearTimeout(timer);
    }
  }, [activequestionIndex, isquizcomplete, time, handleAnswerClick]);

  useEffect(() => {
    if (!isquizcomplete && activequestionIndex < questions.length) {
      const interval = setInterval(() => {
        setremaingtime((prev) => {
          const newTime = prev - 1000; // Decrease by 1 second
          if (newTime <= 0) {
            clearInterval(interval); // Stop the interval when time runs out
          }
          return newTime;
        });
      }, 1000); // Update every second

      // Cleanup the interval on component unmount or other state changes
      return () => clearInterval(interval);
    }
  }, [activequestionIndex, isquizcomplete, setremaingtime]);

  // Update the progress bar width based on the remaining time
  useEffect(() => {
    const newWidth = (remaingtime / time) * 100;
    setProgressBarWidth(newWidth);
  }, [remaingtime, time, setProgressBarWidth]);

  return (
    <div
      style={{ width: `${progressBarWidth}%` }}
      className={`h-2 transition-width duration-100 ${
        progressBarWidth > 30 ? "bg-green-500" : "bg-red-500"
      }`}></div>
  );
}
