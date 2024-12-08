import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./authContext.jsx";
import { ToastContainer } from "react-toastify";

import "./styles/index.css";
import "./styles/navbar.css";
import "./styles/error-page.css";
import "./styles/footer.css";
import "./styles/all-cars.page.css";
import "./styles/login.page.css";
import "./styles/layout.css";
import "./styles/register.css";
import "./styles/contact-form.css";
import "./styles/single-car.css";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/filter.css";
import "./styles/home.css";
import "./styles/form-rent.css";
import "./styles/submit-form-admin.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-center"
        toastStyle={{ textAlign: "center" }}
      />
    </AuthProvider>
  </StrictMode>
);
