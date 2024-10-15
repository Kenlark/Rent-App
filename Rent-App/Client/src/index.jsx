import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorPage from "./pages/ErrorPage.jsx";
import SharedLayout from "./layout/SharedLayout.jsx";
import SubmitCars from "./pages/SubmitFormAdmin.jsx";
import { loader as AllCarsLoader } from "./pages/AllCars.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import AllCars from "./pages/AllCars.jsx";

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
