import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorPage from "./pages/ErrorPage.jsx";
import SharedLayout from "./layout/SharedLayout.jsx";
import Cars from "./pages/Cars.jsx";
import { loader as CarsLoader } from "./pages/Cars.jsx";

function ReactRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <SharedLayout />,
      children: [
        {
          index: true,
          element: <Cars />,
          loader: CarsLoader,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default ReactRouter;
