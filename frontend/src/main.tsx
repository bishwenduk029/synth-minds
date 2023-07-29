import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Hero from "./components/Hero/index.tsx";
import RootLayout from "./layout.jsx";
import SignInPage from "./sign-in/index.tsx";
import SignOutPage from "./sign-up/page.tsx";
import Header from "./components/Header.tsx";
import LazyChannelDataWrapper from "./chats/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Hero />
      </>
    ),
  },
  {
    path: "/chats",
    element: <LazyChannelDataWrapper />,
  },
  {
    path: "/sign-in/*",
    element: (
      <>
        <Header />
        <SignInPage />
      </>
    ),
  },
  {
    path: "sign-out/*",
    element: (
      <>
        <Header />
        <SignOutPage />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RootLayout>
    <RouterProvider router={router} />
  </RootLayout>
);
