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
    <Router>
      <Routes>
        <Route exact path="/home/" Component={App} />
        <Route exact path="/home/author/:authorKey" Component={AuthorInfo} />
        <Route exact path="/home/author/" Component={AuthorSearch} />
        <Route exact path="/home/books/" Component={BookSearch} />
      </Routes>
    </Router>
  </>
);
