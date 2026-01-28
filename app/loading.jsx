'use client';

import Loading from '../components/Loading';

/**
 * Global Loading Page for Next.js App Router
 * This is displayed automatically during page transitions.
 */
export default function GlobalLoading() {
    return <Loading fullScreen={true} text="Initializing NEXLYN..." />;
}
