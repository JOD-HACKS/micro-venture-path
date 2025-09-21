import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { pwa } from "./lib/pwa";

// Initialize PWA
pwa.init().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
