import type { Metadata } from "next";
import Link from "next/link";
import { ContactLine, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — StudyHub",
  description: "What StudyHub collects, why, who it is shared with, and how to export or delete your data.",
};

// Describes what the app actually does today. When a feature starts collecting or sharing something new, update this page.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          StudyHub helps you prepare for placements. To do that we keep your account, your progress and the work you do here. This page says
          exactly what we collect, why, who else sees it, and how you can take it with you or delete it. We don&apos;t sell your data and we
          don&apos;t show ads.
        </p>
      }
    >
      <h2>1. What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> your email address and password (stored hashed by our sign-in provider), or your name, email and
          profile picture if you sign in with Google.
        </li>
        <li>
          <strong>Profile:</strong> what you tell us during setup and on your profile, such as your name, college, graduation year, target role
          and target companies.
        </li>
        <li>
          <strong>Learning activity:</strong> lessons you complete and how far you read, notes, bookmarks, quiz and mock-test answers, your
          review queue, daily-problem history and study logs.
        </li>
        <li>
          <strong>Code you write:</strong> code you run or submit on practice problems and in the playground, its results, and your submission
          history.
        </li>
        <li>
          <strong>Resumes:</strong> if you use the resume tools, the resume you upload or paste (we extract its text), the target company and
          role, any job description you add, and the analysis we produce.
        </li>
        <li>
          <strong>AI conversations:</strong> questions you ask the assistant and the code or text you send with them.
        </li>
        <li>
          <strong>Notifications</strong> we create for you, such as lesson completed or problem solved.
        </li>
        <li>
          <strong>Technical data:</strong> basic request logs (such as IP address, browser and time of request) kept by our servers and hosting
          providers to run the service, stop abuse and fix errors.
        </li>
      </ul>
      <p>We don&apos;t use advertising or third-party analytics trackers.</p>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To run your account and sign you in.</li>
        <li>To save your progress and sync it across your devices.</li>
        <li>To run and grade your code, analyse your resume and answer your questions.</li>
        <li>To show your streaks, heatmap, recommendations and notifications.</li>
        <li>To keep the service secure, prevent abuse (for example rate limits) and fix bugs.</li>
      </ul>
      <p>
        We use your data because you asked us to provide these features, and with your consent where the law requires it. You can withdraw
        consent at any time by deleting the data or your account (see section 6).
      </p>

      <h2>3. Who we share it with</h2>
      <p>We share data only with the services that run StudyHub for us, and only what each needs:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — sign-in and our database (account, profile, progress, notifications, resume analyses).
        </li>
        <li>
          <strong>Google</strong> — only if you choose &ldquo;Continue with Google&rdquo;, to sign you in.
        </li>
        <li>
          <strong>Groq</strong> (AI provider) — the text you send to the AI assistant and resume tools, so it can generate a reply. Don&apos;t
          include information in these requests that you don&apos;t want processed by an AI provider.
        </li>
        <li>
          <strong>Our hosting providers</strong> — the servers that run our website and backend, including the sandbox that runs your code.
        </li>
      </ul>
      <p>
        We may disclose data if the law requires it. We never sell personal data.
      </p>
      <p>These providers may store data outside your country. We choose providers that protect it with industry-standard security.</p>

      <h2>4. Stored on your device</h2>
      <p>
        StudyHub saves some data in your browser&apos;s local storage so it works fast and offline: progress, submissions, notes, theme and
        settings. When you&apos;re signed in, most of this syncs to your account. Clearing your browser data removes the local copy.
      </p>

      <h2>5. Cookies</h2>
      <p>We use only cookies needed to make StudyHub work:</p>
      <ul>
        <li>
          <strong>Sign-in cookies</strong> (from us and Supabase) that keep you signed in.
        </li>
        <li>
          <strong>A setup cookie</strong> that remembers you finished onboarding.
        </li>
      </ul>
      <p>We don&apos;t use advertising or tracking cookies, so there&apos;s nothing to opt out of. Signing out removes the sign-in cookies.</p>

      <h2>6. Your choices and rights</h2>
      <ul>
        <li>
          <strong>See and correct:</strong> edit your profile at any time from <Link href="/profile">Profile</Link>.
        </li>
        <li>
          <strong>Export:</strong> download a copy of your data from <Link href="/settings?tab=data">Settings → Your data</Link>.
        </li>
        <li>
          <strong>Delete:</strong> delete your account from <Link href="/settings?tab=data">Settings → Your data</Link>. This removes your data
          and your login from our systems and can&apos;t be undone.
        </li>
        <li>
          <strong>Notifications:</strong> choose which ones you get in <Link href="/settings?tab=learning">Settings → Learning</Link>.
        </li>
      </ul>
      <p>
        Depending on where you live, you may have further rights, such as to ask what we hold about you, to object to processing or to complain
        to a data protection authority. To use them, contact us through <ContactLine />.
      </p>

      <h2>7. How long we keep it</h2>
      <p>
        We keep your data while your account exists. When you delete your account, we delete your data from our database. Copies in backups and
        provider logs are removed as those roll over, normally within 30 days. We may keep limited records longer if the law requires it.
      </p>

      <h2>8. Security</h2>
      <p>
        Data travels over encrypted connections (HTTPS). Database access is restricted so each user can read and change only their own records.
        Code you submit runs in an isolated sandbox. No system is perfectly secure, so please use a strong, unique password.
      </p>

      <h2>9. Children</h2>
      <p>
        StudyHub is built for students preparing for placements and isn&apos;t meant for children. If you&apos;re under 18, use it only with your
        parent or guardian&apos;s permission. If you believe a child has given us data without that permission, contact us and we&apos;ll delete it.
      </p>

      <h2>10. Changes</h2>
      <p>
        If we change this policy we&apos;ll update the date at the top. If the change is significant, for example a new kind of data or a new
        provider, we&apos;ll tell you in the app before it takes effect.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions or requests about your privacy: reach us through <ContactLine />. See also our <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  );
}
