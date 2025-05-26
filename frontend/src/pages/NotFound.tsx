import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
      <h2 className="mt-4 text-3xl sm:text-4xl font-bold">This page doesn’t exist</h2>
      <p className="mt-3 text-gray-400 max-w-md">
        Sorry, we couldn’t find the page you’re looking for. It might have been removed or never existed.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition font-semibold text-white"
      >
        Go back to Home
      </button>
    </div>
  );
};

export default NotFound;
