import type { Platform, PlatformResult } from '../../types';
import './PriceCard.css';

interface PriceCardProps {
  platform: Platform;
  data: PlatformResult | undefined;
  isLoading: boolean;
  isError: boolean;
  isLowestPrice: boolean;
}

const PLATFORM_META: Record<
  Platform,
  {
    displayName: string;
    tagline: string;
    deliveryTime: string;
    deliveryLabel: string;
    icon: string;
  }
> = {
  blinkit: {
    displayName: 'Blinkit',
    tagline: 'Grocery in minutes',
    deliveryTime: '8–12 min',
    deliveryLabel: 'Express delivery',
    icon: '⚡',
  },
  zepto: {
    displayName: 'Zepto',
    tagline: '10-minute delivery',
    deliveryTime: '10–15 min',
    deliveryLabel: 'Zepto delivery',
    icon: '🚀',
  },
  bigbasket: {
    displayName: 'BigBasket',
    tagline: "India's biggest online supermarket",
    deliveryTime: '2–4 hrs',
    deliveryLabel: 'Scheduled delivery',
    icon: '🛒',
  },
};

export function PriceCard({
  platform,
  data,
  isLoading,
  isError,
  isLowestPrice,
}: PriceCardProps) {
  const meta = PLATFORM_META[platform];

  const CardHeader = () => (
    <header className="price-card__header">
      <div className="price-card__brand">
        <span className="price-card__brand-icon">{meta.icon}</span>
        <div className="price-card__brand-text">
          <span className="price-card__platform-name">{meta.displayName}</span>
          <span className="price-card__tagline">{meta.tagline}</span>
        </div>
      </div>
      <div className="price-card__delivery-badge">
        <span className="price-card__delivery-icon">🕐</span>
        <span className="price-card__delivery-time">{meta.deliveryTime}</span>
      </div>
    </header>
  );

  if (isLoading) {
    return (
      <article
        className={`price-card price-card--${platform} price-card--loading`}
        aria-label={`${meta.displayName} — loading price`}
        aria-busy="true"
      >
        <CardHeader />
        <div className="price-card__divider" />
        <div className="price-card__skeleton" aria-hidden="true">
          <div className="price-card__skeleton-line price-card__skeleton-line--title" />
          <div className="price-card__skeleton-line price-card__skeleton-line--price" />
          <div className="price-card__skeleton-line price-card__skeleton-line--unit" />
        </div>
        <span className="sr-only">Loading price from {meta.displayName}…</span>
      </article>
    );
  }

  if (isError) {
    return (
      <article
        className={`price-card price-card--${platform} price-card--error`}
        aria-label={`${meta.displayName} — price unavailable`}
      >
        <CardHeader />
        <div className="price-card__divider" />
        <p className="price-card__error-message" role="alert">
          Price unavailable
        </p>
      </article>
    );
  }

  if (data && !data.availability) {
    return (
      <article
        className={`price-card price-card--${platform}`}
        aria-label={`${meta.displayName} — ${data.productName} — Out of Stock`}
      >
        <CardHeader />
        <div className="price-card__divider" />
        <p className="price-card__product-name">{data.productName}</p>
        <span className="price-card__out-of-stock-badge">Out of Stock</span>
      </article>
    );
  }

  if (data && data.availability) {
    return (
      <article
        className={`price-card price-card--${platform}${
          isLowestPrice ? ' price-card--best-price' : ''
        }`}
        aria-label={`${meta.displayName} — ${data.productName} — ${data.displayPrice} — ${meta.deliveryTime}`}
      >
        {isLowestPrice && <div className="price-card__best-price-badge">★ Best Price</div>}

        <CardHeader />
        <div className="price-card__divider" />

        <p className="price-card__product-name">{data.productName}</p>

        <div className="price-card__price-row">
          <span className="price-card__price">{data.displayPrice}</span>
          <span className="price-card__unit">{data.unit}</span>
        </div>

        <div className="price-card__actions">
          <a
            href={data.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="price-card__view-link"
            aria-label={`View on ${meta.displayName} (opens in new tab)`}
          >
            View on {meta.displayName} →
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className={`price-card price-card--${platform} price-card--empty`}>
      <CardHeader />
    </article>
  );
}

export default PriceCard;
