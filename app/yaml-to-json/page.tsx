import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import YamlToJson from "@/components/json/YamlToJson"

export const metadata: Metadata = {
    title: "YAML to JSON Converter - Free Online Tool",
    description: "YAML verilerini anında JSON formatına dönüştürün. Ücretsiz online YAML to JSON dönüştürücü.",
    alternates: { canonical: "https://toolsetapp.com/yaml-to-json" },
    openGraph: {
        title: "YAML to JSON Converter - Online Tool",
        description: "YAML'u JSON'a dönüştür. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/yaml-to-json",
        type: "website",
    },
    keywords: "yaml to json, convert yaml to json, yaml json converter, json generator",
}

export default function YamlToJsonPage() {
    return (
        <ToolLayout
            title="YAML to JSON Converter"
            description="YAML verilerini anında JSON formatına dönüştürün — ücretsiz, kayıt gerektirmez."
            toolId="yaml-to-json"
        >
            <YamlToJson />
        </ToolLayout>
    )
}