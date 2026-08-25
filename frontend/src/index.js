import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

// Dev-only: the Emergent visual editor injects x-* JSX attributes; this helper
// strips them before they reach the R3F reconciler. It uses CommonJS
// (module.exports) which the production ESM build rejects ("ES Modules may not
// assign module.exports") — and it's a no-op in production anyway (no editor,
// no x-* attrs), so we only load it in dev. Without this guard the production
// build throws at startup and renders a blank page.
if (process.env.NODE_ENV !== "production") {
    require("@/lib/r3fPropFilter");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const rootEl = document.getElementById("root");
const app = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// react-snap pre-renders each route to static HTML at build time so search
// engines and AI crawlers (which often don't run JS) still read the content.
//
// We deliberately DO NOT hydrate that markup. React 19's strict hydration throws
// (minified error #418 — a server/client mismatch) on the smallest difference:
// framer-motion initial states, the FOUC reveal gate, browser-only values, etc.
// On the pre-rendered production build that thrown error unmounted the ENTIRE app
// to a blank white page while navigating — the "site goes blank, needs reload"
// bug. (It never showed in dev/local because a non-prerendered root is empty and
// already takes the createRoot path.)
//
// Always createRoot + render instead: crawlers still get the pre-rendered HTML,
// real browsers do a clean client render over it (the FOUC gate hides the swap),
// and there is no hydration step left to mismatch.
ReactDOM.createRoot(rootEl).render(app);
