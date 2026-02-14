/**
 * Content language: which movies to show.
 * TMDB ISO 639-1: en-US (English), hi (Hindi).
 */
export const LANGUAGES = [
  { code: "en-US", label: "English", shortLabel: "EN" },
  { code: "hi", label: "Hindi", shortLabel: "HI" },
];

export const UI = {
  "en-US": {
    nav: {
      search: "Search",
      watchlist: "Watchlist",
    },
    hero: {
      trendingNow: "Trending now",
      viewMovie: "View movie",
      exploreMovies: "Explore Movies",
      orViewWatchlist: "or View watchlist",
      discoverTitle: "Discover movies",
      discoverSubtitle: "worth your time",
      tagline: "Explore trending, popular, and top-rated films. Save your favorites and build your watchlist.",
      taglineWithFeatured: "Explore trending, popular, and upcoming films. Save your favorites and build your watchlist.",
    },
    home: {
      trending: "Trending This Week",
      nowPlaying: "Now in Theaters",
      upcoming: "Upcoming",
      popular: "Popular Movies",
      topRated: "Top Rated",
    },
    search: {
      title: "Search movies",
      subtitle: "Find any film by title. Start typing to see results.",
      placeholder: "Search for a movie...",
      noResults: "No results found",
      noResultsHint: "Try a different title or check the spelling.",
      minChars: "Type at least 3 characters to search.",
      startSearching: "Start searching",
      startHint: "Enter a movie title above to discover films.",
      resultsCount: (n) => `${n} result${n !== 1 ? "s" : ""}`,
    },
    watchlist: {
      title: "Your Watchlist",
      subtitle: "Movies you've saved. Remove from any movie page.",
      empty: "No movies yet",
      emptyHint: "Add films from the home page or search to see them here.",
      searchMovies: "Search movies",
    },
    movie: {
      cast: "Cast",
      similar: "Similar Movies",
      addToWatchlist: "Add to Watchlist",
      removeFromWatchlist: "Remove from Watchlist",
    },
    footer: {
      poweredBy: "Powered by TMDB. For discovery only; no streaming.",
    },
  },
  mr: {
    nav: {
      search: "शोध",
      watchlist: "वॉचलिस्ट",
    },
    hero: {
      trendingNow: "आज ट्रेंडिंग",
      viewMovie: "चित्रपट पहा",
      exploreMovies: "चित्रपट एक्सप्लोर करा",
      orViewWatchlist: "किंवा वॉचलिस्ट पहा",
      discoverTitle: "चित्रपट शोधा",
      discoverSubtitle: "जे पाहण्यासारखे आहेत",
      tagline: "ट्रेंडिंग, लोकप्रिय आणि टॉप रेटेड चित्रपट एक्सप्लोर करा. आवडती जतन करा.",
      taglineWithFeatured: "ट्रेंडिंग, लोकप्रिय आणि आगामी चित्रपट एक्सप्लोर करा. आवडती जतन करा.",
    },
    home: {
      trending: "या आठवड्यात ट्रेंडिंग",
      nowPlaying: "आज थिएटरमध्ये",
      upcoming: "आगामी",
      popular: "लोकप्रिय चित्रपट",
      topRated: "टॉप रेटेड",
    },
    search: {
      title: "चित्रपट शोधा",
      subtitle: "शीर्षकाने कोणताही चित्रपट शोधा. निकालांसाठी टाइप करा.",
      placeholder: "चित्रपट शोधा...",
      noResults: "निकाल सापडले नाहीत",
      noResultsHint: "वेगळे शीर्षक वापरा किंवा स्पेलिंग तपासा.",
      minChars: "शोधण्यासाठी किमान 3 अक्षर टाइप करा.",
      startSearching: "शोध सुरू करा",
      startHint: "चित्रपट शोधण्यासाठी वर शीर्षक प्रविष्ट करा.",
      resultsCount: (n) => `${n} निकाल`,
    },
    watchlist: {
      title: "तुमची वॉचलिस्ट",
      subtitle: "तुम्ही जतन केलेले चित्रपट. कोणत्याही चित्रपट पृष्ठावरून काढा.",
      empty: "अजून चित्रपट नाहीत",
      emptyHint: "येथे दिसण्यासाठी मुख्य पृष्ठ किंवा शोधातून चित्रपट जोडा.",
      searchMovies: "चित्रपट शोधा",
    },
    movie: {
      cast: "कलाकार",
      similar: "समान चित्रपट",
      addToWatchlist: "वॉचलिस्टमध्ये जोडा",
      removeFromWatchlist: "वॉचलिस्टमधून काढा",
    },
    footer: {
      poweredBy: "TMDB द्वारे. फक्त शोध; स्ट्रीमिंग नाही.",
    },
  },
};

export function getUI(lang) {
  return UI[lang] || UI["en-US"];
}
