import { apiClient } from './client';
import type {
  FeedResponse,
  FeedFilter,
  CommunityPost,
  PostComment,
  CommunityStats,
  CreatePostPayload,
  CreateCommentPayload,
  LikeResponse,
  FollowResponse,
  LearningActivityOut,
  UserSummary,
  CommunityAuthor,
} from '@/lib/types/community';
import type { ActivityType } from '@/lib/types/community';

const BASE = '/community';

export const communityApi = {
  // ─── Feed ─────────────────────────────────────────────────────────────────
  getFeed: async (
    filter: FeedFilter = 'all',
    limit = 20,
    offset = 0,
    userId?: string,
    opts: { category?: string; sort?: 'new' | 'top' } = {},
  ): Promise<FeedResponse> => {
    const qs = new URLSearchParams({ filter, limit: String(limit), offset: String(offset), sort: opts.sort ?? 'new' });
    if (userId) qs.set('user_id', userId);
    if (opts.category) qs.set('category', opts.category);
    return apiClient.get(`${BASE}/feed?${qs}`);
  },

  getPublicFeed: async (
    filter: FeedFilter = 'all',
    limit = 20,
    offset = 0,
  ): Promise<FeedResponse> => {
    return apiClient.get(
      `${BASE}/feed/public?filter=${filter}&limit=${limit}&offset=${offset}`,
    );
  },

  // ─── Posts ────────────────────────────────────────────────────────────────
  createPost: async (payload: CreatePostPayload): Promise<CommunityPost> => {
    return apiClient.post(`${BASE}/posts`, payload);
  },

  getPost: (postId: string): Promise<CommunityPost> => apiClient.get(`${BASE}/posts/${postId}`),

  deletePost: (postId: string): Promise<void> => apiClient.delete(`${BASE}/posts/${postId}`),

  // ─── Learners ─────────────────────────────────────────────────────────────
  getUser: (userId: string): Promise<UserSummary> => apiClient.get(`${BASE}/users/${userId}`),

  getSuggestions: (limit = 5): Promise<UserSummary[]> => apiClient.get(`${BASE}/suggestions?limit=${limit}`),

  searchLearners: (q: string): Promise<CommunityAuthor[]> => apiClient.get(`${BASE}/learners?q=${encodeURIComponent(q)}`),

  // ─── Likes ────────────────────────────────────────────────────────────────
  toggleLike: async (postId: string): Promise<LikeResponse> => {
    return apiClient.post(`${BASE}/posts/${postId}/like`, {});
  },

  // ─── Comments ─────────────────────────────────────────────────────────────
  getComments: async (postId: string): Promise<PostComment[]> => {
    return apiClient.get(`${BASE}/posts/${postId}/comments`);
  },

  createComment: async (postId: string, payload: CreateCommentPayload): Promise<PostComment> => {
    return apiClient.post(`${BASE}/posts/${postId}/comments`, payload);
  },

  deleteComment: async (commentId: string): Promise<void> => {
    return apiClient.delete(`${BASE}/comments/${commentId}`);
  },

  // ─── Follows ──────────────────────────────────────────────────────────────
  toggleFollow: async (userId: string): Promise<FollowResponse> => {
    return apiClient.post(`${BASE}/users/${userId}/follow`, {});
  },

  // ─── Activity Logging ─────────────────────────────────────────────────────
  logActivity: async (payload: {
    activity_type: ActivityType;
    title: string;
    description?: string;
    subject_slug?: string;
    topic_slug?: string;
    problem_id?: string;
    resource_id?: string;
    roadmap_id?: string;
    tags?: string;
    visibility?: string;
  }): Promise<LearningActivityOut> => {
    return apiClient.post(`${BASE}/activities`, payload);
  },

  // ─── Stats ────────────────────────────────────────────────────────────────
  getStats: async (): Promise<CommunityStats> => {
    return apiClient.get(`${BASE}/stats`);
  },
};
