import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";

// Dev-only: the Emergent visual editor injects x-* JSX attributes; this helper
// strips them before they reach the R3F reconciler. It uses CommonJS
// (module.exports) which the production ESM build rejects — and it's a no-op in
// production anyway (no editor, no x-* attrs), so we only load it in dev.
if (process.env.NODE_ENV !== "production") {
    require("@/lib/r3fPropFilter");
}
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
