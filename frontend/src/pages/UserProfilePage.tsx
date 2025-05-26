import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicUserProfile } from '../services/api';
import { FaThumbsUp, FaThumbsDown, FaUserCircle } from 'react-icons/fa';

const UserPublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPublicUserProfile(userId as string);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  if (!profile) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-0 mb-16">
      <div className="max-w-2xl mx-auto bg-[#111] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          {profile.imageUrl ? (
            <img src={profile.imageUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-12 h-12 text-gray-500" />
          )}
          <div>
            <h2 className="text-lg font-semibold">@{profile.username}</h2>
            <p className="text-gray-400 text-sm">{profile.bio || 'No bio yet'}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 border-b border-gray-700 pb-1">Posts</h3>
        {profile.posts.length === 0 ? (
          <p className="text-gray-500">No posts yet</p>
        ) : (
          profile.posts.map((post: any) => (
            <div key={post.id} className="bg-[#111] text-white rounded-xl p-4 shadow-md border border-gray-800 mb-2">
              <p className="text-white mb-1">{post.text}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full max-h-[200px] object-contain rounded mb-2"
                />
              )}
              <div className="text-xs text-gray-400 flex justify-between mb-2">
                <span>📍 {post.location}</span>
                <span className='px-2 py-1 rounded-full text-xs font-medium bg-green-700 text-green-300'>{post.type}</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <FaThumbsUp size={14} 
                  className="hover:text-blue-400 flex items-center gap-1"
                  /> {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <FaThumbsDown size={14}
                  className="hover:text-red-400 flex items-center gap-1"
                  /> {post.dislikes}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPublicProfile;
