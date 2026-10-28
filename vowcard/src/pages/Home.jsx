import HeroSection from '@/sections/HeroSection';
import TemplatesPreviewSection from '@/sections/TemplatesPreviewSection';
import FeaturesSection from '@/sections/FeaturesSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import PricingSection from '@/sections/PricingSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TemplatesPreviewSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
    </main>
  );
}