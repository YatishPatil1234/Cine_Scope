module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        cardHover: "var(--card-hover)",
        border: "var(--border)",
        input: "var(--input)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
      },
    },
  },
};
