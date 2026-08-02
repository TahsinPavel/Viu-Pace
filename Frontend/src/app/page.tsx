import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Findings } from "@/components/marketing/findings";
import { Method } from "@/components/marketing/method";
import { Scope } from "@/components/marketing/scope";
import { Pricing } from "@/components/marketing/pricing";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <Header />
      <main>
        <Hero />
        <Findings />
        <Method />
        <Scope />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
