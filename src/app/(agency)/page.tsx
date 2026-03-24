import Hero from "@/components/Hero";
import LogoCarousel from "@/components/LogoCarousel";
import CalendlyButton from "@/components/CalendlyButton";
import SuccessStories from "@/components/SuccessStories";

export default function Home() {
  const heroTitle = ["THE", "B2B", "WEBSITE", "AGENCY", "THAT", "FEEDS", "YOUR", "GROWTH"];
  const heroSubtitle = ["Better leads", "—", "More sales", "—", "Big results"];

  return (
    <main>
      <Hero title={heroTitle} subtitle={heroSubtitle} />
      
      <LogoCarousel />

      <section className="container" style={{ padding: '8rem 2rem' }}>
         <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>
              <span className="word-effect"><span>We’re&nbsp;</span></span>
              <span className="word-effect"><span>the&nbsp;</span></span>
              <span className="word-effect"><span>B2B&nbsp;</span></span>
              <span className="word-effect"><span>web&nbsp;</span></span>
              <span className="word-effect"><span>agency&nbsp;</span></span>
              <span className="word-effect"><span>that&nbsp;</span></span>
              <span className="word-effect"><span>knows&nbsp;</span></span>
              <span className="word-effect"><span>what&nbsp;</span></span>
              <span className="word-effect"><span>works.</span></span>
            </h2>
            <p style={{ fontSize: '1.5rem', lineHeight: '1.6', opacity: 0.8, marginBottom: '3rem' }}>
              BIGFISH by Peno build and optimise websites that give a real return for middle-market and enterprise B2B companies.
            </p>
            <CalendlyButton />
         </div>
      </section>

      <SuccessStories />
    </main>
  );
}
