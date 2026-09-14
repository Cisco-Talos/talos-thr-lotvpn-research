'use client'
import React, { type ReactNode } from 'react'
import Link from 'next/link'
import {
  EuiBadge,
  EuiCallOut,
  EuiCode,
  EuiCodeBlock,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiPanel,
  EuiSpacer,
  EuiTabbedContent,
  EuiText,
  EuiTitle,
} from '@elastic/eui'
import {
  getVpnPlatforms,
  businessModelColor,
  severityColor,
} from '../lib/vpns'
import type { VpnData, PlatformEntry } from '../lib/vpns'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function PlatformList({
  title,
  entries,
  valueKey = 'Name',
}: {
  title: string
  entries?: PlatformEntry[]
  valueKey?: 'Name' | 'Path' | 'Args'
}) {
  if (!entries?.length) return null
  return (
    <>
      <EuiTitle size="xxs">
        <h4 style={{ color: '#a3b8cc' }}>{title}</h4>
      </EuiTitle>
      <EuiSpacer size="s" />
      {entries.map((entry, i) => {
        const values = entry[valueKey] as string[] | undefined
        if (!values?.length) return null
        return (
          <div key={i} style={{ marginBottom: 12 }}>
            <PlatformBadge platform={entry.Platform} />
            <EuiSpacer size="xs" />
            <div style={{ paddingLeft: 8 }}>
              {values.map((v, j) => (
                <EuiCode
                  key={j}
                  style={{ display: 'block', marginBottom: 4, fontSize: '0.82rem' }}
                >
                  {v}
                </EuiCode>
              ))}
            </div>
          </div>
        )
      })}
      <EuiSpacer size="m" />
    </>
  )
}

function SupportingComponentsList({ entries }: { entries?: PlatformEntry[] }) {
  if (!entries?.length) return null
  const fields = ['Processes', 'Services', 'Drivers', 'Files'] as const
  return (
    <>
      <EuiTitle size="xxs"><h4 style={{ color: '#a3b8cc' }}>Supporting Components</h4></EuiTitle>
      <EuiSpacer size="s" />
      {entries.map((entry, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <PlatformBadge platform={entry.Platform} />
          <EuiSpacer size="xs" />
          <div style={{ paddingLeft: 8 }}>
            {fields.map(field => {
              const values = entry[field] as string[] | undefined
              if (!values?.length) return null
              return (
                <div key={field} style={{ marginBottom: 8 }}>
                  <strong style={{ color: '#8fa3be', fontSize: '0.85rem' }}>{field}</strong>
                  {values.map((value, j) => (
                    <EuiCode key={j} style={{ display: 'block', margin: '4px 0', fontSize: '0.82rem' }}>{value}</EuiCode>
                  ))}
                </div>
              )
            })}
            {entry.Attribution && (
              <p style={{ color: '#8fa3be', fontSize: '0.85rem', margin: '8px 0 0' }}>
                Attribution: {entry.Attribution}
              </p>
            )}
          </div>
        </div>
      ))}
      <EuiSpacer size="m" />
    </>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <>
      <EuiTitle size="xs">
        <h3
          style={{
            color: '#c8dff0',
            borderLeft: '3px solid #3474d4',
            paddingLeft: 10,
          }}
        >
          {children}
        </h3>
      </EuiTitle>
      <EuiSpacer size="s" />
    </>
  )
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function OverviewTab({ vpn }: { vpn: VpnData }) {
  const v = vpn.VendorInfo
  return (
    <div style={{ padding: '24px 0' }}>
      {v && (
        <EuiPanel hasBorder paddingSize="l">
          <SectionTitle>Vendor Information</SectionTitle>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {v.Company && (
                <tr>
                  <td style={{ color: '#8fa3be', paddingRight: 24, paddingBottom: 10, width: '30%' }}>Company</td>
                  <td>{v.Company}</td>
                </tr>
              )}
              {v.Website && (
                <tr>
                  <td style={{ color: '#8fa3be', paddingRight: 24, paddingBottom: 10 }}>Website</td>
                  <td><EuiLink href={v.Website} target="_blank">{v.Website}</EuiLink></td>
                </tr>
              )}
              {v.Jurisdiction && (
                <tr>
                  <td style={{ color: '#8fa3be', paddingRight: 24, paddingBottom: 10 }}>Jurisdiction</td>
                  <td>{v.Jurisdiction}</td>
                </tr>
              )}
              {v.BusinessModel && (
                <tr>
                  <td style={{ color: '#8fa3be', paddingRight: 24, paddingBottom: 10 }}>Business Model</td>
                  <td><EuiBadge color={businessModelColor(v.BusinessModel)}>{v.BusinessModel}</EuiBadge></td>
                </tr>
              )}
              {v.OpenSource !== undefined && (
                <tr>
                  <td style={{ color: '#8fa3be', paddingRight: 24, paddingBottom: 10 }}>Open Source</td>
                  <td>
                    <EuiBadge color={v.OpenSource ? 'success' : 'hollow'}>
                      {v.OpenSource ? 'Yes' : 'No'}
                    </EuiBadge>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </EuiPanel>
      )}

      <EuiSpacer size="l" />

      <EuiPanel hasBorder paddingSize="l">
        <SectionTitle>Platform Coverage</SectionTitle>
        <EuiFlexGroup gutterSize="s" wrap responsive={false}>
          {getVpnPlatforms(vpn).map(p => (
            <EuiFlexItem grow={false} key={p}><PlatformBadge platform={p} /></EuiFlexItem>
          ))}
        </EuiFlexGroup>
      </EuiPanel>

      {vpn.ThreatActors && vpn.ThreatActors.length > 0 && (
        <>
          <EuiSpacer size="l" />
          <EuiCallOut title="Threat Actor Association" color="danger" iconType="warning">
            {vpn.ThreatActors.map((ta, i) => (
              <p key={i}>
                <strong>{ta.Name}</strong>
                {ta.Reference && <>{' — '}<EuiLink href={ta.Reference} target="_blank">Reference</EuiLink></>}
              </p>
            ))}
          </EuiCallOut>
        </>
      )}

      {vpn.UseCases && vpn.UseCases.length > 0 && (
        <>
          <EuiSpacer size="l" />
          <EuiPanel hasBorder paddingSize="l">
            <SectionTitle>Use Cases</SectionTitle>
            {vpn.UseCases.map((uc, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                {uc.Title && <strong style={{ color: '#e0eaf4' }}>{uc.Title}</strong>}
                {uc.Description && <p style={{ color: '#8fa3be', margin: '4px 0 0' }}>{uc.Description}</p>}
                {uc.Date && <EuiBadge color="hollow" style={{ marginTop: 6 }}>{uc.Date}</EuiBadge>}
                {uc.Source && (
                  <> <EuiLink href={uc.Source} target="_blank" style={{ fontSize: '0.8rem' }}>Source</EuiLink></>
                )}
              </div>
            ))}
          </EuiPanel>
        </>
      )}

      {vpn.LastModified && (
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <EuiText size="xs" color="subdued">Last modified: {vpn.LastModified}</EuiText>
        </div>
      )}
    </div>
  )
}

function ForensicsTab({ vpn }: { vpn: VpnData }) {
  const fa = vpn.ForensicAttributes
  if (!fa) {
    return <EuiText color="subdued" style={{ padding: '24px 0' }}><p>No forensic attributes documented.</p></EuiText>
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <EuiPanel hasBorder paddingSize="l">
        <PlatformList title="Process Names" entries={fa.ProcessNames} valueKey="Name" />
        <PlatformList title="Service Names" entries={fa.ServiceNames} valueKey="Name" />
        <SupportingComponentsList entries={fa.SupportingComponents} />
        <PlatformList title="Installation Paths" entries={fa.InstallationPaths} valueKey="Path" />
        <PlatformList title="Configuration Files" entries={fa.ConfigFiles} valueKey="Path" />
        <PlatformList title="Log Files" entries={fa.LogFiles} valueKey="Path" />

        {fa.RegistryPersistence?.length ? (
          <>
            <EuiTitle size="xxs"><h4 style={{ color: '#a3b8cc' }}>Registry Persistence</h4></EuiTitle>
            <EuiSpacer size="s" />
            {fa.RegistryPersistence.map((r, i) => (
              <EuiCode key={i} style={{ display: 'block', marginBottom: 4, fontSize: '0.82rem' }}>{r}</EuiCode>
            ))}
            <EuiSpacer size="m" />
          </>
        ) : null}

        {fa.CommandLineArgs?.length ? (
          <>
            <EuiTitle size="xxs"><h4 style={{ color: '#a3b8cc' }}>Command Line Arguments</h4></EuiTitle>
            <EuiSpacer size="s" />
            {fa.CommandLineArgs.map((entry, i) => {
              const args = entry.Args as string[] | undefined
              if (!args?.length) return null
              return (
                <div key={i} style={{ marginBottom: 12 }}>
                  <PlatformBadge platform={entry.Platform} />
                  <EuiSpacer size="xs" />
                  <EuiCodeBlock language="bash" fontSize="s" paddingSize="s">{args.join('\n')}</EuiCodeBlock>
                </div>
              )
            })}
            <EuiSpacer size="m" />
          </>
        ) : null}

        {fa.CodeSigning?.length ? (
          <>
            <EuiTitle size="xxs"><h4 style={{ color: '#a3b8cc' }}>Code Signing</h4></EuiTitle>
            <EuiSpacer size="s" />
            {fa.CodeSigning.map((entry, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <PlatformBadge platform={entry.Platform} />
                <EuiSpacer size="xs" />
                <div style={{ paddingLeft: 8 }}>
                  {Object.entries(entry)
                    .filter(([k]) => k !== 'Platform')
                    .map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 4, fontSize: '0.85rem' }}>
                        <span style={{ color: '#8fa3be' }}>{k}: </span>
                        <EuiCode>{String(v)}</EuiCode>
                      </div>
                    ))}
                </div>
              </div>
            ))}
            <EuiSpacer size="m" />
          </>
        ) : null}

        {fa.NetworkArtifacts && (
          <>
            <EuiTitle size="xxs"><h4 style={{ color: '#a3b8cc' }}>Network Artifacts</h4></EuiTitle>
            <EuiSpacer size="s" />
            {fa.NetworkArtifacts.Domains?.length ? (
              <>
                <p style={{ color: '#8fa3be', marginBottom: 4, fontSize: '0.85rem' }}>Domains:</p>
                {fa.NetworkArtifacts.Domains.map((d, i) => (
                  <EuiCode key={i} style={{ display: 'block', marginBottom: 4, fontSize: '0.82rem' }}>{d}</EuiCode>
                ))}
                <EuiSpacer size="s" />
              </>
            ) : null}
            {fa.NetworkArtifacts.CDN?.length ? (
              <>
                <p style={{ color: '#8fa3be', marginBottom: 4, fontSize: '0.85rem' }}>CDN Providers:</p>
                {fa.NetworkArtifacts.CDN.map((c, i) => (
                  <EuiBadge key={i} color="hollow" style={{ marginRight: 4 }}>{c}</EuiBadge>
                ))}
                <EuiSpacer size="s" />
              </>
            ) : null}
            {fa.NetworkArtifacts.UserAgent?.length ? (
              <>
                <EuiSpacer size="s" />
                <p style={{ color: '#8fa3be', marginBottom: 4, fontSize: '0.85rem' }}>User Agents:</p>
                {fa.NetworkArtifacts.UserAgent.map((u, i) => (
                  <EuiCode key={i} style={{ display: 'block', marginBottom: 4, fontSize: '0.82rem' }}>{u}</EuiCode>
                ))}
              </>
            ) : null}
          </>
        )}
      </EuiPanel>
    </div>
  )
}

function NetworkTab({ vpn }: { vpn: VpnData }) {
  const nb = vpn.NetworkBehavior
  if (!nb) {
    return <EuiText color="subdued" style={{ padding: '24px 0' }}><p>No network behavior documented.</p></EuiText>
  }
  return (
    <div style={{ padding: '24px 0' }}>
      <EuiPanel hasBorder paddingSize="l">
        {nb.Protocols?.length ? (
          <>
            <SectionTitle>Protocols</SectionTitle>
            {nb.Protocols.map((p, i) => (
              <EuiBadge key={i} color="primary" style={{ marginRight: 6, marginBottom: 6 }}>{p}</EuiBadge>
            ))}
            <EuiSpacer size="m" />
          </>
        ) : null}

        {nb.Ports?.length ? (
          <>
            <SectionTitle>Ports</SectionTitle>
            {nb.Ports.map((p, i) => (
              <EuiCode key={i} style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>{p}</EuiCode>
            ))}
            <EuiSpacer size="m" />
          </>
        ) : null}

        {nb.EncryptionStandards?.length ? (
          <>
            <SectionTitle>Encryption Standards</SectionTitle>
            {nb.EncryptionStandards.map((e, i) => (
              <EuiBadge key={i} color="accent" style={{ marginRight: 6, marginBottom: 6 }}>{e}</EuiBadge>
            ))}
            <EuiSpacer size="m" />
          </>
        ) : null}

        {nb.TunnelInterfaces?.length ? (
          <>
            <SectionTitle>Tunnel Interfaces</SectionTitle>
            {nb.TunnelInterfaces.map((t, i) => (
              <EuiCode key={i} style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>{t}</EuiCode>
            ))}
            <EuiSpacer size="m" />
          </>
        ) : null}

        {nb.NetworkExtensions?.length ? (
          <>
            <SectionTitle>Network Extensions</SectionTitle>
            {nb.NetworkExtensions.map((e, i) => (
              <EuiCode key={i} style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>{e}</EuiCode>
            ))}
          </>
        ) : null}
      </EuiPanel>
    </div>
  )
}

function DetectionTab({ vpn }: { vpn: VpnData }) {
  const detections = vpn.Detection
  if (!detections?.length) {
    return <EuiText color="subdued" style={{ padding: '24px 0' }}><p>No detection strategies documented yet.</p></EuiText>
  }

  const iconForType = (type?: string) => {
    switch ((type ?? '').toLowerCase()) {
      case 'behavioral': return 'eye'
      case 'network': return 'globe'
      case 'forensic': return 'folderExclamation'
      default: return 'alert'
    }
  }

  const colorForType = (type?: string): 'success' | 'warning' | 'primary' | 'danger' => {
    switch ((type ?? '').toLowerCase()) {
      case 'behavioral': return 'success'
      case 'network': return 'primary'
      case 'forensic': return 'warning'
      default: return 'danger'
    }
  }

  return (
    <div style={{ padding: '24px 0' }}>
      {detections.map((d, i) => (
        <React.Fragment key={i}>
          <EuiCallOut
            title={
              <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem grow={false}>
                  <EuiBadge color={colorForType(d.Type)}>{d.Type ?? 'Unknown'}</EuiBadge>
                </EuiFlexItem>
                <EuiFlexItem><span>{d.Description}</span></EuiFlexItem>
              </EuiFlexGroup>
            }
            color={colorForType(d.Type)}
            iconType={iconForType(d.Type)}
          >
            {d.Indicators?.length ? (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {d.Indicators.map((ind, j) => (
                  <li key={j} style={{ marginBottom: 4, fontSize: '0.9rem' }}>{ind}</li>
                ))}
              </ul>
            ) : null}
          </EuiCallOut>
          {i < detections.length - 1 && <EuiSpacer size="m" />}
        </React.Fragment>
      ))}

      {vpn.KnownVulnerabilities?.length ? (
        <>
          <EuiSpacer size="xl" />
          <SectionTitle>Known Vulnerabilities</SectionTitle>
          {vpn.KnownVulnerabilities.map((vuln, i) => (
            <EuiPanel key={i} hasBorder paddingSize="m" style={{ marginBottom: 12 }}>
              <EuiFlexGroup alignItems="center" gutterSize="m" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiBadge color={severityColor(vuln.Severity)}>{vuln.Severity ?? 'Unknown'}</EuiBadge>
                </EuiFlexItem>
                <EuiFlexItem>
                  <strong style={{ color: '#e0eaf4' }}>{vuln.CVE}</strong>
                </EuiFlexItem>
                {vuln.Patched !== undefined && (
                  <EuiFlexItem grow={false}>
                    <EuiBadge color={vuln.Patched ? 'success' : 'danger'}>
                      {vuln.Patched ? 'Patched' : 'Unpatched'}
                    </EuiBadge>
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
              {vuln.Description && (
                <EuiText size="s" color="subdued" style={{ marginTop: 8 }}>
                  <p>{vuln.Description}</p>
                </EuiText>
              )}
              {vuln.Reference && (
                <EuiLink href={vuln.Reference} target="_blank" style={{ fontSize: '0.8rem' }}>
                  Reference →
                </EuiLink>
              )}
            </EuiPanel>
          ))}
        </>
      ) : null}
    </div>
  )
}

function ReferencesTab({ vpn }: { vpn: VpnData }) {
  const refs = vpn.References
  if (!refs) {
    return <EuiText color="subdued" style={{ padding: '24px 0' }}><p>No references documented.</p></EuiText>
  }

  function RefList({ title, urls }: { title: string; urls?: string[] }) {
    if (!urls?.length) return null
    return (
      <>
        <SectionTitle>{title}</SectionTitle>
        <ul style={{ margin: 0, paddingLeft: 20, marginBottom: 24 }}>
          {urls.map((url, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              <EuiLink href={url} target="_blank" style={{ fontSize: '0.9rem' }}>{url}</EuiLink>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <EuiPanel hasBorder paddingSize="l">
        <RefList title="Official" urls={refs.Official} />
        <RefList title="Threat Intelligence" urls={refs.ThreatIntelligence} />
        <RefList title="Research" urls={refs.Research} />
        <RefList title="Sigma Rules" urls={refs.Sigma} />
      </EuiPanel>
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export interface VpnDetailContentProps {
  vpn: VpnData
}

export default function VpnDetailContent({ vpn }: VpnDetailContentProps) {
  const platforms = getVpnPlatforms(vpn)

  const tabs = [
    { id: 'overview',   name: 'Overview',                         content: <OverviewTab vpn={vpn} /> },
    { id: 'forensics',  name: 'Forensics',                        content: <ForensicsTab vpn={vpn} /> },
    { id: 'network',    name: 'Network',                          content: <NetworkTab vpn={vpn} /> },
    { id: 'detection',  name: `Detection${vpn.Detection?.length ? ` (${vpn.Detection.length})` : ''}`, content: <DetectionTab vpn={vpn} /> },
    { id: 'references', name: 'References',                       content: <ReferencesTab vpn={vpn} /> },
  ]

  return (
    <>
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid #1f2d45',
          background: '#0d1321',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 16,
        }}
      >
        <Link href="/" passHref legacyBehavior>
          <EuiLink color="subdued" style={{ fontSize: '0.9rem' }}>← All VPNs</EuiLink>
        </Link>
        <span style={{ color: '#3474d4' }}>/</span>
        <span style={{ color: '#c8dff0', fontWeight: 600, fontSize: '0.9rem' }}>{vpn.Name}</span>
      </nav>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header
        style={{
          background: 'linear-gradient(135deg, #0d1321 0%, #1a2744 60%, #0f1923 100%)',
          padding: '48px 32px 40px',
          borderBottom: '1px solid #1f2d45',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <EuiTitle size="l">
            <h1 style={{ color: '#e8f4ff', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {vpn.Name}
            </h1>
          </EuiTitle>
          {vpn.VendorInfo?.Company && (
            <EuiText color="subdued" style={{ marginTop: 4 }}>
              <p>{vpn.VendorInfo.Company}</p>
            </EuiText>
          )}

          <EuiSpacer size="m" />

          <EuiFlexGroup gutterSize="s" wrap responsive={false}>
            {vpn.VendorInfo?.BusinessModel && (
              <EuiFlexItem grow={false}>
                <EuiBadge color={businessModelColor(vpn.VendorInfo.BusinessModel)}>
                  {vpn.VendorInfo.BusinessModel}
                </EuiBadge>
              </EuiFlexItem>
            )}
            {vpn.VendorInfo?.Jurisdiction && (
              <EuiFlexItem grow={false}>
                <EuiBadge color="hollow">📍 {vpn.VendorInfo.Jurisdiction}</EuiBadge>
              </EuiFlexItem>
            )}
            {platforms.map(p => (
              <EuiFlexItem grow={false} key={p}>
                <EuiBadge
                  style={{
                    backgroundColor: PLATFORM_COLORS[p] ?? '#666',
                    color: p === 'Android' ? '#000' : '#fff',
                  }}
                >
                  {p}
                </EuiBadge>
              </EuiFlexItem>
            ))}
            {vpn.ThreatActors && vpn.ThreatActors.length > 0 && (
              <EuiFlexItem grow={false}>
                <EuiBadge color="danger" iconType="warning">Threat Actor Linked</EuiBadge>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </div>
      </header>

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '0 32px 80px' }}>
        <EuiSpacer size="l" />
        <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} autoFocus="initial" />
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
