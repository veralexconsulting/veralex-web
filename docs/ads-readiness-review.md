# VERALEX Google Ads readiness review — 2026-10-06

## Architecture and evidence

- Next.js 16.1.6 App Router, React 19.2.3. Public service pages are statically generated from `src/lib/serviceData.ts`; four English and Chinese service guides use `src/data/services/{en,zh}`. No external CMS drives public pricing. Supabase is used for authentication, orders and admin, not the public service catalog.
- Homepage and priority service pages were fetched directly from `https://www.veralexconsulting.com` on 2026-10-06. The apex domain redirects to `www`. Live trademark shows the Rp6.000.000 crossed-out price and Rp3.000.000 promo; live PT PMA shows Rp15.000.000. Live PT Perorangan still displays "Establishment Deed" and no GTM tag is installed. The fixes in this checkout are not yet deployed.
- The public contact path is WhatsApp. The service order modal collects a name and optional company, then opens WhatsApp; it does not submit data to a backend. Authentication and order forms are separate app flows and must not count as marketing `form_submit` leads.
- No GA4, GTM, or Google Ads measurement ID was present in the checked-in source before this work. Tag configuration and actual Ads conversion receipts need the business accounts.

## Price matrix

Prices below are *starting prices* from `serviceData.ts`. Homepage service rows and unprefixed service detail pages now consume this catalog. English and Chinese guide pricing is resolved against it as well. Package prices are distinct offers, not PT PMA service prices.

| Service | Homepage | Service page | Promotion | Status |
| --- | ---: | ---: | ---: | --- |
| Pendaftaran Merek | Rp3.000.000 | Rp3.000.000 | Rp6.000.000 → Rp3.000.000, 50% | Consistent; terms and duration need business confirmation |
| Perpanjangan Merek | Rp6.000.000 | Rp6.000.000 | — | Consistent |
| Pengalihan Merek | Rp3.000.000 | Rp3.000.000 | — | Consistent |
| Hak Cipta | Rp2.500.000 | Rp2.500.000 | — | Consistent |
| Desain Industri | Rp4.500.000 | Rp4.500.000 | — | Consistent |
| PT PMDN | Rp7.000.000 | Rp7.000.000 | — | Consistent |
| PT PMA | Rp15.000.000 | Rp15.000.000 | — | Consistent in current catalog, detail and production snapshot |
| PT Perorangan | Rp1.500.000 | Rp1.500.000 | — | Consistent |
| CV | Rp3.000.000 | Rp3.000.000 | — | Consistent |
| ITAS Investor 1 Tahun | Rp16.000.000 | Rp16.000.000 | — | Consistent |
| ITAS Investor 2 Tahun | Rp18.000.000 | Rp18.000.000 | — | Consistent |
| Visa C2 | Rp3.500.000 | Rp3.500.000 | — | Consistent |
| Visa D2 1 Tahun | Rp6.000.000 | Rp6.000.000 | — | Consistent |
| Visa D2 2 Tahun | Rp9.500.000 | Rp9.500.000 | — | Consistent |
| KITAS Kerja | Rp45.000.000 | Rp45.000.000 | — | Consistent |

The Rp9.900.000 on the homepage is **Starter Business**, a PT PMDN plus trademark bundle. The PT PMA bundles are **Investor Package Rp26.000.000** and **Premium Investor Rp42.500.000**. These three package amounts need separate business validation before ads quote them.

## Human review before campaigns

1. **Pricing and promo:** Confirm PT PMA Rp15.000.000, trademark normal Rp6.000.000 and promo Rp3.000.000, per-class scope, whether DJKI fees are included, and promo start/end dates. English and Chinese guides previously disagreed on inclusion of official fees; copy now says the scope is confirmed before ordering.
2. **Claims:** `src/lib/businessFacts.ts` centralizes 150+ clients, 99% success, 5+ years and 24/7 consultation. There is no supporting dataset in this repository. For 99%, the business must supply the success definition, numerator, denominator and period. Do not use the figure in ads until verified. The LegalService `aggregateRating` of 4.9 from 138 reviews had no evidence and was removed.
3. **Legal review:** Check all regulatory thresholds and time estimates in `src/lib/serviceContent.ts` and `src/data/services/{en,zh}` before using them in ad copy. In particular: PT PMA Rp10 billion investment/paid-up capital, director domicile and Work KITAS; PT PMDN founder/capital/virtual office requirements and 3–5 day timing; PT Perorangan UMKM threshold, minimum age and conversion process; Investor ITAS permitted work, renewals, family eligibility and 2–4 week timing; KITAS DPKK USD 1,200/RPTKA inclusion; Visa C2/D2 category and validity; DJKI trademark publication and 12–18 month timing, protection and fees. Claims are preserved pending counsel review, except the clear PT Perorangan deed contradiction.
4. **Official relationship:** Verify any claim about notary partnership or government affiliation before restoring such language. Footer copy now describes assistance through official processes without implying endorsement.
5. **Tracking account:** Supply a GTM container ID and configure GA4 plus Google Ads conversion tags from one container. Configure `whatsapp_click` and `phone_click` as distinct lead actions; count a WhatsApp click as a lead *intent*, not a completed sale. A successful marketing form does not currently exist, so `form_submit` must remain unconfigured until a real success state is added.
6. **Contact and identity:** Verify phone +62 812 1947 6385, email admin@veralexconsulting.com, address, opening hours, and testimonials with business records.

## Tag setup and event contract

Set `NEXT_PUBLIC_GTM_ID` to the approved container ID and deploy. Use that one GTM container for the GA4 Google tag and Google Ads tags. Do not separately install a GA4 script or duplicate Ads linker. In GTM Preview, verify the following custom events before publishing tags:

| dataLayer event | Trigger | Parameters |
| --- | --- | --- |
| `whatsapp_click` | Actual WhatsApp link activation or valid service order modal handoff | `service`, `page_path`, `cta_location`, optional campaign identifiers and landing path |
| `phone_click` | `tel:` link activation | Same non-sensitive context |
| `email_click` | `mailto:` link activation | Same non-sensitive context |

Do not map service order modal opening or name entry to `form_submit`; no marketing form reaches a server success state. Campaign query parameters are retained for this browser session. WhatsApp messages include UTM source/medium/campaign identifiers only when they use safe slug characters; they never include gclid or UTM term/content. Custom analytics events never contain the visitor's name, company, email, phone number or WhatsApp message. GTM should treat WhatsApp clicks as lead intent and deduplicate them from any later qualified lead import.

## Landing pages

| Campaign/search intent | Destination |
| --- | --- |
| jasa daftar merek, pendaftaran merek, biaya daftar merek | `/services/pendaftaran-merek` |
| jasa pendirian pt, biaya pendirian pt, jasa pembuatan pt | `/services/pt-pmdn` |
| foreign company registration / PT PMA | `/en/services/pt-pma` (English) or `/services/pt-pma` (Indonesian) |
| investor KITAS Indonesia | `/en/services/itas-investor-1-tahun` or `/en/services/itas-investor-2-tahun` |
| work KITAS / visa | Use `/services/kitas-kerja` or the matching visa page only after counsel approves the immigration copy |

Do not advertise the home page as a single generic destination for all service intents.
