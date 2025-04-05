# SuperTip Frontend Project - Detailed Context Document

**1. Project Goal:**

To build a web application for live streamers that includes:

- A public landing page showcasing the service.
- Individual, customizable tipping pages for streamers.
- A dashboard for streamers to manage their profile, view stats, and configure settings.
- Stream overlay elements (specifically, customizable tip alerts) for use in broadcasting software like OBS.

**2. Core Technologies:**

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** React
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Data Fetching/State Management:** TanStack Query (`@tanstack/react-query`) v5
- **Icons:** React Icons (`react-icons`)
- **Effects:** react-confetti

**3. Project Structure (Key Directories):**

- `src/app/`: Contains application routes based on directory structure (App Router).
  - `layout.tsx`: Root layout, includes `Providers`.
  - `providers.tsx`: Client component setting up `QueryClientProvider`.
  - `globals.css`: Global styles, including base Tailwind directives and potentially custom CSS for alerts.
  - `page.tsx`: Landing page component.
  - `login/page.tsx`: Login page component.
  - `waitlist/page.tsx`: Waitlist signup page component.
  - `streamer/[username]/page.tsx`: Dynamic route for public streamer tipping pages.
  - `dashboard/`: Contains routes related to the streamer dashboard.
    - `layout.tsx`: Dashboard layout with persistent sidebar.
    - `page.tsx`: Dashboard overview page.
    - `tips/page.tsx`: Placeholder for tip history.
    - `profile/page.tsx`: Placeholder for public page settings.
    - `settings/page.tsx`: Placeholder for general settings.
    - `widgets/page.tsx`: Page for configuring and getting stream widget URLs.
  - `alerts/`: Contains routes for stream overlay elements.
    - `layout.tsx`: Minimal layout ensuring transparent background for overlays.
    - `tip/page.tsx`: Tip alert overlay component.
- `src/lib/`: Contains shared utilities and modules.
  - `api.ts`: Centralized API fetching logic, function definitions, and TanStack Query custom hooks.
- `public/`: Static assets.
  - `images/`: Contains default avatar/cover images.
  - `sounds/`: **(Needs manual creation)** Intended location for alert sound files.

**4. API Integration Strategy (`@tanstack/react-query`):**

- **Base URL:** Configured to target `http://localhost:8000/api`.
- **Centralized Logic:** All API interaction logic is defined in `src/lib/api.ts`.
  - `apiFetch`: A helper function handles actual `fetch` calls, base URL, default headers (`Content-Type: application/json`), basic logging, and standardized error handling (throws an `Error` object with a message). Includes a `TODO` for adding Authorization headers dynamically.
  - **API Functions:** Specific async functions defined for each endpoint (e.g., `loginUser`, `joinWaitlist`, `createTipOrder`, `verifyTip`, `getDashboardStats`, `getRecentTips`).
  - **Custom Hooks:** Corresponding hooks built using `useMutation` (for POST/PUT etc.) and `useQuery` (for GET). These hooks encapsulate the fetching logic and provide states (`data`, `isPending`/`isLoading`, `isError`, `error`) and methods (`mutate`) to components.
- **Implemented Hooks & Endpoints:**
  - `useLogin` -> `POST /auth/login`
  - `useJoinWaitlist` -> `POST /waitlist`
  - `useCreateTipOrder` -> `POST /tips/order`
  - `useVerifyTip` -> `POST /tips/verify`
  - `useDashboardStats` -> `GET /dashboard/stats` (queryKey: `['dashboardStats']`)
  - `useRecentTips` -> `GET /dashboard/tips?limit={limit}` (queryKey: `['recentTips', limit]`)
- **Component Usage:** Components import and use these hooks to trigger API calls and manage related UI states (loading spinners, error messages, disabling inputs, trigger actions, render data). Manual `fetch` and `useState` for API data/loading/error have been removed from components.

**5. Page/Route Details:**

- **`/` (Landing Page):**
  - Displays general info about SuperTip.
  - Links to `/waitlist` and `/login`.
  - No direct API calls. Uses consistent theme.
- **`/waitlist`:**
  - Form with Name, Email, Platform, Username.
  - Uses `useJoinWaitlist` hook on submit. Sends only email currently (can be adjusted in `api.ts`).
  - Shows a success view using `waitlistMutation.isSuccess`.
  - Displays errors using `waitlistMutation.isError` and `waitlistMutation.error.message`.
- **`/login`:**
  - Form with Email, Password. Prefilled with mock credentials for testing (`streamer@example.com` / `password`).
  - Uses `useLogin` hook on submit.
  - On `onSuccess` callback, redirects to `/dashboard`.
  - Displays errors using `loginMutation.isError` and `loginMutation.error.message`.
  - Disables inputs/button based on `loginMutation.isPending`.
- **`/streamer/[username]` (Tipping Page):**
  - Displays static mock streamer data.
  - Features multi-currency selection (`useState`).
  - Features amount input with client-side validation (`useState` for validation error).
  - Uses `useCreateTipOrder` on form submit.
    - On `onSuccess`, retrieves `orderId`, `tipId`, `providerKeyId` from API. Stores `tipId` in local state (`useState`). Calls `initializeRazorpay`.
    - `onError` displays error message.
  - `initializeRazorpay` function:
    - Configures Razorpay options using data from `createOrderMutation`.
    - Loads Razorpay script.
    - Sets up Razorpay `handler` and `payment.failed` callbacks.
    - Opens Razorpay modal.
  - Razorpay `handler`:
    - Uses `useVerifyTip` hook, passing payment details and the stored `tipId`.
    - On `onSuccess`, sets `showSuccess` state to true (triggers confetti and success UI).
    - `onError` displays error message.
  - Combined loading state `isProcessing` (`createOrderMutation.isPending || verifyTipMutation.isPending`) used to disable inputs/button.
  - Combined error display shows local validation error OR API mutation error.
- **`/dashboard/layout.tsx`:**
  - Client component (`"use client"`).
  - Contains the persistent sidebar structure.
  - Uses `usePathname` to determine the active route and apply conditional styling to sidebar links.
  - Logout button uses `useRouter` to redirect to `/login` (simulated logout).
- **`/dashboard` (Overview Page):**
  - Client component (`"use client"`).
  - Uses `useDashboardStats` and `useRecentTips` hooks to fetch data.
  - Displays loading state while `isLoading` is true.
  - Displays error message if `error` object exists.
  - Renders stats cards and recent tips table using the `data` from the hooks.
- **`/dashboard/tips`, `/dashboard/profile`, `/dashboard/settings`:**
  - Contain basic placeholder content. No API calls implemented yet.
- **`/dashboard/widgets`:**
  - Client component (`"use client"`).
  - Allows selection of Alert Theme (10 options: Default, Cyberpunk, Fantasy, Space, Cozy, Pixel Art, Anime, Horror, Sci-Fi HUD, Nature).
  - Allows selection of Alert Sound (from predefined options, requires audio files in `/public/sounds/`).
  - Generates the unique Alert URL including selected `theme` and `sound` query parameters.
  - Provides a "Copy URL" button using `navigator.clipboard`.
  - Includes instructions for adding the URL as a Browser Source in OBS/Streamlabs.
  - Provides a link to test the generated alert URL.
- **`/alerts/layout.tsx`:** Server component providing minimal HTML structure with transparent background style for body.
- **`/alerts/tip`:**
  - Client component (`"use client"`).
  - Designed for use as an OBS Browser Source.
  - Receives tip data via query parameters (`name`, `amount`, `currency`, `message`, `theme`, `sound`).
  - Displays an animated alert based on the selected `theme` (unique styles, icon, and animation per theme).
  - Plays the selected notification sound (specified by `sound` query parameter).
  - Alert display duration varies based on the approximate USD value of the tip.
  - Uses `AnimatePresence` for entry/exit animations.

**6. Styling:**

- Tailwind CSS is the primary styling method.
- Consistent theme applied across most user-facing pages (Landing, Login, Dashboard, Tipping) using slate/indigo/purple gradients and specific card/button styles.
- Alert themes (`/alerts/tip`) use theme-specific Tailwind class strings defined within the component.
- Some alert themes (`pixel`, `cyberpunk`, `horror`, `scifi`) reference custom CSS classes (`font-pixelated`, `pixelated-corners`, `glitch-text`, `distorted-border`, `hud-lines`) which would need to be defined in `src/app/globals.css` (example placeholders provided previously).

**7. Current State & Known Limitations:**

- **Backend Dependency:** All API calls currently target `http://localhost:8000/api` and **will fail** until a backend server is running there and implements the documented endpoints.
- **Authentication:** No actual authentication is implemented. Login is simulated, and no auth tokens are stored or sent with authenticated API requests (e.g., dashboard calls). The `apiFetch` helper has a TODO comment for this.
- **Real-time Alerts:** Tip alerts are triggered manually via query parameters. A WebSocket implementation is needed on both backend and the `/alerts/tip` page for live alerts.
- **Alert URL Security:** The alert URL generated on the widget page is static (per base URL). It needs a unique, secure token per user, generated by the backend and included in the URL, to prevent unauthorized triggering.
- **Static Data:** Dashboard data and Streamer Profile data are currently static/mock or fetched via hooks that will fail without a backend.
- **Placeholder Pages:** Dashboard sections (`/tips`, `/profile`, `/settings`) are placeholders needing implementation (including data fetching/mutation hooks).
- **Audio Files:** Alert sound files referenced in `/dashboard/widgets` need to be manually created and placed in `/public/sounds/`.
- **Alert CSS:** Custom CSS for advanced alert theme effects needs to be implemented and refined in `globals.css`.
- **Waitlist Form:** The waitlist form on `/waitlist` includes fields (Name, Platform, Username) that are not currently sent in the API call via `useJoinWaitlist` (only email is sent). This needs alignment with backend requirements.
- **Tipping Form:** Tip amount validation logic is client-side only. Backend validation is crucial.
- **Error Handling:** Basic error display is implemented, but could be enhanced (e.g., specific messages for different HTTP status codes, user-friendly messages).
- **Image Placeholders:** Uses `unsplash.com` for logos/images; should be replaced with actual project assets.
