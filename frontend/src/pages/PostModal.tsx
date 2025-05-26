import { FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import { createReply } from '../services/api';
import toast from 'react-hot-toast';

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

export default function PostModal({ post, onClose }: { post: any; onClose: () => void }) {
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    const token = localStorage.getItem('token');
    if (!token || !replyText.trim()) return;

    try {
      setLoading(true);
      await createReply(token, post.id, replyText);
      toast.success('Reply posted!');
      setReplyText('');
      window.location.reload();
    } catch {
      toast.error('Failed to reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-start md:items-center justify-center p-2 md:p-6 overflow-y-auto">
      <div className="w-full max-w-xl rounded-lg p-4 md:p-6 relative bg-[#111]">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 text-lg">✕</button>

        <div className="pb-4 border-b border-gray-700">
          <div className="flex gap-2 items-center text-sm mb-1">
            {post.user.imageUrl ? (
              <img src={post.user.imageUrl} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <FaUserCircle className="w-10 h-10 text-gray-500" />
            )}

            <div className="font-semibold text-white">@{post.user.username}</div>
            <div className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</div>
          </div>

          <p className="text-gray-200 text-[15px] whitespace-pre-line my-2">{post.text}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              className="w-full max-h-[300px] object-cover rounded mb-3 border border-gray-700"
              alt="Post"
            />
          )}

          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>📍 {post.location}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                badgeColors[post.type as keyof typeof badgeColors]
              }`}
            >
              {post.type}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Post your reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md text-sm text-white"
          />
          <button
            onClick={handleReply}
            disabled={loading}
            className="w-full mt-2 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Replying...' : 'Reply'}
          </button>
        </div>

        {post.replies.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-300 mb-2">Replies</p>
            <div className="space-y-3">
              {post.replies.map((r: any) => (
                <div key={r.id} className="text-sm text-gray-300 border-t border-gray-800 pt-2">
                  <span className="font-semibold">@{r.user.username}</span>: {r.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
