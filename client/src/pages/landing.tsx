import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { ParaQuemE } from "@/components/sections/ParaQuemE";
import { Beneficios } from "@/components/sections/Beneficios";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { Comparativo } from "@/components/sections/Comparativo";
import { Pricing } from "@/components/sections/Pricing";
import { Depoimentos } from "@/components/sections/Depoimentos";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/sections/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <SocialProof />
      <ParaQuemE />
      <Beneficios />
      <ComoFunciona />
      <Comparativo />
      <Pricing />
      <Depoimentos />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  );
}
