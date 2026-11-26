import type { Metadata } from "next";
import Link from "next/link";
import { ContactLine, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — StudyHub",
  description: "The rules for using StudyHub: your account, acceptable use, your content, AI features and our responsibilities.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <p>
          These terms are the agreement between you and StudyHub when you use the website and app. By creating an account or using StudyHub you
          agree to them. If you don&apos;t agree, please don&apos;t use the service.
        </p>
      }
    >
      <h2>1. Who can use StudyHub</h2>
      <p>
        You must be able to form a binding agreement where you live. If you&apos;re under 18, you may use StudyHub only with your parent or
        guardian&apos;s permission, and they agree to these terms on your behalf.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>Give accurate information and keep your password secret. You&apos;re responsible for what happens under your account.</li>
        <li>One person per account. Don&apos;t share it or sign up for someone else.</li>
        <li>Tell us through <ContactLine /> if you think someone else has used your account.</li>
        <li>
          You can delete your account at any time from <Link href="/settings?tab=data">Settings → Your data</Link>.
        </li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>Use StudyHub to learn and prepare. Don&apos;t:</p>
      <ul>
        <li>Break the law, or infringe anyone else&apos;s rights, including copyright.</li>
        <li>
          Submit code meant to harm the service, such as code that tries to escape the sandbox, attack other systems, mine cryptocurrency or
          use excessive resources.
        </li>
        <li>Probe, scan or test our security, or get around rate limits, without our written permission.</li>
        <li>Scrape or bulk-download content, or use automated tools to access the service, other than normal browser use.</li>
        <li>Copy, resell or republish StudyHub&apos;s lessons, problems or other content as your own.</li>
        <li>Use StudyHub to cheat in a live exam, assessment or interview.</li>
      </ul>
      <p>We may remove content or suspend accounts that break these rules.</p>

      <h2>4. Your content</h2>
      <p>
        You own what you create here: your code, notes and resume. You give us permission to store, process and display it only as needed
        to run StudyHub for you (for example to run your code or sync your progress). This permission ends
        when you delete the content or your account.
      </p>
      <p>Don&apos;t upload anything you don&apos;t have the right to share.</p>

      <h2>5. Our content</h2>
      <p>
        Lessons, problems, roadmaps, company guides, the design and the software belong to StudyHub or its licensors. You may use them for your
        own personal preparation. Some practice problems are adapted from openly licensed sources and stay under their original licences.
      </p>

      <h2>6. AI features</h2>
      <ul>
        <li>
          The assistant, hints, error explanations and resume tools use an AI model. Their answers can be wrong, incomplete or out of date. Check
          anything important before relying on it.
        </li>
        <li>
          What you send to these features is processed by our AI provider, as described in the <Link href="/privacy">Privacy Policy</Link>.
        </li>
        <li>Resume feedback is a suggestion, not a guarantee of how any employer or screening system will judge your resume.</li>
      </ul>

      <h2>7. No guarantee of results</h2>
      <p>
        StudyHub is a study aid. We don&apos;t guarantee that you&apos;ll pass any test or interview, or get any job or offer. Company information
        (rounds, topics, eligibility) is compiled from public sources and can be out of date. Always check the official listing.
      </p>

      <h2>8. The service</h2>
      <p>
        StudyHub is currently free. We work to keep it running, but it may sometimes be unavailable, and we may change, add or remove features.
        If we ever introduce paid features, we&apos;ll tell you the price before you pay anything.
      </p>

      <h2>9. Disclaimers and liability</h2>
      <p>
        StudyHub is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, to the extent the law allows.
        To the extent the law allows, we aren&apos;t liable for indirect or consequential losses, or for lost data, opportunities or profits,
        arising from your use of StudyHub. Nothing in these terms limits rights you have under consumer law that can&apos;t be excluded.
      </p>

      <h2>10. Ending the agreement</h2>
      <p>
        You can stop using StudyHub and delete your account at any time. We may suspend or close an account that seriously or repeatedly breaks
        these terms, and we&apos;ll tell you why unless the law prevents it. Sections 5, 7, 9 and 11 continue after the agreement ends.
      </p>

      <h2>11. Changes and law</h2>
      <p>
        We may update these terms. We&apos;ll change the date at the top, and for significant changes we&apos;ll tell you in the app before they
        take effect. If you keep using StudyHub after that, you accept the new terms. These terms are governed by the laws of India, and the
        courts of India have jurisdiction, without taking away protections the law of your own country gives you.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms: reach us through <ContactLine />.
      </p>
    </LegalPage>
  );
}
