'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/*
 * Public site chrome (Navbar + Footer), rendered once from the root layout so every
 * page shares identical navigation and footer.
 *
 * Application shells (portal, admin, dashboard, auth, invite) get the marketing Navbar
 * as well, applied through a wrapper class so their own layouts can offset the fixed
 * header. Their footers stay inside the shell because they need session-scoped links.
 *
 * Password recovery renders bare: the user arrives from an email link and only needs
 * the form, so marketing navigation would just add noise.
 */
const APP_SHELL = /^\/(admin|portal|invite|workspace|aksesraffi|dashboard|auth)(\/|$)/;
const BARE = /^\/reset-password(\/|$)/;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (BARE.test(pathname)) return <>{children}</>;

    if (APP_SHELL.test(pathname)) {
        return (
            <div className="site-chrome-app">
                <Navbar />
                {children}
            </div>
        );
    }

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
