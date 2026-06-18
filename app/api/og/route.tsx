import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const SIZE = { width: 1200, height: 630 };

function readParam(searchParams: URLSearchParams, key: string, fallback: string): string {
  const raw = searchParams.get(key);
  if (!raw) return fallback;
  try {
    return decodeURIComponent(raw).trim() || fallback;
  } catch {
    return raw.trim() || fallback;
  }
}

function truncateTitle(title: string, max = 140): string {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1).trim()}…`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = truncateTitle(readParam(searchParams, 'title', 'Știrile Crypto'));
  const category = readParam(searchParams, 'category', '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.12) 0%, transparent 40%), linear-gradient(160deg, #020617 0%, #0a1025 50%, #020617 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            opacity: 0.35,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.28em',
              color: '#38bdf8',
              textTransform: 'uppercase',
            }}
          >
            ȘTIRILE CRYPTO
          </p>
          {category ? (
            <p
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              {category}
            </p>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '24px 0',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: title.length > 80 ? 44 : title.length > 50 ? 52 : 60,
              fontWeight: 800,
              lineHeight: 1.1,
              textAlign: 'center',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              maxWidth: '1000px',
            }}
          >
            {title}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            borderTop: '1px solid rgba(148,163,184,0.25)',
            paddingTop: '24px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 20,
              color: '#cbd5e1',
              fontWeight: 500,
            }}
          >
            Citește analiza completă pe www.stirilecrypto.ro
          </p>
          <div
            style={{
              display: 'flex',
              width: 48,
              height: 6,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #3b82f6, #22d3ee)',
            }}
          />
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
