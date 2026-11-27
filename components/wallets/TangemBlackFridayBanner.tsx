import TangemBlackFridayBannerClient from '@/components/wallets/TangemBlackFridayBannerClient';
import {
  TANGEM_BLACK_FRIDAY_SLOT_ID,
  isTangemBlackFridayVisible,
  tangemBlackFridayExpiryScript,
  tangemBlackFridayHideCss,
} from '@/lib/wallets/tangem-black-friday';

type Props = {
  /** Injected by tests. Production uses the clock at render time. */
  now?: number;
};

/**
 * Server gate plus a client hide. A static shell built before the cutoff
 * would otherwise keep the banner until the next deploy.
 */
export default function TangemBlackFridayBanner({ now = Date.now() }: Props) {
  if (!isTangemBlackFridayVisible(now)) return null;

  return (
    <div id={TANGEM_BLACK_FRIDAY_SLOT_ID} data-tangem-bf="" className="mt-8" suppressHydrationWarning>
      <style dangerouslySetInnerHTML={{ __html: tangemBlackFridayHideCss() }} />
      <script dangerouslySetInnerHTML={{ __html: tangemBlackFridayExpiryScript() }} />
      <TangemBlackFridayBannerClient />
    </div>
  );
}
