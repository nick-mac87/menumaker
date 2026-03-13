Add a delivery platform linking step to the MenuMaker onboarding and settings.

## Context
The app is at /Users/Locafox/Projects/menumaker. It's a Next.js app with 6-step onboarding. Delivery URLs already exist in the data model (restaurant.delivery.uberEats, wolt, mrD, deliveroo, custom[]). The dashboard already has URL inputs for these but the onboarding skips them entirely.

## What to build

### 1. New onboarding step: Step3Delivery.tsx

Create `/components/onboarding/Step3Delivery.tsx`

This becomes Step 3 in the onboarding flow (shift existing Step3Design → Step4, Step4Menu → Step5, Step5Specials → Step6, Step6Launch → Step7). Update TOTAL_STEPS to 7 in create/page.tsx and update renderStep() accordingly.

The step should look polished and feel like a "connect your platforms" moment, not just a form.

**Design:**
- Heading: "Where can customers order from?" 
- Subheading: "Add your delivery links. Customers tap to order directly from your menu."
- Skip text: "You can always add these later"

**Platform cards (4 built-in + custom):**
Each platform is a card with:
- Platform logo/icon (use SVG or emoji as fallback)
- Platform name
- Status indicator: "Not connected" (gray) or "Connected ✓" (green)
- When clicked/expanded: shows a URL input field with placeholder

Platforms:
1. **Uber Eats** — bg: black, accent: #06C167 (green)
   - Icon: use a food delivery bag emoji 🛵 as fallback
   - Placeholder: "https://www.ubereats.com/za/store/your-restaurant/..."
   - Validate: URL must contain "ubereats.com"

2. **Wolt** — bg: #009DE0 (teal blue)
   - Icon: 🔵 as fallback  
   - Placeholder: "https://wolt.com/en/zaf/cape-town/restaurant/your-restaurant"
   - Validate: URL must contain "wolt.com"

3. **Mr D** — bg: #E8003D (red)
   - Icon: 🔴 as fallback
   - Placeholder: "https://www.mrdfood.com/restaurant/your-restaurant"
   - Validate: URL must contain "mrdfood.com" or "mrd.co.za"

4. **Deliveroo** — bg: #00CCBC (teal)
   - Icon: 🟢 as fallback
   - Placeholder: "https://deliveroo.co.za/menu/..."
   - Validate: URL must contain "deliveroo"

5. **+ Add custom platform** button — opens an inline form with name + URL fields

**Interaction pattern:**
- Cards are collapsed by default showing just logo + name + connection status
- Click card → expands to show URL input field
- User pastes URL → validate format → show green checkmark if valid, red hint if wrong format
- Connected cards show green "Connected ✓" badge
- Multiple platforms can be open at once

**No URL is required** — this step is optional, show a "Skip for now →" link below the cards.

### 2. Update create/page.tsx

- Change TOTAL_STEPS from 6 to 7
- Add Step3Delivery import
- Update renderStep() to insert Step3Delivery as case 3, shift others
- Update stepProps to pass updateRestaurant

### 3. Upgrade the dashboard delivery section

In `/app/dashboard/[menuId]/page.tsx`, find the RestaurantInfoSection's delivery section.

Replace the plain Input fields with the same styled platform cards component. Extract the platform cards into a shared component at `/components/ui/DeliveryPlatformCards.tsx` so both onboarding and dashboard use the same UI.

The shared component props:
```typescript
interface DeliveryPlatformCardsProps {
  delivery: Menu["restaurant"]["delivery"];
  onChange: (delivery: Menu["restaurant"]["delivery"]) => void;
}
```

### 4. Visual polish on the menu page

In `/app/menu/[menuId]/page.tsx` (or wherever delivery buttons render), make sure connected platforms show as proper branded pill buttons with the platform's brand color, not just generic links.

Check the MenuHero or equivalent component. If delivery buttons exist, update them to use platform brand colors:
- Uber Eats: black bg, white text
- Wolt: #009DE0 bg, white text  
- Mr D: #E8003D bg, white text
- Deliveroo: #00CCBC bg, white text
- Custom: dark gray bg

### 5. Smart URL helper

When user pastes a URL, auto-detect which platform it is and suggest it. E.g. if they paste a Wolt URL into the wrong field, detect and suggest moving it.

### Implementation notes
- Keep using the existing Menu type — no schema changes needed
- Use generateId() from lib/utils for custom platform IDs
- Consistent UI: rounded-2xl cards, warm shadows, same Button component
- Mobile-first — these cards must look great on phone

### When done
1. Run: `cd /Users/Locafox/Projects/menumaker && npm run build 2>&1 | tail -20`
2. Fix any TypeScript errors
3. Commit: `git add -A && git commit -m "feat: delivery platform linking in onboarding and dashboard"`
4. Push: `git push`
5. Run: `openclaw system event --text "Delivery platform linking feature complete — Wolt, Uber Eats, Mr D, Deliveroo in onboarding + dashboard" --mode now`
