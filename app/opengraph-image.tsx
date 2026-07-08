import { ImageResponse } from 'next/og'
import { profile } from '@/content/profile'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05050d',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(124,58,237,0.35), transparent 50%), radial-gradient(circle at 80% 80%, rgba(34,211,238,0.3), transparent 50%)',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            backgroundImage: 'linear-gradient(90deg, #7c3aed, #22d3ee)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {profile.name}
        </div>
        <div style={{ fontSize: 34, color: '#e2e8f0', marginTop: 16, fontWeight: 600 }}>
          {profile.typingRoles.join(' · ')}
        </div>
        <div style={{ fontSize: 24, color: '#94a3b8', marginTop: 28 }}>
          {profile.tagline.en}
        </div>
      </div>
    ),
    { ...size },
  )
}
