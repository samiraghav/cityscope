
import { useEffect, useState, useCallback } from 'react';
import { getPosts, reactToPost } from '../services/api';
import toast from 'react-hot-toast';
import { FaThumbsUp, FaThumbsDown, FaUserCircle, FaSpinner, FaGhost } from 'react-icons/fa';
import { LuMessageCircle } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import PostModal from './PostModal';

interface Post {
  id: string;
  text: string;
  type: string;
  location: string;
  likes: number;
  dislikes: number;
  user: { id: string; username: string; imageUrl?: string };
  createdAt: string;
  imageUrl?: string;
  replies: { id: string; text: string; user: { username: string } }[];
  userReaction?: 'like' | 'dislike' | null;
}

const formatTimeAgo = (dateStr: string) => {
  const now = new Date();
  const postDate = new Date(dateStr);
  const diffMs = now.getTime() - postDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

const badgeColors = {
  recommend: 'bg-green-700 text-green-300',
  help: 'bg-yellow-700 text-yellow-200',
  update: 'bg-blue-700 text-blue-300',
  event: 'bg-purple-700 text-purple-200',
};

const tabs = ['All', 'recommend', 'help', 'update', 'event'];

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPosts(locationFilter, typeFilter);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [locationFilter, typeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (modalPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalPost]);

  const handleReaction = async (postId: string, reaction: 'like' | 'dislike') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in');
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (post.userReaction === reaction) {
      toast.error(`You already ${reaction}d this post`);
      return;
    }

    try {
      await reactToPost(token, postId, reaction);
      toast.success(`Post ${reaction}d!`);

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;

          let likes = p.likes;
          let dislikes = p.dislikes;

          if (reaction === 'like') {
            if (p.userReaction === 'dislike') dislikes -= 1;
            likes += 1;
          } else {
            if (p.userReaction === 'like') likes -= 1;
            dislikes += 1;
          }

          return { ...p, likes, dislikes, userReaction: reaction };
        })
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to react to post');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 overflow-y-auto scrollbar-hide">
      <div className="max-w-3xl mx-auto">
        <div className="flex border-b border-gray-800 mb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab === 'All' ? '' : tab)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
                typeFilter === (tab === 'All' ? '' : tab)
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="mb-4 w-full p-2 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none"
        />

        {loading && (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-400 animate-pulse">
            <FaSpinner className="animate-spin text-3xl mb-4" />
            <p>Loading posts... Our backend is warming up on Render, please wait</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-500">
            <FaGhost className="text-4xl mb-4" />
            <p>No posts found. Try changing the filters or location.</p>
          </div>
        )}

        <div className="space-y-6 mb-16">
          {posts.map((post) => (
            <div key={post.id} className="text-white py-4 px-2 border-b border-gray-800 transition">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <div
                  className="flex gap-2 cursor-pointer hover:underline"
                  onClick={() => navigate(`/profile/${post.user.id}`)}
                >
                  {post.user.imageUrl ? (
                    <img src={post.user.imageUrl} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-500" />
                  )}
                  <div className="flex gap-3 items-center">
                  <span className="font-semibold text-white">@{post.user.username}</span>
                  <span className="text-xs">{formatTimeAgo(post.createdAt)}</span>
                  </div>

                </div>
              </div>

              <p className="text-[15px] text-gray-100 mb-2 whitespace-pre-line">{post.text}</p>

              {post.imageUrl && (
                <img src={post.imageUrl} className="rounded-lg overflow-hidden mb-3 border border-gray-700 w-full max-h-[400px] object-cover" />
              )}

              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>📍 {post.location}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColors[post.type as keyof typeof badgeColors]}`}>
                  {post.type}
                </span>
              </div>

              <div className="flex justify-start gap-6 text-sm text-gray-400 mt-2">
                <button onClick={() => handleReaction(post.id, 'like')} className="hover:text-blue-400 flex items-center gap-1">
                  <FaThumbsUp size={15} /> {post.likes}
                </button>
                <button onClick={() => handleReaction(post.id, 'dislike')} className="hover:text-red-400 flex items-center gap-1">
                  <FaThumbsDown size={15} /> {post.dislikes}
                </button>
                <button onClick={() => setModalPost(post)} className="hover:text-gray-200 flex items-center gap-1">
                  <LuMessageCircle size={15} /> {post.replies.length}
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalPost && <PostModal post={modalPost} onClose={() => setModalPost(null)} />}
      </div>
    </div>
  );
};

export default Feed;
