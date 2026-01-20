import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-heading font-bold text-stone-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-stone-500 dark:text-stone-400 mb-8">Manage your personal information and fitness goals.</p>

            <ProfileClient initialData={profile} />
        </div>
    );
}
