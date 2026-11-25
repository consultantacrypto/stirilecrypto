import type { Metadata } from 'next';
import { CheckCircle2, Mail } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { createUnsubscribeStore } from '@/lib/newsletter/store';
import {
  resolveUnsubscribePage,
  type UnsubscribePageState,
} from '@/lib/newsletter/unsubscribe';
import { readUnsubscribeSecret, UNSUBSCRIBE_API_PATH } from '@/lib/newsletter/token';
import { CONTACT_EMAIL } from '@/lib/site';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dezabonare newsletter',
  description: 'Confirmă că nu mai vrei să primești newsletterul Știrile Crypto de dimineață.',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

function first(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] ?? null;
  return null;
}

const HOME_URL = 'https://www.stirilecrypto.ro';

function ContactLine() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 underline hover:text-blue-300">
      {CONTACT_EMAIL}
    </a>
  );
}

function HomeLink() {
  return (
    <a href={HOME_URL} className="text-blue-400 underline hover:text-blue-300">
      Înapoi la Știrile Crypto
    </a>
  );
}

function Card({ state }: { state: UnsubscribePageState }) {
  if (state.kind === 'confirm') {
    return (
      <>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Newsletter</p>
        <h1 className="mt-3 font-[var(--font-space)] text-3xl font-black tracking-tight md:text-4xl">
          Confirmă dezabonarea
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          Ești abonat la newsletterul Știrile Crypto de dimineață. Apasă butonul ca să nu îl mai
          primești. Doar deschiderea acestui link nu te dezabonează.
        </p>
        <form
          method="post"
          action={UNSUBSCRIBE_API_PATH}
          encType="application/x-www-form-urlencoded"
          className="mt-8"
        >
          <input type="hidden" name="token" value={state.token} />
          <input type="hidden" name="confirm" value="1" />
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition-colors hover:bg-blue-500"
          >
            Confirmă dezabonarea
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500">Poți închide pagina dacă vrei să rămâi abonat.</p>
      </>
    );
  }

  if (state.kind === 'unsubscribed') {
    return (
      <>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-300">
          <CheckCircle2 size={16} aria-hidden />
          Gata
        </p>
        <h1 className="mt-3 font-[var(--font-space)] text-3xl font-black tracking-tight md:text-4xl">
          Te-ai dezabonat
        </h1>
        <p role="status" className="mt-4 text-base leading-relaxed text-gray-400">
          Te-ai dezabonat. Nu vei mai primi newsletterul Știrile Crypto.
        </p>
        <p className="mt-6 text-sm">
          <HomeLink />
        </p>
      </>
    );
  }

  if (state.kind === 'already') {
    return (
      <>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Newsletter</p>
        <h1 className="mt-3 font-[var(--font-space)] text-3xl font-black tracking-tight md:text-4xl">
          Ești deja dezabonat
        </h1>
        <p role="status" className="mt-4 text-base leading-relaxed text-gray-400">
          Această adresă nu mai primește newsletterul. Nu trebuie să confirmi din nou.
        </p>
        <p className="mt-6 text-sm">
          <HomeLink />
        </p>
      </>
    );
  }

  if (state.kind === 'expired') {
    return (
      <>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Newsletter</p>
        <h1 className="mt-3 font-[var(--font-space)] text-3xl font-black tracking-tight md:text-4xl">
          Linkul a expirat
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          Acest link de dezabonare a expirat. Scrie-ne la <ContactLine /> și te scoatem de pe listă.
        </p>
      </>
    );
  }

  if (state.kind === 'unavailable') {
    return (
      <>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Newsletter</p>
        <h1 className="mt-3 font-[var(--font-space)] text-3xl font-black tracking-tight md:text-4xl">
          Dezabonarea nu este disponibilă momentan
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          Nu am putut verifica linkul. Încearcă mai târziu sau scrie-ne la <ContactLine />.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Newsletter</p>
      <h1 className="mt-3 font-[var(--font-space)] text-3xl font-black tracking-tight md:text-4xl">
        Linkul nu este valid
      </h1>
      <p className="mt-4 text-base leading-relaxed text-gray-400">
        Linkul de dezabonare este invalid. Folosește linkul din ultimul email sau scrie-ne la{' '}
        <ContactLine />.
      </p>
      <p className="mt-6 text-sm">
        <HomeLink />
      </p>
    </>
  );
}

export default async function DezabonarePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[]; result?: string | string[] }>;
}) {
  const query = await searchParams;
  const state = await resolveUnsubscribePage({
    token: first(query.token),
    result: first(query.result),
    secret: readUnsubscribeSecret(),
    findSubscriber: async (id) => {
      try {
        return await createUnsubscribeStore(createServiceClient()).findSubscriber(id);
      } catch {
        return { ok: false };
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 pb-20 pt-32 md:px-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-md md:px-8">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/15">
            <Mail size={18} className="text-blue-400" aria-hidden />
          </div>
          <Card state={state} />
          {state.kind === 'confirm' || state.kind === 'expired' || state.kind === 'unavailable' ? (
            <p className="mt-8 text-sm">
              <HomeLink />
            </p>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
