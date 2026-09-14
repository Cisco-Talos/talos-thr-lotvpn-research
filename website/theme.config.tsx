import React from 'react'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
      🔒 Living off the VPNs
    </span>
  ),
  project: {
    link: 'https://github.com/cisco-sbg/talos-thr-lotvpn-research',
  },
  docsRepositoryBase:
    'https://github.com/cisco-sbg/talos-thr-lotvpn-research/blob/main',
  footer: {
    text: (
      <span>
        Living off the VPNs (LOTVPNs) — Cisco Talos Threat Research
      </span>
    ),
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Living off the VPNs" />
      <meta
        property="og:description"
        content="Forensic attributes and threat intelligence for VPN applications"
      />
    </>
  ),
  useNextSeoProps() {
    return { titleTemplate: '%s – LOTVPNs' }
  },
  primaryHue: 212,
  darkMode: true,
}

export default config

