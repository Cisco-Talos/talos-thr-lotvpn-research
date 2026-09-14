#!/usr/bin/env python3
"""
Reformat all YAML files to use consistent sequential indentation.

This script reformats YAML files so that list items are indented from their parent keys.
"""

from pathlib import Path
import yaml


class IndentDumper(yaml.SafeDumper):
    """Custom YAML dumper with proper sequential indentation."""

    def increase_indent(self, flow=False, indentless=False):
        return super(IndentDumper, self).increase_indent(flow, False)


def reformat_yaml_file(file_path):
    """Reformat a single YAML file with consistent indentation."""
    print(f"Reformatting: {file_path.name}")

    # Load the YAML file
    with open(file_path, 'r') as f:
        data = yaml.safe_load(f)

    # Save back with proper indentation
    with open(file_path, 'w') as f:
        yaml.dump(data, f, Dumper=IndentDumper, default_flow_style=False,
                  sort_keys=False, allow_unicode=True, indent=2)

    print(f"  ✓ Reformatted")


def main():
    """Main function to reformat all VPN and template YAML files."""
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent

    vpns_dir = repo_root / 'vpns'
    template_file = repo_root / 'template.yml'

    # Get all VPN files
    yaml_files = []

    if vpns_dir.exists():
        yaml_files.extend(sorted(vpns_dir.glob('*.yml')))

    if template_file.exists():
        yaml_files.append(template_file)

    if not yaml_files:
        print("ERROR: No YAML files found to reformat")
        return 1

    print(f"Found {len(yaml_files)} YAML files to reformat")
    print()

    # Process each file
    for yaml_file in yaml_files:
        try:
            reformat_yaml_file(yaml_file)
        except Exception as e:
            print(f"  ✗ ERROR reformatting {yaml_file.name}: {e}")

    print()
    print(f"✓ Reformatting complete!")

    return 0


if __name__ == "__main__":
    exit(main())
