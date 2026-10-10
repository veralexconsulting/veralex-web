import { redirect } from 'next/navigation';
import { currentOwner } from '@/lib/owner/auth';
import OwnerLoginForm from '../OwnerLoginForm';

export default async function OwnerLoginPage() {
    let owner = null;
    try {
        owner = await currentOwner();
    } catch {
        // Auth provider is recovering: show the form instead of pretending the owner is signed out.
    }
    if (owner) redirect(owner.mustChangePassword ? '/aksesraffi/ganti-password' : '/aksesraffi');
    return <OwnerLoginForm />;
}
