import { redirect } from 'next/navigation';
import { currentOwner, ownerConfigured } from '@/lib/owner/auth';
import OwnerPasswordForm from './OwnerPasswordForm';

export default async function OwnerPasswordPage() {
    if (!ownerConfigured()) redirect('/aksesraffi/login');
    let owner = null;
    try {
        owner = await currentOwner();
    } catch {
        redirect('/aksesraffi/login');
    }
    if (!owner) redirect('/aksesraffi/login');
    if (!owner.mustChangePassword) redirect('/aksesraffi');
    return <OwnerPasswordForm />;
}
