import React from "react";
import { getKnowledgeBaseData } from "@/lib/api/knowledge-base";
import { KnowledgeBaseClient } from "./KnowledgeBaseClient";

export default async function KnowledgeBasePage() {
    const data = await getKnowledgeBaseData();

    return (
        <div className="space-y-6">
            <KnowledgeBaseClient initialData={data} />
        </div>
    );
}
