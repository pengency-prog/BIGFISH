import Hero from "@/components/Hero";
import CalendlyButton from "@/components/CalendlyButton";

export default function ContactPage() {
  const heroTitle = ["GET", "IN", "TOUCH"];
  const heroSubtitle = ["Let&apos;s", "talk", "about", "your", "growth"];

  return (
    <main>
      <Hero title={heroTitle} subtitle={heroSubtitle} />
      
      <section className="container" style={{ padding: '8rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem' }}>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Start Your Journey</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '3rem' }}>
              Whether you need a complete website refresh or want to optimize your current site, 
              we&apos;re here to help you achieve big results.
            </p>
            
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>EMAIL US</h3>
              <a href="mailto:prince@getpeno.com" style={{ fontSize: '1.5rem', fontWeight: 600 }}>prince@getpeno.com</a>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>CALL US</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="tel:+2347044366251" style={{ fontSize: '1.5rem', fontWeight: 600 }}>+234 7044366251 (Nigeria)</a>
                <a href="tel:+447443059220" style={{ fontSize: '1.5rem', fontWeight: 600 }}>+44 7443059220 (UK)</a>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Book an Assessment</h3>
            <p style={{ marginBottom: '3rem', opacity: 0.7 }}>
              Schedule a free 30-minute website assessment call with our experts. 
              No sales pitch, just pure value.
            </p>
            <CalendlyButton />
          </div>
        </div>
      </section>
    </main>
  );
}
