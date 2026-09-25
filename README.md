# Living Off the VPNs (LOTVPNs)

**Living Off the VPNs (LOTVPNs)** is a community reference for VPN
applications that are commonly abused to evade network controls, bypass
content restrictions, or mask malicious activity — and the forensic
artifacts defenders can use to detect them.

VPN clients are dual-use software: legitimate privacy tools that are also
routinely "living off the land" on a system to tunnel traffic past
firewalls, proxies, and DLP controls. This project catalogs the process
names, service names, installation paths, configuration files, registry
persistence, network behavior, and other forensic indicators for each VPN
application, so defenders can build detection and hunting logic without
having to reverse-engineer each product from scratch.

This project is inspired by, and modeled after, two excellent
"Living Off the Land" projects:

- [LOLBAS](https://lolbas-project.github.io/) — Living Off the Land
  Binaries, Scripts and Libraries
- [LOLRMM](https://lolrmm.io/) — Living Off the Land Remote Monitoring &
  Management tools

Just as those projects catalog legitimate binaries and RMM tools that can
be abused by attackers, LOTT catalogs legitimate VPN applications that
can be used to evade detection, bypass network policy, or obscure the
origin/destination of traffic.

## What's in this repository

- **`vpns/`** — One YAML profile per VPN application, describing vendor
  information, forensic attributes (process names, service names,
  supporting components, installation and configuration paths, registry
  persistence, log files), network behavior (protocols, ports, encryption),
  detection guidance, and known vulnerabilities.
- **`template.yml`** — The schema/template used to create new VPN
  profiles.
- **`website/`** — A [Next.js](https://nextjs.org/) +
  [Nextra](https://nextra.site/) site that renders the VPN profiles as
  browsable documentation.

## Profile schema

Each VPN profile follows a common structure defined in
[`template.yml`](template.yml):

```yaml
Name: vpn-name
VendorInfo:
  Company: Company name
  Website: https://example.com
  Jurisdiction: Country/Region
  BusinessModel: Free/Paid/Freemium
ForensicAttributes:
  ProcessNames: [...]      # Product-specific process/package names, per platform
  ServiceNames: [...]      # Service, daemon, or launch agent names
  SupportingComponents: [...] # Generic artifacts that require additional context to attribute
  InstallationPaths: [...]
  ConfigFiles: [...]
  RegistryPersistence: [...]
  LogFiles: [...]
NetworkBehavior:
  Protocols: [...]
  Ports: [...]
  EncryptionStandards: [...]
Detection: [...]           # Behavioral, network, and forensic detection guidance
KnownVulnerabilities: [...]
References: [...]
```

### Attribution guidance

`ForensicAttributes.ProcessNames` and `ServiceNames` are reserved for
identifiers that are specific enough to a product to stand on their own as
an indicator. Generic executables, services, drivers, or files that are
shared across products (or that could plausibly belong to something else)
belong in `ForensicAttributes.SupportingComponents` instead, along with an
`Attribution` note describing what additional context (a path, code
signature, registration, argument, or related process) is required before
treating them as a reliable indicator.

## Using this data

The VPN profiles are plain YAML and are intended to be consumed directly —
for building detection rules, threat hunting queries, asset inventories, or
research into VPN application behavior. No proprietary tooling or data
source is required to read or use the profiles.

## Browsing the profiles

The documentation website renders every profile with search and filtering.
To run it locally:

```bash
cd website
npm install
npm run dev
# Visit http://localhost:3000
```

Or check it out live at https://cisco-talos.github.io/talos-thr-lotvpn-research/ 

## Contributing

Contributions are welcome — new VPN profiles, corrections to existing
forensic attributes, additional detection guidance, or updates as vendors
change their products. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT — see [LICENSE.md](LICENSE.md). Use this data however you like; just
give attribution.
