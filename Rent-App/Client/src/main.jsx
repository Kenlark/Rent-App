import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./styles/index.css";
import "./styles/navbar.css";
import "./styles/error-page.css";
import "./styles/footer.css";
import "./styles/all-cars.page.css";
import "./styles/login.page.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
