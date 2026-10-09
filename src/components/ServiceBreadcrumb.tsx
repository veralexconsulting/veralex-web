import Link from 'next/link';
import type { ServiceBreadcrumbItem } from '@/lib/serviceBreadcrumbs';

export default function ServiceBreadcrumb({ items }: { items: ServiceBreadcrumbItem[] }) {
    return (
        <nav className="svc-breadcrumb" aria-label="Breadcrumb">
            <ol>
                {items.map((item) => (
                    <li key={item.label}>
                        {item.current
                            ? <span aria-current="page">{item.label}</span>
                            : item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
