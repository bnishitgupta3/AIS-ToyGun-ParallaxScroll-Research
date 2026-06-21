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
// engines and AI crawlers (which often don't run JS) can read the content.
// When that pre-rendered markup is present we hydrate it; otherwise we mount
// fresh (normal dev / non-prerendered serving).
if (rootEl.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootEl, app);
} else {
  ReactDOM.createRoot(rootEl).render(app);
}
