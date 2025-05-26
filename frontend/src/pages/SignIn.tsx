import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login(formData.username, formData.password);
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast.error('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-sm sm:max-w-md bg-[#16181c] p-6 rounded-2xl shadow-xl border border-[#2f3336]">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Log in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-400 mt-2">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline font-semibold">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
