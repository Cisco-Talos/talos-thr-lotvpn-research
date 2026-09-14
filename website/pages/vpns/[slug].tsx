import React, { type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { getAllVpnSlugs, getVpnBySlug } from '../../lib/vpns'
import type { VpnData } from '../../lib/vpns'
import type { VpnDetailContentProps } from '../../components/VpnDetailContent'

// Load EUI-heavy content only on the client to avoid SSR HTMLElement errors
const VpnDetailContent = dynamic<VpnDetailContentProps>(
  () => import('../../components/VpnDetailContent'),
  { ssr: false }
)

interface VpnDetailPageProps {
  vpn: VpnData
}

const VpnDetailPage: NextPage<VpnDetailPageProps> & {
  getLayout?: (page: ReactNode) => ReactNode
} = ({ vpn }) => {
  return (
    <>
      <Head>
        <title>{vpn.Name} – LOTVPNs</title>
        <meta
          name="description"
          content={`Forensic attributes and detection strategies for ${vpn.Name}`}
        />
      </Head>
      <VpnDetailContent vpn={vpn} />
    </>
  )
}

VpnDetailPage.getLayout = (page: ReactNode) => page

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllVpnSlugs()
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<VpnDetailPageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const vpn = getVpnBySlug(slug)
  if (!vpn) return { notFound: true }
  return { props: { vpn } }
}

export default VpnDetailPage
