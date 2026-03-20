import Hero from "@/components/Hero";
import CalendlyButton from "@/components/CalendlyButton";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug.join("/");

  // Simple mapping for common pages
  const pageData: Record<string, { title: string[]; subtitle: string[] }> = {
    "b2b-website-design": {
      title: ["B2B", "WEBSITE", "DESIGN"],
      subtitle: ["Websites", "that", "work", "as", "hard", "as", "you", "do"],
    },
    "website-optimisation": {
      title: ["WEBSITE", "OPTIMISATION"],
      subtitle: ["Maximum", "performance", "for", "maximum", "growth"],
    },
    "specialisms/websites-for-manufacturers": {
      title: ["WEBSITES", "FOR", "MANUFACTURERS"],
      subtitle: ["Industrial", "strength", "digital", "performance"],
    },
    "specialisms/oil-gas-energy": {
      title: ["OIL", "GAS", "AND", "ENERGY"],
      subtitle: ["Powering", "the", "energy", "sector's", "growth"],
    },
  };

  const data = pageData[path];

  if (!data && !path.startsWith("specialisms")) {
    // If not in our map and not a specialism, show 404
    notFound();
  }

  // Fallback for specialisms not explicitly mapped
  const title = data ? data.title : path.split("/").pop()?.replace(/-/g, " ").toUpperCase().split(" ") || ["PAGE"];
  const subtitle = data ? data.subtitle : ["Expertise", "in", "the", "B2B", "sector"];

  return (
    <main>
      <Hero title={title} subtitle={subtitle} />
      
      <section className="container" style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>{title.join(" ")}</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '3rem' }}>
            We specialize in building high-performance websites for {title.join(" ").toLowerCase()}. 
            Our approach is built on data, design, and a deep understanding of B2B buyer behavior.
          </p>
          <CalendlyButton />
        </div>
      </section>

      <section className="bg-blush" style={{ padding: '8rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>STRATEGIC DESIGN</h3>
              <p style={{ opacity: 0.7 }}>Aligning your website with your business goals and customer needs.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>TECHNICAL EXCELLENCE</h3>
              <p style={{ opacity: 0.7 }}>Fast, secure, and SEO-optimized architecture that scales with you.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>CONVERSION FOCUS</h3>
              <p style={{ opacity: 0.7 }}>Turning visitors into qualified leads and measurable revenue.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
