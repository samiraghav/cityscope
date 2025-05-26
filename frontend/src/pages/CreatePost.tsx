import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getUserProfile } from '../services/api';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';

interface DecodedToken {
  userId: string;
}

const CreatePost = () => {
  const [formData, setFormData] = useState({ text: '', type: '', location: '' });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const res = await getUserProfile(decoded.userId);
        setUsername(res.data.username);
        setUserImage(res.data.imageUrl || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsername();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to create a post');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('text', formData.text);
      data.append('type', formData.type);
      data.append('location', formData.location);
      if (image) data.append('image', image);

      await createPost(token, data);
      toast.success('Post created!');
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-lg space-y-5 border border-gray-800 mb-16"
        encType="multipart/form-data"
      >
        <div className="flex items-center gap-3">
          {userImage ? (
            <img src={userImage} alt="User" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-9 h-9 text-gray-500" />
          )}
          <span className="font-semibold text-white">@{username || 'user'}</span>
        </div>

        <h2 className="text-xl font-bold text-gray-200">What's happening?</h2>

        <textarea
          name="text"
          placeholder="Share your thoughts..."
          value={formData.text}
          onChange={handleChange}
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-24"
          required
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            required
          >
            <option value="">Select Type</option>
            <option value="recommend">Recommend</option>
            <option value="help">Help</option>
            <option value="update">Update</option>
            <option value="event">Event</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            required
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition rounded-md"
        />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-full rounded-md border border-gray-700 object-cover max-h-[300px]"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 rounded-md font-semibold transition-all ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
