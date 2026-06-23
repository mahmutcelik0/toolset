import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonToXml from "@/components/json/JsonToXml"

export const metadata: Metadata = {
    title: "JSON to XML Converter - Free Online Tool",
    description: "JSON verilerini anında XML formatına dönüştürün. Ücretsiz online JSON to XML dönüştürücü.",
    alternates: { canonical: "https://toolsetapp.com/json-to-xml" },
    openGraph: {
        title: "JSON to XML Converter - Online Tool",
        description: "JSON'u XML'e dönüştür. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/json-to-xml",
        type: "website",
    },
    keywords: "json to xml, convert json to xml, json xml converter, xml generator",
}

export default function JsonToXmlPage() {
    return (
        <ToolLayout
            title="JSON to XML Converter"
            description="JSON verilerini anında XML formatına dönüştürün — ücretsiz, kayıt gerektirmez."
            toolId="json-to-xml"
        >
            <JsonToXml />
        </ToolLayout>
    )
}