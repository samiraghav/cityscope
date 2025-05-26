import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Users, MapPinned } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/feed');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-700 rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute bottom-0 -right-10 w-80 h-80 bg-purple-700 rounded-full blur-[100px] opacity-10"></div>

      <div className="z-10 text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Local voices. Real stories.
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl mb-8">
          Cityscope helps you connect with your community, stay updated, and be heard — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="/signin"
            className="px-6 py-3 rounded-full font-semibold bg-white text-black hover:bg-gray-200 transition"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="px-6 py-3 rounded-full font-semibold border border-gray-600 hover:border-white transition"
          >
            Join Cityscope
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-4">
          <FeatureCard
            icon={<MapPinned size={28} />}
            title="Stay Informed"
            text="Get real-time updates from people near you."
          />
          <FeatureCard
            icon={<Megaphone size={28} />}
            title="Speak Up"
            text="Post local news, tips, or events in seconds."
          />
          <FeatureCard
            icon={<Users size={28} />}
            title="Engage"
            text="Reply, react and connect with your neighborhood."
          />
        </div>

        <p className="text-xs text-gray-500 mt-16">
          Cityscope — Built for community, powered by connection.
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-4 hover:shadow-lg transition-all">
      <div className="text-blue-400 mb-2">{icon}</div>
      <h3 className="font-semibold text-white text-lg">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{text}</p>
    </div>
  );
};

export default Home;
