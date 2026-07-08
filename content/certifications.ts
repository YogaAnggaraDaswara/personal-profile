export type Certification = { title: string; issuer: string; year: string }

// ===== EDIT ME: tambah/ubah sertifikasi =====
export const certifications: Certification[] = [
  { title: 'IT Governance Using COBIT 5', issuer: 'PREINEXUS', year: '2024' },
  { title: 'IT Governance Using COBIT 4.1', issuer: 'PREINEXUS', year: '2024' },
  { title: 'Enterprise Architecture in Practice', issuer: 'LinkedIn Learning', year: '2023' },
  {
    title: 'IBM Certified System Administrator — WebSphere ND V8.5.5 & Liberty Profile',
    issuer: 'IBM',
    year: '',
  },
]
