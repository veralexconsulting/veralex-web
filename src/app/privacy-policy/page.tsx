import LegalDocumentPage from '@/components/LegalDocumentPage';
import { legalMetadata } from '@/lib/legal/routes';
export const metadata = legalMetadata('privacy-policy','en');
export default function Page(){return <LegalDocumentPage kind="privacy-policy" lang="en"/>;}
