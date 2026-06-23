import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import XmlToJson from "@/components/json/XmlToJson"

export const metadata: Metadata = {
    title: "XML to JSON Converter - Free Online Tool",
    description: "XML verilerini anında JSON formatına dönüştürün. Ücretsiz online XML to JSON dönüştürücü.",
    alternates: { canonical: "https://toolsetapp.com/xml-to-json" },
    openGraph: {
        title: "XML to JSON Converter - Online Tool",
        description: "XML'i JSON'a dönüştür. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/xml-to-json",
        type: "website",
    },
    keywords: "xml to json, convert xml to json, xml json converter, json generator",
}

export default function XmlToJsonPage() {
    return (
        <ToolLayout
            title="XML to JSON Converter"
            description="XML verilerini anında JSON formatına dönüştürün — ücretsiz, kayıt gerektirmez."
            toolId="xml-to-json"
        >
            <XmlToJson />
        </ToolLayout>
    )
}