import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorPage from "./pages/ErrorPage.jsx";
import SharedLayout from "./layout/SharedLayout.jsx";
import SubmitCars from "./pages/SubmitFormAdmin.jsx";
import { loader as AllCarsLoader } from "./pages/AllCars.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AllCars from "./pages/AllCars.jsx";
import ContactForm from "./pages/ContactForm.jsx";

function ReactRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <SharedLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "cars",
          element: <AllCars />,
          loader: AllCarsLoader,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "submit-form-admin",
          element: <SubmitCars />,
        },
        {
          path: "contact",
          element: <ContactForm />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default ReactRouter;
