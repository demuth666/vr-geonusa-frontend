import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamSection from '@/features/landing/TeamSection';
import { useReveal } from '@/hooks/useReveal';

/** PRD #11: route publik /team — seksi Tim Peneliti LFS. */
export default function TeamPage() {
  useReveal();
  return (
    <div className="page">
      <div className="blob-bg" aria-hidden="true" />
      <Navbar />
      <main className="page-main">
        <TeamSection headingLevel="h1" />
      </main>
      <Footer />
    </div>
  );
}
