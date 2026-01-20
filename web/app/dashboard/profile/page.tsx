import { redirect } from 'next/navigation';

export default function RedirectPage() {
    redirect('/dashboard'); // Profile could be added later, for now redirect to dashboard
}
