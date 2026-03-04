import Hero from "@/modules/home/components/Hero";
import HowItWorks from "@/modules/home/components/HowItWorks";
import Features from "@/modules/home/components/Features";
import Stats from "@/modules/home/components/Stats";
import Testimonials from "@/modules/home/components/Testimonials";
import Pricing from "@/modules/home/components/Pricing";
import CTA from "@/modules/home/components/CTA";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Features />
      <Stats />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  );
}
