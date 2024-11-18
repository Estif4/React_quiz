import quizlogo from "../assets/quizlog.png";

export default function Header() {
  return (
    <header className="flex justify-center items-center">
      <div className="flex flex-col justify-center items-center mt-2 font-serif ">
        <div>
          <img
            className="w-16 h-12 object-fit "
            src={quizlogo}
            alt="Quiz Logo"
          />
        </div>
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold tracking-[4px]">
            ReactQuiz
          </h1>
        </div>
      </div>
    </header>
  );
}
