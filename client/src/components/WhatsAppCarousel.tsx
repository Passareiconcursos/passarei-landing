import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export function WhatsAppCarousel() {
  return (
    <div className="lg:hidden w-full px-4 py-8">
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1.1}
        centeredSlides
        pagination={{ clickable: true }}
        className="w-full pb-12"
      >
        
        {/* Card 1: Conteúdo */}
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-xl border-8 border-gray-800 overflow-hidden">
            
            {/* Notch */}
            <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-3xl"></div>
            
            {/* Tela */}
            <div className="bg-[#ECE5DD] min-h-[400px] p-4">
              
              {/* Header WhatsApp */}
              <div className="bg-[#18cb96] text-white px-3 py-2 rounded-t-xl flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#18cb96] font-bold text-sm">P</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">PASSAREI</div>
                  <div className="text-xs opacity-90">online</div>
                </div>
              </div>
              
              {/* Mensagem 1 */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm mb-3 max-w-[85%]">
                <p className="text-sm">📚 Bom dia! Vamos estudar?</p>
              </div>
              
              {/* Mensagem 2 */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%]">
                <p className="text-sm font-semibold mb-2">Hoje: Princípio da Legalidade</p>
                <p className="text-xs text-gray-600">
                  Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei...
                </p>
              </div>
              
            </div>
          </div>
        </SwiperSlide>
        
        {/* Card 2: Questão */}
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-xl border-8 border-gray-800 overflow-hidden">
            
            {/* Notch */}
            <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-3xl"></div>
            
            {/* Tela */}
            <div className="bg-[#ECE5DD] min-h-[400px] p-4">
              
              {/* Header WhatsApp */}
              <div className="bg-[#18cb96] text-white px-3 py-2 rounded-t-xl flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#18cb96] font-bold text-sm">P</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">PASSAREI</div>
                  <div className="text-xs opacity-90">online</div>
                </div>
              </div>
              
              {/* Questão */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm mb-3 max-w-[90%]">
                <p className="text-xs font-semibold text-[#18cb96] mb-2">🎯 QUESTÃO 1/5 - VUNESP</p>
                <p className="text-sm mb-3">Sobre o princípio da legalidade:</p>
                <div className="text-xs space-y-1.5">
                  <p>A) Administrador pode tudo</p>
                  <p>B) Particular pode tudo</p>
                  <p className="font-semibold">C) Lei limita administração ✓</p>
                  <p>D) Decreto = Lei</p>
                </div>
              </div>
              
              {/* Resposta usuário */}
              <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 shadow-sm ml-auto max-w-[40%] mb-3">
                <p className="text-sm text-right">C</p>
              </div>
              
            </div>
          </div>
        </SwiperSlide>
        
        {/* Card 3: Feedback */}
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-xl border-8 border-gray-800 overflow-hidden">
            
            {/* Notch */}
            <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-3xl"></div>
            
            {/* Tela */}
            <div className="bg-[#ECE5DD] min-h-[400px] p-4">
              
              {/* Header WhatsApp */}
              <div className="bg-[#18cb96] text-white px-3 py-2 rounded-t-xl flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#18cb96] font-bold text-sm">P</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">PASSAREI</div>
                  <div className="text-xs opacity-90">online</div>
                </div>
              </div>
              
              {/* Feedback */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[90%]">
                <p className="text-sm font-bold text-[#18cb96] mb-2">✅ CORRETO! +10 pontos</p>
                <p className="text-xs text-gray-600 mb-3">
                  Perfeito! A alternativa C está correta porque o princípio da legalidade estabelece que...
                </p>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-2 text-xs">
                  <p className="font-semibold text-red-700 mb-1">❌ Por que as outras estão erradas:</p>
                  <p className="text-gray-600">A) Administrador limitado pela lei</p>
                  <p className="text-gray-600">B) Particular pode o que não é proibido</p>
                  <p className="text-gray-600">D) Decreto ≠ Lei</p>
                </div>
              </div>
              
            </div>
          </div>
        </SwiperSlide>
        
      </Swiper>
    </div>
  );
}
