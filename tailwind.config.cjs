/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
      "./**/*.{css,html}", // Ensure your CSS files are scanned!
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
            950: "#082f49",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        },
        backgroundColor: (theme) => ({
          ...theme("colors"),
        }),
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          fadeIn: {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          slideUp: {
            "0%": { transform: "translateY(100%)" },
            "100%": { transform: "translateY(0)" },
          },
          shimmer: {
            "100%": {
              transform: "translateX(100%)",
            },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "fade-in": "fadeIn 0.5s ease-out",
          "slide-up": "slideUp 0.5s ease-out",
          shimmer: "shimmer 2s infinite",
        },
        typography: {
          DEFAULT: {
            css: {
              maxWidth: "65ch",
              color: "var(--tw-prose-body)",
              '[class~="lead"]': {
                color: "var(--tw-prose-lead)",
              },
              strong: {
                color: "var(--tw-prose-bold)",
              },
              'ol[type="A"]': {
                "--list-counter-style": "upper-alpha",
              },
              'ol[type="a"]': {
                "--list-counter-style": "lower-alpha",
              },
              'ol[type="A" s]': {
                "--list-counter-style": "upper-alpha",
              },
              'ol[type="a" s]': {
                "--list-counter-style": "lower-alpha",
              },
              'ol[type="I"]': {
                "--list-counter-style": "upper-roman",
              },
              'ol[type="i"]': {
                "--list-counter-style": "lower-roman",
              },
              'ol[type="I" s]': {
                "--list-counter-style": "upper-roman",
              },
              'ol[type="i" s]': {
                "--list-counter-style": "lower-roman",
              },
              'ol[type="1"]': {
                "--list-counter-style": "decimal",
              },
            },
          },
          dark: {
            css: {
              "--tw-prose-body": "var(--tw-prose-invert-body)",
              "--tw-prose-headings": "var(--tw-prose-invert-headings)",
              "--tw-prose-links": "var(--tw-prose-invert-links)",
              "--tw-prose-bold": "var(--tw-prose-invert-bold)",
              "--tw-prose-counters": "var(--tw-prose-invert-counters)",
              "--tw-prose-bullets": "var(--tw-prose-invert-bullets)",
              "--tw-prose-hr": "var(--tw-prose-invert-hr)",
              "--tw-prose-quotes": "var(--tw-prose-invert-quotes)",
              "--tw-prose-quote-borders": "var(--tw-prose-invert-quote-borders)",
              "--tw-prose-captions": "var(--tw-prose-invert-captions)",
              "--tw-prose-code": "var(--tw-prose-invert-code)",
              "--tw-prose-code-bg": "var(--tw-prose-invert-code-bg)",
              "--tw-prose-pre-code": "var(--tw-prose-invert-pre-code)",
              "--tw-prose-pre-bg": "var(--tw-prose-invert-pre-bg)",
              "--tw-prose-pre-border": "var(--tw-prose-invert-pre-border)",
              "--tw-prose-th-borders": "var(--tw-prose-invert-th-borders)",
              "--tw-prose-td-borders": "var(--tw-prose-invert-td-borders)",
            },
          },
        },
      },
    },
    plugins: [
      require("tailwindcss-animate"),
      require("@tailwindcss/typography"),
      require("@tailwindcss/forms"),
      require("@tailwindcss/aspect-ratio"),
    ],
  };
  