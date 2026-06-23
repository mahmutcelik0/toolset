import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonDiffViewer from "@/components/json/JsonDiffViewer"

export const metadata: Metadata = {
    title: "JSON Diff Viewer - Compare JSON Online Free",
    description: "İki JSON objesini karşılaştırın ve farkları görün. Ücretsiz online JSON diff viewer aracı.",
    alternates: { canonical: "https://toolsetapp.com/json-diff-viewer" },
    openGraph: {
        title: "JSON Diff Viewer - Compare JSON Online",
        description: "JSON'ları karşılaştır ve farkları gör. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/json-diff-viewer",
        type: "website",
    },
    keywords: "json diff, compare json, json comparator, json viewer, json fark bulma",
}

export default function JsonDiffViewerPage() {
    return (
        <ToolLayout
            title="JSON Diff Viewer"
            description="İki JSON objesini karşılaştırın ve farkları görün — ücretsiz, kayıt gerektirmez."
            toolId="json-diff-viewer"
        >
            <JsonDiffViewer />
        </ToolLayout>
    )
}