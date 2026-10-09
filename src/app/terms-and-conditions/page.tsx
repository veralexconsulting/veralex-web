import LegalDocumentPage from '@/components/LegalDocumentPage';
import { legalMetadata } from '@/lib/legal/routes';
export const metadata = legalMetadata('terms-and-conditions','en');
export default function Page(){return <LegalDocumentPage kind="terms-and-conditions" lang="en"/>;}
