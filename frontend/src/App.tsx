import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/addHotel";
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
          element: <SignIn /> },

          isLoggenIn && {
          path : `/add-hotel`,
          element : <AddHotel />
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
