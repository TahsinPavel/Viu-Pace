import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { DashboardPreview } from "@/components/dashboard-preview";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-blue-600 selection:text-white">
      {/* Navbar with Top Right Dashboard Button */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Core Features */}
        <Features />

        {/* Live Interactive Product Preview */}
        <DashboardPreview />

        {/* SaaS Pricing Plans */}
        <Pricing />

        {/* Customer Testimonials */}
        <Testimonials />

        {/* High-Impact CTA */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
