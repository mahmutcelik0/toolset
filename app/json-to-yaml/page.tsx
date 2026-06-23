import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonToYaml from "@/components/json/JsonToYaml"

export const metadata: Metadata = {
    title: "JSON to YAML Converter - Free Online Tool",
    description: "JSON verilerini anında YAML formatına dönüştürün. Ücretsiz online JSON to YAML dönüştürücü.",
    alternates: { canonical: "https://toolsetapp.com/json-to-yaml" },
    openGraph: {
        title: "JSON to YAML Converter - Online Tool",
        description: "JSON'u YAML'a dönüştür. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/json-to-yaml",
        type: "website",
    },
    keywords: "json to yaml, convert json to yaml, json yaml converter, yaml generator",
}

export default function JsonToYamlPage() {
    return (
        <ToolLayout
            title="JSON to YAML Converter"
            description="JSON verilerini anında YAML formatına dönüştürün — ücretsiz, kayıt gerektirmez."
            toolId="json-to-yaml"
        >
            <JsonToYaml />
        </ToolLayout>
    )
}