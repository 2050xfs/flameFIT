import React from "react";
import { getDashboardData } from "@/lib/api/dashboard";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-heading font-bold text-stone-900 dark:text-white">Dashboard</h1>
                <div className="text-sm text-stone-500 font-mono">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>
            <DashboardClient initialData={data} />
        </div>
    );
}
