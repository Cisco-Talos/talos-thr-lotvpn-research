'use client'
import React, { useState, useMemo, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  EuiBadge,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiSpacer,
  EuiText,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui'
import type { Criteria } from '@elastic/eui'
import { getVpnPlatforms, businessModelColor } from '../lib/vpns'
import type { VpnData } from '../lib/vpns'

// ─── Platform badge ───────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  Windows: '#0078d4',
  macOS: '#7c5cbb',
  Linux: '#e85d04',
  Android: '#3ddc84',
  iOS: '#8e8e93',
}

function PlatformBadge({ platform }: { platform: string }) {
  const bg = PLATFORM_COLORS[platform] ?? '#666'
  return (
    <EuiBadge
      style={{
        backgroundColor: bg,
        color: platform === 'Android' ? '#000' : '#fff',
        marginRight: 4,
        marginBottom: 4,
      }}
    >
      {platform}
    </EuiBadge>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  accentColor,
}: {
  value: number
  label: string
  accentColor: string
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '24px 32px',
        borderRadius: 12,
        border: `1px solid ${accentColor}44`,
        background: 'rgba(13,19,33,0.55)',
        backdropFilter: 'blur(10px)',
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          lineHeight: 1,
          color: accentColor,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 6, fontSize: '0.85rem', color: '#8fa3be' }}>
        {label}
      </div>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HomeContentProps {
  vpns: VpnData[]
  totalWithDetection: number
  totalWithThreatActors: number
}

// ─── Main component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 20

type SortDir = 'asc' | 'desc'
type SortField = keyof VpnData | 'company' | 'businessModel'

export default function HomeContent({
  vpns,
  totalWithDetection,
  totalWithThreatActors,
}: HomeContentProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [sort, setSort] = useState<{ field: SortField; direction: SortDir }>({
    field: 'Name',
    direction: 'asc',
  })

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPageIndex(0)
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return vpns
    return vpns.filter(
      v =>
        v.Name.toLowerCase().includes(q) ||
        (v.VendorInfo?.Company ?? '').toLowerCase().includes(q) ||
        (v.VendorInfo?.Jurisdiction ?? '').toLowerCase().includes(q) ||
        (v.VendorInfo?.BusinessModel ?? '').toLowerCase().includes(q) ||
        getVpnPlatforms(v).some(p => p.toLowerCase().includes(q))
    )
  }, [vpns, search])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      let aVal = ''
      let bVal = ''
      if (sort.field === 'company') {
        aVal = a.VendorInfo?.Company ?? ''
        bVal = b.VendorInfo?.Company ?? ''
      } else if (sort.field === 'businessModel') {
        aVal = a.VendorInfo?.BusinessModel ?? ''
        bVal = b.VendorInfo?.BusinessModel ?? ''
      } else {
        aVal = String((a as unknown as Record<string, unknown>)[sort.field] ?? '')
        bVal = String((b as unknown as Record<string, unknown>)[sort.field] ?? '')
      }
      return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return copy
  }, [filtered, sort])

  const paginated = sorted.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)

  const handleTableChange = ({ page, sort: s }: Criteria<VpnData>) => {
    if (page) setPageIndex(page.index)
    if (s) setSort({ field: (s.field as SortField) ?? 'Name', direction: s.direction })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: EuiBasicTableColumn<VpnData>[] = [
    {
      field: 'Name' as keyof VpnData,
      name: 'VPN Name',
      sortable: true,
      width: '22%',
      render: (name: string, vpn: VpnData) => (
        <Link href={`/vpns/${vpn.slug}`} passHref legacyBehavior>
          <EuiLink style={{ fontWeight: 600 }}>{name}</EuiLink>
        </Link>
      ),
    },
    {
      name: 'Company',
      width: '20%',
      render: (vpn: VpnData) => (
        <EuiText size="s" color="subdued">{vpn.VendorInfo?.Company || '—'}</EuiText>
      ),
    } as EuiBasicTableColumn<VpnData>,
    {
      name: 'Platforms',
      width: '26%',
      render: (vpn: VpnData) => {
        const platforms = getVpnPlatforms(vpn)
        if (!platforms.length) return <span style={{ color: '#666' }}>—</span>
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {platforms.map(p => <PlatformBadge key={p} platform={p} />)}
          </div>
        )
      },
    } as EuiBasicTableColumn<VpnData>,
    {
      name: 'Business Model',
      width: '16%',
      render: (vpn: VpnData) => {
        const model = vpn.VendorInfo?.BusinessModel
        if (!model) return <span style={{ color: '#666' }}>—</span>
        return <EuiBadge color={businessModelColor(model)}>{model}</EuiBadge>
      },
    } as EuiBasicTableColumn<VpnData>,
    {
      name: 'Det.',
      width: '8%',
      render: (vpn: VpnData) => {
        const count = vpn.Detection?.length ?? 0
        if (!count) return <span style={{ color: '#444' }}>—</span>
        return (
          <EuiToolTip content={`${count} detection strateg${count === 1 ? 'y' : 'ies'}`}>
            <EuiBadge color="success">{count}</EuiBadge>
          </EuiToolTip>
        )
      },
    } as EuiBasicTableColumn<VpnData>,
    {
      name: 'Modified',
      width: '13%',
      render: (vpn: VpnData) => (
        <EuiText size="xs" color="subdued">{vpn.LastModified || '—'}</EuiText>
      ),
    } as EuiBasicTableColumn<VpnData>,
  ]

  return (
    <>
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid #1f2d45',
          background: '#0d1321',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e0eaf4' }}>
          🔒 LOTVPNs
        </span>
        <EuiLink
          href="https://github.com/cisco-sbg/talos-thr-lotvpn-research"
          target="_blank"
          color="subdued"
          style={{ fontSize: '0.9rem' }}
        >
          GitHub
        </EuiLink>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: 'linear-gradient(135deg, #0d1321 0%, #1a2744 50%, #0f1923 100%)',
          padding: '72px 32px 64px',
          textAlign: 'center',
          borderBottom: '1px solid #1f2d45',
        }}
      >
        <EuiTitle size="l">
          <h1 style={{ color: '#e8f4ff', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Living off the VPNs
          </h1>
        </EuiTitle>
        <EuiSpacer size="m" />
        <EuiText color="subdued" style={{ maxWidth: 620, margin: '0 auto' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
            Forensic attributes, network behaviour patterns, and threat intelligence
            for VPN applications commonly leveraged by threat actors.
          </p>
        </EuiText>
        <EuiSpacer size="xl" />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <StatCard value={vpns.length} label="VPN Profiles" accentColor="#3474d4" />
          <StatCard value={totalWithDetection} label="With Detection Rules" accentColor="#00bfa5" />
          <StatCard value={totalWithThreatActors} label="Threat Actor Links" accentColor="#ff5252" />
        </div>

        <EuiSpacer size="xl" />
        <EuiFlexGroup justifyContent="center" gutterSize="m">
          <EuiFlexItem grow={false}>
            <EuiButton
              href="https://github.com/cisco-sbg/talos-thr-lotvpn-research"
              target="_blank"
              iconType="logoGithub"
              color="text"
            >
              View on GitHub
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              href="https://github.com/cisco-sbg/talos-thr-lotvpn-research/blob/main/template.yml"
              target="_blank"
              iconType="plus"
              fill
            >
              Contribute a VPN Profile
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </header>

      {/* ── TABLE ────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px 80px' }}>
        <EuiFlexGroup alignItems="center" gutterSize="m">
          <EuiFlexItem>
            <EuiFieldSearch
              placeholder="Search by name, company, platform, or jurisdiction…"
              value={search}
              onChange={handleSearch}
              isClearable
              fullWidth
              style={{ maxWidth: 600 }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiText size="s" color="subdued">
              {filtered.length === vpns.length
                ? `${vpns.length} profiles`
                : `${filtered.length} of ${vpns.length} profiles`}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="l" />

        <EuiBasicTable<VpnData>
          items={paginated}
          columns={columns}
          rowProps={vpn => ({
            style: { cursor: 'pointer' },
            onClick: () => { router.push(`/vpns/${vpn.slug}`) },
          })}
          pagination={{
            pageIndex,
            pageSize: PAGE_SIZE,
            totalItemCount: filtered.length,
            showPerPageOptions: false,
          }}
          sorting={{ sort: { field: sort.field as keyof VpnData, direction: sort.direction } }}
          onChange={handleTableChange}
          tableLayout="auto"
          noItemsMessage={
            <EuiText color="subdued" textAlign="center"><p>No VPN profiles match your search.</p></EuiText>
          }
        />
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid #1f2d45',
          padding: '24px 32px',
          textAlign: 'center',
          background: '#0d1321',
        }}
      >
        <EuiText size="s" color="subdued">
          <p>Living off the VPNs (LOTVPNs) — Cisco Talos Threat Research</p>
        </EuiText>
      </footer>
    </>
  )
}

