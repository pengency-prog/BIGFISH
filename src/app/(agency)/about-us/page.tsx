import Hero from "@/components/Hero";

export default function AboutPage() {
  const heroTitle = ["WE", "ARE", "BIGFISH", "BY", "PENO"];
  const heroSubtitle = ["The", "B2B", "website", "specialists"];

  return (
    <main>
      <Hero title={heroTitle} subtitle={heroSubtitle} />
      
      <section className="container" style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2rem' }}>
            We help B2B companies in the **UK and Nigeria** solve complex marketing challenges through high-performance websites.
            In a world of generic agencies, we specialize in the unique needs of the B2B sector across these dynamic markets.
          </p>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
            Led by **Peno**, our team combines international strategy, premium design, and robust engineering to deliver 
            results that matter: more leads, better conversions, and measurable growth for global brands.
          </p>
        </div>
      </section>

      <section className="bg-blush" style={{ padding: '8rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>B2B EXPERTISE</h3>
              <p style={{ opacity: 0.7 }}>We understand long sales cycles, complex buying committees, and technical products.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>DATA DRIVEN</h3>
              <p style={{ opacity: 0.7 }}>Every design decision is backed by data and focused on conversion rate optimization.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>RESULTS FOCUSED</h3>
              <p style={{ opacity: 0.7 }}>We don&apos;t just build websites that look good; we build tools that drive growth.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
