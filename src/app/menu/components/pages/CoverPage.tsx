import Link from 'next/link';
import type { CoverPage as CoverPageType } from '../../types/menu';
import { venue } from '../../data/venue';
import { BrandLogo, CornerBrackets, Rule } from '../Ornament';
import { PageFrame } from './PageFrame';

export function CoverPage({ page }: { page: CoverPageType }) {
  return (
    <PageFrame page={page} bare>
      {page.image && (
        <div
          className="cover-image"
          style={{ backgroundImage: `url(${page.image})` }}
          aria-hidden="true"
        />
      )}
      <div className="cover-scrim" aria-hidden="true" />
      <CornerBrackets />

      <Link
        href="/"
        className="t-eyebrow absolute left-6 top-6 z-10 flex items-center gap-2 text-white/80 transition-colors hover:text-(--color-brass-bright)"
      >
        <span aria-hidden="true">&#8592;</span>
        Back Home
      </Link>

      <div className="cover-content">
        <p className="t-eyebrow cover-place">
          {venue.city} · {venue.country}
        </p>

        <h1 className="cover-title">
          <BrandLogo width={340} />
        </h1>

        <div className="cover-rule">
          <Rule width={150} />
        </div>

        <p className="t-engraved cover-kind">The Menu</p>

        <p className="cover-hint">
          <span className="cover-hint-arrow" aria-hidden="true">
            &#8592;
          </span>
          Turn the page
        </p>
      </div>
    </PageFrame>
  );
}
