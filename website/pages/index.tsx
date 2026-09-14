import React, { type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { getAllVpns } from '../lib/vpns'
import type { HomeContentProps } from '../components/HomeContent'

// Load EUI-heavy content only on the client to avoid SSR HTMLElement errors
const HomeContent = dynamic<HomeContentProps>(
  () => import('../components/HomeContent'),
  { ssr: false }
)

// ─── Types ────────────────────────────────────────────────────────────────────

type HomePageProps = HomeContentProps

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomePage: NextPage<HomePageProps> & {
  getLayout?: (page: ReactNode) => ReactNode
} = (props) => {
  return (
    <>
      <Head>
        <title>Living off the VPNs (LOTVPNs)</title>
        <meta
          name="description"
          content="Forensic attributes and threat intelligence for VPN applications"
        />
      </Head>
      <HomeContent {...props} />
    </>
  )
}

HomePage.getLayout = (page: ReactNode) => page

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const vpns = getAllVpns()
  return {
    props: {
      vpns,
      totalWithDetection: vpns.filter(v => (v.Detection?.length ?? 0) > 0).length,
      totalWithThreatActors: vpns.filter(
        v => Array.isArray(v.ThreatActors) && v.ThreatActors.length > 0
      ).length,
    },
  }
}

export default HomePage

