import Script from 'next/script';

export default function GoogleTagManager() {
    const id = process.env.NEXT_PUBLIC_GTM_ID;
    if (!id || !/^GTM-[A-Z0-9]+$/.test(id)) return null;

    return (
        <Script id="google-tag-manager" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});(function(d,s,i){var j=d.createElement(s),f=d.getElementsByTagName(s)[0];j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(document,'script','${id}');`}
        </Script>
    );
}
