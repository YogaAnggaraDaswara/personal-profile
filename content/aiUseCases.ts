import type { AiUseCase } from './types'

// ===== EDIT ME: use case AI yang sedang diimplementasikan =====
export const aiUseCases: AiUseCase[] = [
  {
    title: { id: 'Asisten Pengetahuan Internal', en: 'Internal Knowledge Assistant' },
    description: {
      id: 'LLM + RAG menjawab pertanyaan prosedur & kebijakan dengan sitasi sumber, mengurangi ketergantungan pada pencarian manual.',
      en: 'LLM + RAG answers procedure & policy questions with source citations, reducing reliance on manual search.',
    },
    tech: ['RAG', 'LLM API', 'Vector DB'],
  },
  {
    title: { id: 'Otomasi Dokumen', en: 'Document Automation' },
    description: {
      id: 'OCR + ekstraksi terstruktur mengubah dokumen fisik menjadi data siap proses dengan validasi berlapis.',
      en: 'OCR + structured extraction turns physical documents into process-ready data with layered validation.',
    },
    tech: ['OCR', 'Python', 'Rule Engine'],
  },
  {
    title: { id: 'Draf Laporan Otomatis', en: 'Automated Report Drafting' },
    description: {
      id: 'Data terstruktur diubah menjadi draf naratif oleh LLM, selalu dengan review dan approval manusia.',
      en: 'Structured data becomes narrative drafts via LLM, always with human review and approval.',
    },
    tech: ['LLM API', 'SQL', 'Scheduler'],
  },
]
