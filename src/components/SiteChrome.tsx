'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/*
 * Public site chrome (Navbar + Footer), rendered once from the root layout so every
 * page shares identical navigation and footer.
 *
 * Application shells (portal, admin, dashboard, auth, invite) bring their own chrome:
 * the workspace sidebar is the only navigation there, so the marketing navbar is not
 * rendered at all. Password recovery renders bare too: the user arrives from an email
 * link and only needs the form.
 */
const APP_SHELL = /^\/(admin|portal|invite|workspace|aksesraffi|dashboard|auth)(\/|$)/;
const BARE = /^\/reset-password(\/|$)/;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (BARE.test(pathname) || APP_SHELL.test(pathname)) return <>{children}</>;

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
