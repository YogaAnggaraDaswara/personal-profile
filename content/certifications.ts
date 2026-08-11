export type Certification = { title: string; issuer: string; year: string; url?: string }

// ===== EDIT ME: tambah/ubah sertifikasi (sumber: CV yoga-daswara-cv.pdf) =====
export const certifications: Certification[] = [
  { title: 'IT Governance Using COBIT 5', issuer: 'PREINEXUS', year: '2024', url: 'https://www.isaca.org/resources/cobit' },
  { title: 'IT Governance Using COBIT 4.1', issuer: 'PREINEXUS', year: '2024', url: 'https://www.isaca.org/resources/cobit' },
  { title: 'Enterprise Architecture in Practice', issuer: 'LinkedIn Learning', year: '2023', url: 'https://www.linkedin.com/learning/' },
  {
    title: 'RedHat & Confluent Technology Update (Digital Banking & Real-Time Application)',
    issuer: 'RedHat & Confluent',
    year: '2020',
    url: 'https://www.redhat.com/en/services/training-and-certification',
  },
  {
    title: 'IBM Certified System Administrator - WebSphere ND V8.5.5 & Liberty Profile',
    issuer: 'IBM',
    year: '2016',
    url: 'https://www.ibm.com/training/certification',
  },
  {
    title: 'Google Cloud Fundamentals: Core Infrastructure',
    issuer: 'Google Cloud',
    year: '2023',
    url: 'https://cloud.google.com/training',
  },
  {
    title: 'AWS Cloud Practitioner Essentials',
    issuer: 'Amazon Web Services',
    year: '2023',
    url: 'https://aws.amazon.com/training/',
  },
]
