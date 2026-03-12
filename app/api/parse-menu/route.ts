import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

type ImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

const MEDIA_TYPE_MAP: Record<string, ImageMediaType> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/jpeg", // converted by browser before upload typically
  "image/gif": "image/gif",
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 10MB" },
        { status: 400 }
      );
    }

    const mediaType = MEDIA_TYPE_MAP[file.type];
    if (!mediaType) {
      return NextResponse.json(
        { error: `Unsupported image type: ${file.type}` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: `You are a menu parser. Extract all menu items from this menu image.

Return ONLY valid JSON in this exact structure, no other text:
{
  "categories": [
    {
      "name": "Category Name",
      "description": "",
      "items": [
        {
          "name": "Item Name",
          "description": "Item description if visible",
          "price": 0,
          "currency": "R",
          "available": true,
          "tags": []
        }
      ]
    }
  ]
}

Rules:
- Extract ALL visible menu items
- Group items by their category/section headers
- For prices: extract the number only (no currency symbol). If no price visible, use 0
- For currency: detect from the menu (R for ZAR, $ for USD, € for EUR, £ for GBP, etc.). Default to "R"
- Keep descriptions concise
- If no categories are visible, put all items under "Menu"
- Do not invent items not visible in the image`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = textBlock.text.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    // Add IDs using crypto.randomUUID (Node built-in)
    const categories = (parsed.categories || []).map(
      (cat: { name: string; description?: string; items: Array<Record<string, unknown>> }) => ({
        id: crypto.randomUUID(),
        name: cat.name || "Menu",
        description: cat.description || "",
        items: (cat.items || []).map(
          (item: Record<string, unknown>) => ({
            id: crypto.randomUUID(),
            name: item.name || "",
            description: item.description || "",
            price: Number(item.price) || 0,
            currency: (item.currency as string) || "R",
            available: item.available !== false,
            tags: Array.isArray(item.tags) ? item.tags : [],
          })
        ),
      })
    );

    const itemCount = categories.reduce(
      (sum: number, cat: { items: unknown[] }) => sum + cat.items.length,
      0
    );

    return NextResponse.json({ categories, itemCount });
  } catch (err) {
    console.error("Menu parse error:", err);
    const message =
      err instanceof SyntaxError
        ? "Failed to parse AI response as JSON"
        : err instanceof Error
          ? err.message
          : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
