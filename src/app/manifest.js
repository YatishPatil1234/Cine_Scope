export default function manifest() {
  return {
    name: "CineScope",
    short_name: "CineScope",
    description: "Discover trending movies, TV shows, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#6366f1",
    orientation: "portrait-primary",
    categories: ["entertainment"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      { name: "Search",   short_name: "Search",   url: "/search",   description: "Search movies & TV shows" },
      { name: "Discover", short_name: "Discover", url: "/discover", description: "Browse and filter movies"  },
      { name: "Watchlist",short_name: "Watchlist",url: "/watchlist",description: "Your saved movies"         },
    ],
  };
}
