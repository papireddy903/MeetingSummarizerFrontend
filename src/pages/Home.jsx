
import InputForm from "../components/InputForm";

const Home = () => {

  return (
    <div className="flex flex-col justify-start mt-16 items-center min-h-screen px-6">
      <h1 className="text-4xl font-extrabold text-center max-w-3xl">
        AI-powered Meeting Notes Summarizer & Sharer
      </h1>

      <InputForm />
    </div>
  );
};

export default Home;
