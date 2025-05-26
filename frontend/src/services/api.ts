import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// -------------------- AUTH --------------------

export const signup = (formData: FormData) =>
  api.post('/auth/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

// -------------------- POSTS --------------------

export const createPost = (token: string, formData: FormData) =>
  api.post('/posts/create', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

export const getPosts = (location?: string, type?: string) =>
  api.get('/posts', { params: { location, type } });

export const reactToPost = (token: string, postId: string, type: 'like' | 'dislike') =>
  api.post(
    `/posts/${postId}/react`,
    { type },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// -------------------- REPLIES --------------------

export const createReply = (token: string, postId: string, text: string) => {
  const formData = new FormData();
  formData.append('postId', postId);
  formData.append('text', text);

  return api.post(`/reply/create`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getReplies = (postId: string) =>
  api.get(`/reply/${postId}`);

// -------------------- USERS --------------------

export const getUserProfile = (userId: string) =>
  api.get(`/users/${userId}`);

export const updateUserProfile = (token: string, userId: string, formData: FormData) =>
  api.put(`/users/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });


export const getPublicUserProfile = (userId: string) =>
  api.get(`/users/${userId}/profile`);
