import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthorInfo from "./pages/AuthorInfo.jsx";
import AuthorSearch from "./pages/AuthorSearch.jsx";
import BookSearch from "./pages/BookSearch.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Router basename="/Open-Library-Search-API">
      <Routes>
        <Route exact path="/" Component={App} />
        <Route exact path="/author/:authorKey" Component={AuthorInfo} />
        <Route exact path="/author/" Component={AuthorSearch} />
        <Route exact path="/books/" Component={BookSearch} />
      </Routes>
    </Router>
  </>
);
