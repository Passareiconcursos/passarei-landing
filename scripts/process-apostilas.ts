import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const APOSTILAS = {
  PF: {
    AGENTE: [
      'https://dhg1h5j42swfq.cloudfront.net/2018/04/16104556/Vade-Mecum-Pol%C3%ADcia-Federal-Agente.pdf',
      'https://gratis.estrategiaconcursos.com.br/wp-content/uploads/2021/05/E-book-Resumao-PF.pdf'
    ],
    ESCRIVAO: [
      'https://dhg1h5j42swfq.cloudfront.net/2018/04/16104600/Vade-Mecum-Pol%C3%ADcia-Federal-Escriv%C3%A3o.pdf'
    ],
    DELEGADO: [
      'https://gratis.estrategiaconcursos.com.br/wp-content/uploads/2020/06/VM-PF-Delegado.pdf'
    ]
  },
  PRF: {
    POLICIAL: [
      'https://gratis.estrategiaconcursos.com.br/wp-content/uploads/2023/09/Guia-de-Estudos-PRF-para-INICIANTES.pdf',
      'https://gratis.estrategiaconcursos.com.br/wp-content/uploads/2021/05/prf_ebook_resumao-1.pdf'
    ]
  },
  PC: {
    AGENTE: [
      'https://arq.pciconcursos.com.br/provas/18693381/a34765e0fd22/agente_policia_civil_versao_1.pdf'
    ],
    INVESTIGADOR: [
      'https://dhg1h5j42swfq.cloudfront.net/2018/08/20195528/Vade-Mecum-Investigador.pdf'
    ],
    ESCRIVAO: [
      'https://concursos.grancursosonline.com.br/hubfs/Apostila-PCGO-Escrivao.pdf'
    ],
    DELEGADO: [
      'https://gratis.estrategiaconcursos.com.br/wp-content/uploads/2021/03/Manual-do-Futuro-Delegado-de-Policia.pdf'
    ]
  },
  PM: {
    SOLDADO: [
      'https://aspomil.com.br/images/Apostila/SOLDADO%20PM%202%20CLASSE.pdf',
      'https://dhg1h5j42swfq.cloudfront.net/2018/08/16153756/PM-GO_SOLDADO.pdf'
    ],
    OFICIAL: [
      'https://aspomil.com.br/images/Apostila/CURSO%20DE%20FORMA%C3%87%C3%83O%20DE%20OFICIAIS%20-%20CFO.pdf'
    ]
  }
};

interface ExtractedContent {
  exam: string;
  cargo: string;
  subject: string;
  chunks: string[];
}

async function downloadPDF(url: string, filename: string): Promise<string> {
  try {
    console.log(`📥 Baixando: ${filename}...`);
    const outputPath = path.join('/tmp', filename);
    
    await execAsync(`curl -L -o "${outputPath}" "${url}" --max-time 60`);
    
    console.log(`✅ Baixado: ${filename}`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Erro ao baixar ${filename}: ${error}`);
    throw error;
  }
}

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`pdftotext "${pdfPath}" -`);
    return stdout;
  } catch (error) {
    console.error(`❌ Erro ao extrair texto, tentando alternativa...`);
    try {
      const { stdout } = await execAsync(`strings "${pdfPath}"`);
      return stdout;
    } catch {
      return '';
    }
  }
}

function identifySubject(text: string): string {
  const subjects = {
    'Direito Penal': ['penal', 'crime', 'pena', 'art. 121', 'homicídio', 'furto', 'roubo'],
    'Direito Constitucional': ['constitucional', 'constituição', 'CF/88', 'art. 5', 'direitos fundamentais'],
    'Direito Administrativo': ['administrativo', 'ato administrativo', 'servidor público', 'licitação'],
    'Direito Processual Penal': ['processual penal', 'CPP', 'inquérito', 'ação penal'],
    'Português': ['gramática', 'sintaxe', 'morfologia', 'concordância', 'regência'],
    'Raciocínio Lógico': ['lógica', 'proposição', 'silogismo', 'tabela verdade'],
    'Informática': ['windows', 'linux', 'internet', 'hardware', 'software'],
    'Legislação de Trânsito': ['trânsito', 'CTB', 'código de trânsito', 'CNH']
  };

  const lowerText = text.toLowerCase();
  
  for (const [subject, keywords] of Object.entries(subjects)) {
    const matches = keywords.filter(kw => lowerText.includes(kw)).length;
    if (matches >= 2) {
      return subject;
    }
  }
  
  return 'Conhecimentos Gerais';
}

function createChunks(text: string): string[] {
  const lines = text.split('\n').filter(l => l.trim().length > 50);
  const chunks: string[] = [];
  
  for (let i = 0; i < lines.length; i += 10) {
    const chunk = lines.slice(i, i + 10).join('\n').trim();
    if (chunk.length > 200) {
      chunks.push(chunk);
    }
  }
  
  return chunks.slice(0, 30);
}

async function processApostilas() {
  console.log('🚀 INICIANDO PROCESSAMENTO\n');
  
  const allContent: ExtractedContent[] = [];
  let totalProcessed = 0;
  
  for (const [exam, cargos] of Object.entries(APOSTILAS)) {
    console.log(`\n📚 ${exam}`);
    
    for (const [cargo, urls] of Object.entries(cargos)) {
      console.log(`  👮 ${cargo}`);
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const filename = `${exam}_${cargo}_${i + 1}.pdf`;
        
        try {
          const pdfPath = await downloadPDF(url, filename);
          
          console.log(`  📄 Extraindo texto...`);
          const text = await extractTextFromPDF(pdfPath);
          
          if (!text || text.length < 500) {
            console.log(`  ⚠️  Texto insuficiente`);
            continue;
          }
          
          const subject = identifySubject(text);
          console.log(`  🎯 ${subject}`);
          
          const chunks = createChunks(text);
          console.log(`  ✂️  ${chunks.length} chunks`);
          
          allContent.push({
            exam,
            cargo,
            subject,
            chunks
          });
          
          totalProcessed++;
          
          fs.unlinkSync(pdfPath);
          
        } catch (error) {
          console.error(`  ❌ ${error}`);
        }
        
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }
  
  const outputPath = '/tmp/apostilas_processed.json';
  fs.writeFileSync(outputPath, JSON.stringify(allContent, null, 2));
  
  console.log(`\n✅ CONCLUÍDO!`);
  console.log(`📊 ${totalProcessed} apostilas`);
  console.log(`💾 ${outputPath}`);
  
  return allContent;
}

processApostilas().catch(console.error);
