import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage            from "@/pages/LandingPage";
import ProductShowcase        from "@/pages/ProductShowcase";       // existing MP5K page
import M416Showcase           from "@/pages/M416Showcase";
import CrimsonBlasterShowcase from "@/pages/CrimsonBlasterShowcase";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home — full D2C landing page */}
                <Route path="/"               element={<LandingPage />} />

                {/* Product detail pages */}
                <Route path="/product/mp5k"   element={<ProductShowcase />} />
                <Route path="/product/m416"   element={<M416Showcase />} />
                <Route path="/product/crimson" element={<CrimsonBlasterShowcase />} />

                {/* Fallback → home */}
                <Route path="*"              element={<LandingPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
