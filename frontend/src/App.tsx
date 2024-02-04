import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register"
import SignIn from "./pages/SignIn";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children : [{
        path : "/register",
        element : <Register />
      },
      {path : "/sign-in",
      element : <SignIn />}]
    },

    {
      path : "/search",
      element : <Layout />
    },
      
  ]);

  return <RouterProvider router={router} />;
}

export default App;
