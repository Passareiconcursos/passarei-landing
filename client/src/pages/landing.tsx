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
      <a href="#como-funciona" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:top-2 focus:left-2 focus:rounded">
        Pular para o conteúdo
      </a>
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
      <div id="cta-final">
        <CTAFinal />
      </div>
      <Footer />
    </div>
  );
}
