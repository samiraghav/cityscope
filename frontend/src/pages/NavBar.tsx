import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { FaHome, FaPlus, FaSignOutAlt } from 'react-icons/fa';

interface DecodedToken {
  userId: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const res = await getUserProfile(decoded.userId);
        setUsername(res.data.username);
        setProfilePic(res.data.imageUrl || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-black text-white p-6 flex-col gap-8 border-r border-gray-800">
        <h1
          className="text-2xl font-bold mb-6 cursor-pointer hover:text-blue-400 transition"
          onClick={() => navigate('/feed')}
        >
          Cityscope
        </h1>

        <button
          onClick={() => navigate('/feed')}
          className="flex items-center gap-3 text-lg font-medium hover:text-blue-400 transition"
        >
          <FaHome /> Feed
        </button>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center gap-3 text-lg font-medium hover:text-blue-400 transition"
        >
          <FaPlus /> Post
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 text-lg font-medium hover:text-blue-400 transition"
        >
          {profilePic ? (
            <img src={profilePic} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
              {username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 text-lg font-medium text-white-500 hover:text-red-400 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center py-3 z-50">
        <button onClick={() => navigate('/feed')} className="flex flex-col items-center text-white hover:text-blue-400 transition">
          <FaHome size={18} />
          <span className="text-xs">Feed</span>
        </button>
        <button onClick={() => navigate('/create')} className="flex flex-col items-center text-white hover:text-blue-400 transition">
          <FaPlus size={18} />
          <span className="text-xs">Post</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-white hover:text-blue-400 transition">
          {profilePic ? (
            <img src={profilePic} className="w-6 h-6 rounded-full mb-1" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-700 text-sm flex items-center justify-center mb-1 font-semibold">
              {username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="text-xs">You</span>
        </button>
      </div>
    </>
  );
};

export default Navbar;
