// Shared sources and a lesson builder for the System Design course.
import { CourseLesson } from './types';

export const SDP = { title: "donnemartin/system-design-primer", url: "https://github.com/donnemartin/system-design-primer", license: "CC BY 4.0" };
export const SRE_BOOK = { title: "Google, Site Reliability Engineering (free online)", url: "https://sre.google/sre-book/table-of-contents/" };
export const AWS_BUILDERS = { title: "Amazon Builders' Library", url: "https://aws.amazon.com/builders-library/" };
export const CLOUDFLARE = { title: "Cloudflare Learning Center", url: "https://www.cloudflare.com/learning/" };
export const DYNAMO = { title: "DeCandia et al., Dynamo: Amazon's Highly Available Key-value Store (2007)", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" };
export const LATENCY = { title: "Latency numbers every programmer should know", url: "https://gist.github.com/jboner/2841832" };
export const HPBN = { title: "Ilya Grigorik, High Performance Browser Networking (free online)", url: "https://hpbn.co/" };
export const AWESOME_SCALABILITY = { title: "binhnguyennus/awesome-scalability", url: "https://github.com/binhnguyennus/awesome-scalability", license: "MIT" };

interface LessonExtras {
  check: { question: string; options: string[]; answer: number; explanation: string };
  takeaways: string[];
  traps: { question: string; trap: string; solution: string }[];
}

export function sdLesson(
  slug: string, title: string, description: string, estimatedMinutes: number,
  theory: string, sources: CourseLesson["content"]["sources"], extras: LessonExtras,
): CourseLesson {
  return {
    id: slug, slug, title, description, estimatedMinutes,
    content: {
      theory, sources,
      sections: [
        { type: "quickCheck", ...extras.check },
        { type: "interviewTraps", title: "Interview traps", traps: extras.traps },
        { type: "takeaways", title: "Key takeaways", items: extras.takeaways },
      ],
    },
  };
}
