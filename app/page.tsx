import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { TopicStrip } from "@/components/landing/TopicStrip";
import { LearningPaths } from "@/components/landing/LearningPaths";
import { Roadmap } from "@/components/landing/Roadmap";
import { Resources } from "@/components/landing/Resources";
import { Companies } from "@/components/landing/Companies";
import { Practice } from "@/components/landing/Practice";
import { Labs } from "@/components/landing/Labs";
import { ConceptDecoder } from "@/components/landing/ConceptDecoder";
import { Templates } from "@/components/landing/Templates";
import { KnowledgeMap } from "@/components/landing/KnowledgeMap";
import { AICopilot } from "@/components/landing/AICopilot";
import { Dashboard } from "@/components/landing/Dashboard";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TopicStrip />
        <LearningPaths />
        <Roadmap />
        <Resources />
        <Companies />
        <Practice />
        <Labs />
        <ConceptDecoder />
        <Templates />
        <KnowledgeMap />
        <AICopilot />
        <Dashboard />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
