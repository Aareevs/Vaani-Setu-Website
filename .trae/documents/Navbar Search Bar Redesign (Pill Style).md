## Goal
Design the navbar search to match the provided pill-style: rounded, subtle border/shadow, grey placeholder, inline search icon, no bulky button.

## Visual Specs
- Shape: `rounded-full` pill with soft border (`border-gray-300/60`) and light shadow (`shadow-sm` → `shadow-md` on focus).
- Background: `bg-white/70` (light) and `dark:bg-gray-800` with `border-gray-700` in dark.
- Icon: Lucide `Search` (16–18px) positioned left inside the input, `text-gray-400`.
- Placeholder: `text-gray-500` (light) / `dark:placeholder-gray-400`.
- Focus/Hover: no bright blue ring; use subtle border color lift (`border-gray-400` / `dark:border-gray-500`) and small shadow.
- Sizes: Desktop `w-64 h-10`, Mobile `w-40 h-10`. Left padding `pl-9` to clear the icon.

## Behavior
- Enter triggers `onSearch(query)`, using existing landing-page handler that scrolls to FAQ and filters results.
- Keep current `query` state; no separate button.
- Debounce is unnecessary here; direct on Enter is crisp in nav.

## Implementation
1. Update `src/components/PublicNav.tsx` (desktop & mobile):
   - Wrap with `div` `relative w-64 rounded-full border bg-white/70 shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700`.
   - Place `<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />`.
   - Input classes: `pl-9 pr-3 h-10 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-300 dark:placeholder-gray-400 focus:border-gray-400 focus:shadow-md`.
   - Remove any blue `focus:ring` usage.
2. Mirror the same structure for mobile (`w-40`).
3. Keep `submitSearch()` on Enter; maintain `onSearch` passthrough to `LandingPage`.

## Accessibility
- Add `role="search"` on the wrapper and `aria-label="Search site"` on the input.
- Ensure contrast remains AA in dark mode.

## Verification
- Run dev server, visually verify pill style in both themes and breakpoints.
- Test: typing then pressing Enter scrolls to FAQ and filters items correctly.

## Optional Enhancements (post approval)
- Add clear (×) button inside input when non-empty.
- Add tiny animated focus glow using `ring-1 ring-gray-300/50` only in dark mode.
- Use `w-56` for tighter desktop if space feels crowded.