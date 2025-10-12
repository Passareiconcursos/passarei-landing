export function SocialProof() {
  return (
    <section className="bg-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="text-center text-muted-foreground mb-4 font-medium">
          Candidatos aprovados em:
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span className="text-2xl">🎖️</span>
            <span>PM-SP</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span className="text-2xl">🎖️</span>
            <span>PC-RJ</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span className="text-2xl">🎖️</span>
            <span>PRF</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span className="text-2xl">🎖️</span>
            <span>PF</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span className="text-2xl">🎖️</span>
            <span>PM-MG</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2 text-muted-foreground font-semibold">
            <span>+28 concursos</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base">
          <div className="text-foreground font-semibold">
            +2.847 estudando
          </div>
          <div className="hidden sm:block w-px h-5 bg-border"></div>
          <div className="text-foreground font-semibold">
            87% melhoram em 30 dias
          </div>
          <div className="hidden sm:block w-px h-5 bg-border"></div>
          <div className="text-primary font-semibold">
            154 aprovações 2024
          </div>
        </div>
      </div>
    </section>
  );
}
