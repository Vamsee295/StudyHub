import { Course, CourseLesson, CourseModule } from './types';
import { sdFoundationLessons, sdNetworkingLessons } from './system-design-lessons-foundations';
import { sdDataLessons, sdAsyncLessons } from './system-design-lessons-data';
import { sdWalkthroughLessons } from './system-design-lessons-walkthroughs';
import { sdMoreWalkthroughLessons, sdFinalWalkthroughLessons } from './system-design-lessons-walkthroughs-2';

const minutes = (lessons: CourseLesson[]) => lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

const sdModule = (id: string, slug: string, title: string, description: string,
  difficulty: CourseModule["difficulty"], lessons: CourseLesson[]): CourseModule =>
  ({ id, slug, title, description, difficulty, estimatedMinutes: minutes(lessons), lessons });

export const systemDesignCourse: Course = {
  id: "course-system-design",
  slug: "system-design",
  title: "System Design",
  description: "Design scalable systems the way interviewers expect: requirements and estimates, load balancing, caching, databases and sharding, queues, rate limiting, reliability, and step-by-step designs of real products.",
  category: "Placement",
  icon: "Network",
  displayOrder: 7.5,
  modules: [
    sdModule("sd-mod-1", "sd-foundations", "Foundations",
      "The interview framework, scalability vocabulary, estimation and the availability/consistency trade-off.",
      "Intermediate", sdFoundationLessons),
    sdModule("sd-mod-2", "sd-networking", "Networking Building Blocks",
      "DNS, CDNs, load balancers, reverse proxies and API design.",
      "Intermediate", sdNetworkingLessons),
    sdModule("sd-mod-3", "sd-data", "Data Storage and Caching",
      "Replication and sharding, choosing a data store, caching strategies and consistent hashing.",
      "Advanced", sdDataLessons),
    sdModule("sd-mod-4", "sd-async-reliability", "Async Processing and Reliability",
      "Message queues and streams, rate limiting, and patterns that contain failures.",
      "Advanced", sdAsyncLessons),
    sdModule("sd-mod-5", "sd-walkthroughs", "Design Walkthroughs",
      "Complete designs of a URL shortener, news feed, chat system and notification system.",
      "Advanced", sdWalkthroughLessons),
    sdModule("sd-mod-6", "sd-more-walkthroughs", "More Design Walkthroughs",
      "Ride-sharing, video streaming, a web crawler, search autocomplete, payments and file sync.",
      "Advanced", [...sdMoreWalkthroughLessons, ...sdFinalWalkthroughLessons]),
  ],
};
