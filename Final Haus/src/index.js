/* =============================================================================
 *  index.js — 程式进入点
 * =============================================================================
 *  只做三件事：载入样式 → 找到 public/index.html 里的 <div id="root"> → 把 App 塞进去。
 *  一般不需要动这个文件。
 * ========================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
