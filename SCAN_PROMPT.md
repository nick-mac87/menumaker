Build a "Scan Menu" feature for the MenuMaker Next.js app at /Users/Locafox/Projects/menumaker.

The feature lets users upload a photo of a physical menu, AI parses it, and autofills the categories and items.

## What to build

### 1. API Route: `/app/api/parse-menu/route.ts`

POST endpoint that:
- Accepts multipart form data with an image file (jpg/png/webp/heic)
- Converts image to base64
- Calls Anthropic Claude claude-opus-4-5 vision API with the image
- Returns structured JSON matching the app's Category[] and MenuItem[] types

Use this exact Anthropic API call pattern:
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: imageMediaType, // "image/jpeg" | "image/png" | "image/webp" | "image/gif"
          data: base64ImageData,
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
- Do not invent items not visible in the image`
      }
    ]
  }]
});
```

Parse the response text as JSON and add `id` fields using `crypto.randomUUID()` to each category and item.

Return:
```json
{
  "categories": [...],  // Category[] with ids added
  "itemCount": 12       // total items parsed
}
```

Handle errors gracefully — return `{ error: "message" }` with appropriate HTTP status.

### 2. Component: `/components/onboarding/ScanMenuUpload.tsx`

A React component that:
- Shows a drag-and-drop / click-to-upload zone with a camera/scan icon
- Accepts image files (jpg, png, webp, heic, up to 10MB)
- On file select: shows image preview + "Scanning menu..." loading state with spinner
- Calls `/api/parse-menu` with the image
- On success: shows "Found X items across Y categories" with a green checkmark, then calls `onSuccess(categories)`
- On error: shows error message with retry option
- Has a "Skip" link below it

Props:
```typescript
interface ScanMenuUploadProps {
  onSuccess: (categories: Category[]) => void;
  onSkip: () => void;
}
```

Use Tailwind classes consistent with the rest of the app (warm tones, rounded-2xl cards, etc).
Use the Sparkles icon from lucide-react for the scan action.
Show a dashed border upload zone that highlights on drag-over.

### 3. Update Step4Menu: `/components/onboarding/Step4Menu.tsx`

Read the current Step4Menu.tsx first. Add the scan feature at the TOP of the step, before the manual entry, as an optional "shortcut":

- Add a card at the top: "📸 Got a physical menu? Scan it" with a subtle description
- If no categories exist yet (or only empty ones): show the ScanMenuUpload component prominently
- If user has already added items: show a small "Re-scan menu" button that opens a modal/overlay with ScanMenuUpload
- When onSuccess fires: merge the parsed categories into the existing menu (replace if empty, append if user already has items — show a confirm dialog for the append case)

### 4. Update Step4Menu in the dashboard: Add scan to the MenuTab

In `/app/dashboard/[menuId]/page.tsx`, inside the `MenuTab` function's "Categories & Items" CollapsibleSection, add a small "📸 Scan menu photo" button above the CategoryList. When clicked, show a modal with ScanMenuUpload. On success, replace/merge categories (with confirm if existing items present).

### 5. Environment variable

Add to `/env.example` (create if doesn't exist):
```
ANTHROPIC_API_KEY=your_key_here
```

### 6. Install dependency if needed

Check if `@anthropic-ai/sdk` is already in package.json. If not, run:
```bash
cd /Users/Locafox/Projects/menumaker && npm install @anthropic-ai/sdk
```

### Implementation notes

- The app uses localStorage for storage (no backend DB) — that's fine, the parse API is stateless
- Existing types are in `/lib/types.ts` — use Category and MenuItem exactly as defined there
- The app uses `generateId()` from `/lib/utils.ts` — use that instead of crypto.randomUUID() for consistency
- Keep UI consistent: warm colors, rounded-2xl cards, same Button/Input components
- The feature should feel magical but not intrusive — it's a shortcut, not required

### When done

1. Run `cd /Users/Locafox/Projects/menumaker && npm run build 2>&1 | tail -20` to verify it builds
2. Commit: `git add -A && git commit -m "feat: scan menu photo with AI autofill"`
3. Push: `git push`
4. Run: `openclaw system event --text "Menu scan feature complete — AI photo parsing live in MenuMaker" --mode now`
