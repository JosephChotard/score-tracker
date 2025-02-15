import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Scores from "./Scores";
import UserInfo from "./UserInfo";

const router = createHashRouter([
    {
        path: "/",
        element: <UserInfo />,
    },
    {
        path: "/scores",
        element: <Scores />,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <Theme accentColor="iris" grayColor="gray" appearance="dark">
            <RouterProvider router={router} />
        </Theme>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
