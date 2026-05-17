# Open Library Search

A modern React + Vite app for searching books and authors using the Open Library API. Built with responsive design, intelligent caching, and a clean user experience.

## App demo

![Open Library Search - Live Demo](./public/Open_Library_GIF.gif)

Quick start

```bash
git clone https://github.com/MetinVn/Open-Library-Search-API.git
cd Open-Library-Search-API
npm install
npm run dev
```

Features

- **Debounced search**: instant book and author queries with live results as you type.
- **Rich results**: book covers, titles, authors, publication year, and reading statistics.
- **Author profiles**: detailed pages with biography, life dates, top works, and verified links.
- **Smart caching**: IndexedDB stores search results for faster repeat queries and offline browsing.
- **Filtering & sorting**: refine results directly in the interface.
- **Dark mode**: seamless theme switching across all pages.
- **Responsive design**: works smoothly on desktop, tablet, and mobile.

How it works

- Search for a book or author. Results load incrementally with debounce to keep requests efficient.
- Click any author to view their profile with full bio and bibliography.
- Results are automatically cached, so returning searches are instant.
- Use the theme toggle in the sidebar to switch between light and dark modes.

Local storage & caching

Search results and images are stored in IndexedDB (browser-based database) across four stores: `book_search` and `author_search` for query results, `showcase_data` for featured content, and `image_cache` for book/author covers. This enables fast repeat searches and graceful offline browsing without hitting the API again.

Tech stack

- React, Vite, Tailwind CSS, Material-UI, React Router (navigation)
- IndexedDB for persistent, client-side caching
- Open Library Search API for all book and author data

Project structure

Code is organized under `src/`: pages (search, details), reusable hooks (search, debounce, caching), UI components, and utilities. Start in `src/pages/` to explore the main app flows.
