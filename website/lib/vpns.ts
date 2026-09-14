import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlatformEntry {
  Platform: string
  Name?: string[]
  Path?: string[]
  Args?: string[]
  Processes?: string[]
  Services?: string[]
  Drivers?: string[]
  Files?: string[]
  Attribution?: string
  Publisher?: string
  Thumbprint?: string
  TeamID?: string
  BundleID?: string
  CertificateAuthority?: string
  HelperToolBundleID?: string
  [key: string]: unknown
}

export interface NetworkArtifacts {
  Domains?: string[]
  IPs?: string[]
  UserAgent?: string[]
  CDN?: string[]
}

export interface ForensicAttributes {
  ProcessNames?: PlatformEntry[]
  ServiceNames?: PlatformEntry[]
  SupportingComponents?: PlatformEntry[]
  InstallationPaths?: PlatformEntry[]
  ConfigFiles?: PlatformEntry[]
  RegistryPersistence?: string[]
  LogFiles?: PlatformEntry[]
  BrowserExtensions?: unknown[]
  CodeSigning?: PlatformEntry[]
  CommandLineArgs?: PlatformEntry[]
  NetworkArtifacts?: NetworkArtifacts
}

export interface NetworkBehavior {
  Protocols?: string[]
  Ports?: string[]
  TLSFingerprint?: string[]
  EncryptionStandards?: string[]
  NetworkExtensions?: string[]
  TunnelInterfaces?: string[]
  ProtocolExtensions?: string[]
}

export interface ThreatActor {
  Name?: string
  Reference?: string
}

export interface UseCase {
  Title?: string
  Description?: string
  Date?: string
  Source?: string
}

export interface KnownVulnerability {
  CVE?: string
  Severity?: string
  Description?: string
  Patched?: boolean | string
  Reference?: string
}

export interface DetectionEntry {
  Type?: string
  Description?: string
  Indicators?: string[]
}

export interface VpnData {
  Name: string
  slug: string
  VendorInfo?: {
    Company?: string
    Website?: string
    Jurisdiction?: string
    BusinessModel?: string
    OpenSource?: boolean
  }
  ForensicAttributes?: ForensicAttributes
  NetworkBehavior?: NetworkBehavior
  ThreatActors?: ThreatActor[]
  UseCases?: UseCase[]
  KnownVulnerabilities?: KnownVulnerability[]
  Detection?: DetectionEntry[]
  References?: {
    Official?: string[]
    ThreatIntelligence?: string[]
    Research?: string[]
    Sigma?: string[]
  }
  LastModified?: string
  ThirdPartyIntegrations?: unknown
  ApplicationVersion?: unknown
  Localization?: unknown
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VPN_DIR = path.join(process.cwd(), '..', 'vpns')

/** Recursively convert Date objects to ISO date strings for JSON serialization. */
function sanitize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (value instanceof Date) return value.toISOString().split('T')[0]
    return value
  })) as T
}

export function getAllVpns(): VpnData[] {
  const files = fs.readdirSync(VPN_DIR).filter(f => f.endsWith('.yml'))
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(VPN_DIR, file), 'utf8')
      const data = yaml.load(raw) as Partial<VpnData>
      return sanitize({ ...data, slug: file.replace('.yml', '') } as VpnData)
    })
    .sort((a, b) => a.Name.localeCompare(b.Name))
}

export function getAllVpnSlugs(): string[] {
  return fs
    .readdirSync(VPN_DIR)
    .filter(f => f.endsWith('.yml'))
    .map(f => f.replace('.yml', ''))
}

export function getVpnBySlug(slug: string): VpnData | null {
  const filePath = path.join(VPN_DIR, `${slug}.yml`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = yaml.load(raw) as Partial<VpnData>
  return sanitize({ ...data, slug } as VpnData)
}

/** Return the unique set of platforms present in a VPN's process names. */
export function getVpnPlatforms(vpn: VpnData): string[] {
  const seen = new Set<string>()
  vpn.ForensicAttributes?.ProcessNames?.forEach(p => seen.add(p.Platform))
  return Array.from(seen)
}

/** Severity → EUI colour mapping */
export function severityColor(
  severity?: string
): 'danger' | 'warning' | 'primary' | 'default' {
  switch ((severity ?? '').toLowerCase()) {
    case 'critical':
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    case 'low':
      return 'primary'
    default:
      return 'default'
  }
}

/** BusinessModel → EUI colour mapping */
export function businessModelColor(
  model?: string
): 'success' | 'primary' | 'warning' | 'default' {
  switch ((model ?? '').toLowerCase()) {
    case 'free':
      return 'success'
    case 'paid':
      return 'primary'
    case 'freemium':
    case 'freemium/paid':
      return 'warning'
    default:
      return 'default'
  }
}
