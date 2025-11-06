import { Concursos } from "@/components/sections/Concursos";
import { Header } from "@/components/Header";
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
      <Header />
      <Hero />
      <Concursos />
      <div id="social-proof">
        <SocialProof />
      </div>
      <ParaQuemE />
      <Beneficios />
      <div id="como-funciona">
        <ComoFunciona />
      </div>
      <Comparativo />
      <div id="planos">
        <Pricing />
      </div>
      <div id="depoimentos">
        <Depoimentos />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <CTAFinal />
      <Footer />
    </div>
  );
}
