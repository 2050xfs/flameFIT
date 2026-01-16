import React from "react";
import { getKitchenData } from "@/lib/api/kitchen";
import { KitchenClient } from "./KitchenClient";

export default async function KitchenPage() {
    const data = await getKitchenData();

    return (
        <div className="space-y-6">
            <KitchenClient initialData={data} />
        </div>
    );
}
