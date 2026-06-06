import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Series from "./routes/Series";
import Reader from "./routes/Reader";
import NotFound from "./routes/NotFound";
import "./styles/global.css";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/series/:toonId", element: <Series /> },
      { path: "*", element: <NotFound /> }
    ]
  },
  // Reader uses a standalone (chrome-less) layout for immersion.
  { path: "/reader/:toonId/:episodeId", element: <Reader /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
