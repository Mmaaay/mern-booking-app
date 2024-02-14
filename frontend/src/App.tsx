import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel.tsx";
import { useAppContext } from "./context/AppContext";
import React from "react";
import MyHotels from "./pages/MyHotels.tsx";
import EditHotel from "./pages/EditHotel.tsx";
import Search from "./pages/Search.tsx";

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
          element: isLoggenIn ? <AddHotel /> : <SignIn />,
        },
        { path: "/my-hotels", element: isLoggenIn ? <MyHotels /> : <SignIn /> },
        {
          path: "/edit-hotel/:hotelId",
          element: isLoggenIn ? <EditHotel /> : <SignIn />,
        },
        {
          path: "/search",
          element: <Search />,
        },
      ],
    },


  ]);

  return <RouterProvider router={router} />;
}

export default App;
