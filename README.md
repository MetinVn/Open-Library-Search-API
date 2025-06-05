# Open Library Search API Project

A modern React application built with Vite, providing a user-friendly interface to search for authors and books using the Open Library Search API.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure & Navigation](#project-structure--navigation)
- [Setup](#setup)

---

## Project Overview

Open Library Search API Project allows users to search for books and authors, view detailed information, and interact with a responsive, dark-mode-enabled UI. The app leverages Material-UI for styling and IndexedDB for efficient local data storage.

---

## Technology Stack

- **React** – UI library for building interactive interfaces
- **Vite** – Fast development/build tool
- **Material-UI** – Component library for consistent, accessible UI
- **Tailwind CSS** – Utility-first CSS framework for rapid styling
- **Open Library Search API** – Public API for books and authors data
- **IndexedDB (via idb)** – Client-side storage for caching search results
- **React Router** – Routing and navigation

---

## Features

- **Search Authors**: Find authors by name and view their details.
- **Search Books**: Search for books and see author, title, and reading stats.
- **Author Details**: View author bio, birth date, Wikipedia, and official links.
- **Book Details**: See author, title, and reading statistics (want to read, already read, currently reading).
- **IndexedDB Caching**: Search results are cached locally for performance.
- **Material-UI & Tailwind Styling**: Responsive, accessible, and themeable UI.
- **Dark Mode Support**: Toggle between light and dark themes.
- **Responsive Design**: Works well on desktop and mobile devices.
- **Efficient Data Handling**: Handles large datasets and provides sorting/filtering.

---

## Project Structure & Navigation

The project is organized as follows:

```
src/
  App.jsx                # Main app component
  index.css              # Tailwind CSS imports
  main.jsx               # Entry point, sets up routing
  Func/
    CalcCounts.jsx       # Utility functions for count formatting/styling
  layouts/
    Sidebar.jsx          # Sidebar navigation component
    Welcome.jsx          # Welcome/landing page component
  pages/
    AuthorInfo.jsx       # Author detail page
    AuthorSearch.jsx     # Author search page
    BookSearch.jsx       # Book search page
    Home.jsx             # Home page (renders Welcome)
```

- **Navigation**:
  - The app uses React Router for navigation.
  - The sidebar (`Sidebar.jsx`) provides quick access to book and author search pages.
  - The welcome screen (`Welcome.jsx`) is shown on the home route (`/`).
  - Search results and details are displayed on their respective pages under `/books/`, `/author/`, and `/author/:authorKey`.

---

## Setup

To get started with the project, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/MetinVn/Open-Library-Search-API.git
   cd Open-Library-Search-API
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the development server:**

   ```sh
   npm run dev
   ```

4. **Build for production:**

   ```sh
   npm run build
   ```

---

For more details, see the source files in the [`src/`](src) directory.
