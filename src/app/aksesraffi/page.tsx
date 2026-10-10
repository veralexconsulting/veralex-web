import { redirect } from 'next/navigation';
import { currentOwner, ownerConfigured } from '@/lib/owner/auth';
import OwnerDashboard from './OwnerDashboard';

export default async function OwnerDashboardPage() {
    if (!ownerConfigured()) redirect('/aksesraffi/login');

    let owner = null;
    try {
        owner = await currentOwner();
    } catch {
        // Auth provider unreachable. Rendering a retryable shell is safer than
        // bouncing the owner to the login screen mid-session.
        return <OwnerDashboard unavailable />;
    }
    if (!owner) redirect('/aksesraffi/login');
    if (owner.mustChangePassword) redirect('/aksesraffi/ganti-password');
    return <OwnerDashboard />;
}
