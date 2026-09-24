// ─── Community Feature Types ──────────────────────────────────────────────────
// These match the Pydantic schemas in backend/app/schemas/community.py

export type ActivityType =
  | 'LEARNING_COMPLETED'
  | 'PROBLEM_SOLVED'
  | 'RESOURCE_SHARED'
  | 'PROJECT_SHARED'
  | 'COURSE_COMPLETED'
  | 'MILESTONE'
  | 'CUSTOM_POST';

export type FeedFilter =
  | 'all'
  | 'following'
  | 'dsa'
  | 'java'
  | 'python'
  | 'sql'
  | 'aptitude'
  | 'interview'
  | 'resources'
  | 'projects';

export interface CommunityAuthor {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  university?: string | null;
}

export interface LearningActivityOut {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  title: string;
  description?: string | null;
  subject_slug?: string | null;
  topic_slug?: string | null;
  problem_id?: string | null;
  resource_id?: string | null;
  roadmap_id?: string | null;
  tags?: string | null;
  visibility: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  tags?: string | null;
  visibility: string;
  created_at: string;
  updated_at: string;
  author?: CommunityAuthor | null;
  activity?: LearningActivityOut | null;
  like_count: number;
  comment_count: number;
  user_has_liked: boolean;
}

export interface DateGroup {
  label: string;  // "TODAY", "YESTERDAY", "September 22"
  date: string;   // ISO date string
  posts: CommunityPost[];
}

export interface FeedResponse {
  groups: DateGroup[];
  total: number;
  has_more: boolean;
  next_offset?: number | null;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: CommunityAuthor | null;
}

export interface CommunityStats {
  active_today: number;
  total_posts: number;
  trending_tags: string[];
}

export interface CreatePostPayload {
  content: string;
  tags?: string;
  post_type?: string;
  visibility?: string;
  activity_type?: ActivityType;
  activity_title?: string;
  subject_slug?: string;
  topic_slug?: string;
  problem_id?: string;
  resource_id?: string;
}

export interface CreateCommentPayload {
  content: string;
}

export interface LikeResponse {
  liked: boolean;
  like_count: number;
}

export interface FollowResponse {
  following: boolean;
  message: string;
}

// ─── Activity helpers ─────────────────────────────────────────────────────────

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  LEARNING_COMPLETED: 'Completed a lesson',
  PROBLEM_SOLVED:     'Solved a problem',
  RESOURCE_SHARED:    'Shared a resource',
  PROJECT_SHARED:     'Shared a project',
  COURSE_COMPLETED:   'Completed a course',
  MILESTONE:          'Reached a milestone',
  CUSTOM_POST:        'Shared progress',
};

export const ACTIVITY_TYPE_EMOJI: Record<ActivityType, string> = {
  LEARNING_COMPLETED: '🎓',
  PROBLEM_SOLVED:     '🧠',
  RESOURCE_SHARED:    '📚',
  PROJECT_SHARED:     '🛠️',
  COURSE_COMPLETED:   '✅',
  MILESTONE:          '🏆',
  CUSTOM_POST:        '💬',
};

/** Build the deep-link back into the appropriate StudyHub page for an activity */
export function activityLink(activity: LearningActivityOut): string | null {
  switch (activity.activity_type) {
    case 'LEARNING_COMPLETED':
    case 'COURSE_COMPLETED':
      if (activity.subject_slug && activity.topic_slug)
        return `/learn/${activity.subject_slug}/${activity.topic_slug}`;
      if (activity.subject_slug)
        return `/learn/${activity.subject_slug}`;
      return '/learn';
    case 'PROBLEM_SOLVED':
      return activity.problem_id ? `/practice` : '/practice';
    case 'RESOURCE_SHARED':
      return '/resources';
    case 'PROJECT_SHARED':
      return '/tools';
    default:
      return null;
  }
}

export const FEED_FILTERS: { id: FeedFilter; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'following', label: 'Following' },
  { id: 'dsa',       label: 'DSA' },
  { id: 'java',      label: 'Java' },
  { id: 'python',    label: 'Python' },
  { id: 'sql',       label: 'SQL' },
  { id: 'aptitude',  label: 'Aptitude' },
  { id: 'interview', label: 'Interview' },
  { id: 'resources', label: 'Resources' },
  { id: 'projects',  label: 'Projects' },
];
