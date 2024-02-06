import { createBrowserRouter, RouterProvider , Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./context/AppContext";
import React from "react";

function App() {
  const { isLoggenIn } = useAppContext();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/sign-in",
          element: <SignIn />,
        },

        {
          path: "/add-hotel",

          element: isLoggenIn ? <AddHotel /> : <Navigate to
        },
      ],
    },

    {
      path: "/search",
      element: <Layout />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
