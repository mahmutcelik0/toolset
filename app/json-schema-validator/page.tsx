import type { Metadata } from "next"
import ToolLayout from "@/components/ToolLayout"
import JsonSchemaValidator from "@/components/json/JsonSchemaValidator"

export const metadata: Metadata = {
    title: "JSON Schema Validator - Validate JSON Online Free",
    description: "JSON verilerinizi JSON Schema ile doğrulayın. Ücretsiz online JSON Schema validator aracı.",
    alternates: { canonical: "https://toolsetapp.com/json-schema-validator" },
    openGraph: {
        title: "JSON Schema Validator - Online Tool",
        description: "JSON verilerini şema ile doğrula. Ücretsiz, kayıt gerekmez.",
        url: "https://toolsetapp.com/json-schema-validator",
        type: "website",
    },
    keywords: "json schema validator, validate json schema, json validator, schema validator",
}

export default function JsonSchemaValidatorPage() {
    return (
        <ToolLayout
            title="JSON Schema Validator"
            description="JSON verilerinizi JSON Schema ile doğrulayın — ücretsiz, kayıt gerektirmez."
            toolId="json-schema-validator"
        >
            <JsonSchemaValidator />
        </ToolLayout>
    )
}