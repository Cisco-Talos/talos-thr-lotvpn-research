# LOTVPNs Website

A modern web interface for the Living off the VPNs (LOTVPNs) research dataset, built with [Next.js](https://nextjs.org/), [Nextra](https://nextra.site/), and [Elastic UI (EUI)](https://eui.elastic.co/).

Inspired by the design of [lolrmm.io](https://lolrmm.io/).

## Features

- **Searchable table** of all VPN profiles on the homepage
- **Detailed VPN pages** with tabbed sections for Forensics, Network, Detection, and References
- **EUI dark theme** for comfortable reading
- **Statically generated** — reads directly from the `vpns/*.yml` data files at build time
- **Fast** — all 29 VPN pages are pre-rendered as static HTML

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) + [Nextra 2](https://nextra.site/) |
| UI Components | [@elastic/eui](https://eui.elastic.co/) |
| Data Source | `../vpns/*.yml` YAML files |
| Language | TypeScript |

## Getting Started

```bash
# Install dependencies (from inside the website/ directory)
npm install

# Start the development server
npm run dev
# → http://localhost:3000

# Build for production
npm run build
npm start
```

## Directory Structure

```
website/
├── pages/
│   ├── index.tsx          # Homepage — hero + searchable VPN table
│   └── vpns/
│       └── [slug].tsx     # VPN detail page (tabs: Overview, Forensics, Network, Detection, References)
├── components/
│   ├── HomeContent.tsx    # EUI-heavy homepage content (dynamically imported)
│   └── VpnDetailContent.tsx  # EUI-heavy VPN detail content (dynamically imported)
├── lib/
│   └── vpns.ts            # Server-side YAML data loader & TypeScript types
├── styles/
│   └── globals.css        # Global overrides
├── next.config.js         # Next.js + Nextra config
└── theme.config.tsx       # Nextra docs theme config
```

## Adding a VPN Profile

VPN data lives in `../vpns/*.yml` relative to this directory. Add a new YAML file following the schema in `../template.yml`, then rebuild the site:

```bash
npm run build
```

The new VPN will automatically appear in the table and get its own detail page.

## Notes

- `@elastic/eui` components are loaded client-side only (via `next/dynamic` with `ssr: false`) to avoid Node.js SSR compatibility issues
- YAML `Date` values are serialized to ISO date strings during `getStaticProps`
- Install with `npm install` (uses `--legacy-peer-deps` via `.npmrc` to satisfy EUI's TypeScript peer dependency)

