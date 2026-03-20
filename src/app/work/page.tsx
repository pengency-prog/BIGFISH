import Hero from "@/components/Hero";
import SuccessStories from "@/components/SuccessStories";

export default function WorkPage() {
  const heroTitle = ["OUR", "B2B", "SUCCESS", "STORIES"];
  const heroSubtitle = ["Real results", "for", "real brands"];

  return (
    <main>
      <Hero title={heroTitle} subtitle={heroSubtitle} />
      <SuccessStories />
      
      <section className="container" style={{ padding: '8rem 2rem' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>We Make B2B Websites Perform</h2>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '800px' }}>
          From manufacturing to energy, we help middle-market companies grow their revenue through 
          high-performance website design and conversion rate optimisation.
        </p>
      </section>
    </main>
  );
}
