import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface DecodedToken {
  userId: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<{ username: string; bio: string; imageUrl?: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        navigate('/signin');
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const res = await getUserProfile(decoded.userId);
        setUser(res.data);
        setUsername(res.data.username);
        setBio(res.data.bio || '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login');
      return;
    }

    try {
      setLoading(true);
      const decoded = jwtDecode<DecodedToken>(token);

      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      if (image) formData.append('image', image);

      await updateUserProfile(token, decoded.userId, formData);
      toast.success('Profile updated!');
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('Logged out!');
    navigate('/');
  };

  if (!user) return <p className="text-center text-white mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center">
          {user.imageUrl && !image ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full mb-3 object-cover border border-gray-600"
            />
          ) : image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-20 h-20 rounded-full mb-3 object-cover border border-gray-600"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 text-white flex items-center justify-center text-2xl font-bold mb-3">
              {user.username[0].toUpperCase()}
            </div>
          )}
          {!editMode && <h2 className="text-xl font-semibold">@{user.username}</h2>}
        </div>

        <div className="mt-6 space-y-4">
          {editMode ? (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-white"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-white"
                placeholder="Your bio"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-400"
              />
              {image && (
                <div className="flex justify-center mt-2">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border border-gray-500"
                  />
                </div>
              )}
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-2 bg-blue-600 rounded-md hover:bg-blue-700 font-medium"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <p><span className="text-gray-400">Username:</span> @{user.username}</p>
              <p><span className="text-gray-400">Bio:</span> {user.bio || 'No bio added yet'}</p>
              <button
                onClick={() => setEditMode(true)}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md mt-2"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 py-2 bg-gray-700 text-sm hover:text-red-300 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
