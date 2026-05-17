import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { PageLoader } from "./components/PageLoader.jsx";
import { ROUTES } from "./routes/routes.js";

const LazyAuthorDetails = lazy(() => import("./pages/AuthorDetails/AuthorDetails.jsx"));
const LazyAuthorSearch = lazy(() => import("./pages/AuthorSearch/AuthorSearch.jsx"));
const LazyBookSearch = lazy(() => import("./pages/BookSearch/BookSearch.jsx"));
const LazyNotFound = lazy(() => import("./pages/NotFound/NotFound.jsx"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Router basename={ROUTES.BASE_NAME}>
      <Routes>
        <Route
          path={ROUTES.AUTHOR_DETAILS}
          element={
            <Suspense fallback={<PageLoader message="Loading page..." />}>
              <LazyAuthorDetails />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.SEARCH_AUTHORS}
          element={
            <Suspense fallback={<PageLoader message="Loading page..." />}>
              <LazyAuthorSearch />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.SEARCH_BOOKS}
          element={
            <Suspense fallback={<PageLoader message="Loading page..." />}>
              <LazyBookSearch />
            </Suspense>
          }
        />
        <Route path={ROUTES.HOME} element={<App />} />
        <Route
          path={ROUTES.NOT_FOUND}
          element={
            <Suspense fallback={<PageLoader message="Loading..." />}>
              <LazyNotFound />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  </>
);
