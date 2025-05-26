import { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    bio: '',
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('username', formData.username);
      payload.append('password', formData.password);
      payload.append('bio', formData.bio);
      if (formData.image) payload.append('image', formData.image);

      const res = await signup(payload);
      localStorage.setItem('token', res.data.token);
      toast.success('Signup successful!');
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast.error('Signup failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-sm sm:max-w-md bg-[#16181c] p-6 rounded-2xl shadow-xl border border-[#2f3336]">
        <h2 className="text-2xl font-bold mb-4 text-center">Join Cityscope</h2>

        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 bg-[#202327] text-white border border-[#2f3336] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-[#202327] text-white border border-[#2f3336] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            name="bio"
            placeholder="Bio (optional)"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 bg-[#202327] text-white border border-[#2f3336] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="text-sm text-gray-400 file:text-white file:bg-blue-600 file:border-0 file:px-3 file:py-1.5 file:rounded-md file:cursor-pointer"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a href="/signin" className="text-blue-500 hover:underline font-semibold">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
