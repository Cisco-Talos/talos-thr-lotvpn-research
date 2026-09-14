# Contributing

Contributions are welcome — new VPN profiles, corrections to existing
forensic attributes, additional detection guidance, or updates as vendors
change their products.

## Adding or updating a VPN profile

- Copy [`template.yml`](template.yml) to `vpns/<vpn-name>.yml` (or edit the
  existing profile) and follow the schema described in the
  [README](README.md#profile-schema).
- Keep `ForensicAttributes.ProcessNames` and `ServiceNames` limited to
  identifiers that are specific enough to a product to stand on their own.
  Generic executables, services, drivers, or files shared across products
  belong in `ForensicAttributes.SupportingComponents` instead, with an
  `Attribution` note explaining what additional context is needed (see
  [Attribution guidance](README.md#attribution-guidance)).
- Cite sources where you can — vendor documentation, installers, or your own
  host-validated observations — in `References`.
- Bump `LastModified` to the date of your change.

## Submitting a change

1. Fork the repository and create a branch for your change.
2. Confirm your YAML parses (`python -c "import yaml, sys; yaml.safe_load(open(sys.argv[1]))" vpns/<vpn-name>.yml`).
3. Open a pull request describing the profile/attribute you added or
   corrected and the source of the information.

## Reporting issues

If you spot an inaccuracy or a VPN application that's missing, please open
an issue describing the product and, if known, the forensic details that
should be added.
