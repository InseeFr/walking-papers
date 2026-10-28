# Orchestrateur de saisie papier

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.12](https://github.com/InseeFr/walking-papers/releases/tag/1.0.12) - 2026-10-26

### Fixed

- bump nginx to 1.31.8-alpine
- dependencies: fix cves

## [1.0.11](https://github.com/InseeFr/walking-papers/releases/tag/1.0.11) - 2026-10-07

### Fixed

- bump nginx to 1.31.6-alpine

## [1.0.10](https://github.com/InseeFr/walking-papers/releases/tag/1.0.10) - 2026-10-06

### Changed

- bump pnpm to 11.28.4

## [1.0.9](https://github.com/InseeFr/walking-papers/releases/tag/1.0.9) - 2026-10-06

### Changed

- ci: migrate Renovate config

## [1.0.8](https://github.com/InseeFr/walking-papers/releases/tag/1.0.8) - 2026-09-11

### Changed

- change the CI due to migration on Gitlab.

### Fixed

- bump nginx to 1.31.5-alpine
- dependencies: fix cves

## [1.0.7](https://github.com/InseeFr/walking-papers/releases/tag/1.0.7) - 2026-09-02

- dependencies: fix cves

## [1.0.6](https://github.com/InseeFr/walking-papers/releases/tag/1.0.6) - 2026-08-24

- bump nginx to 1.31.4-alpine
- dependencies:
  - devs: fix cves

## [1.0.5](https://github.com/InseeFr/walking-papers/releases/tag/1.0.5) - 2026-08-06

### Changed

- bump nginx to 1.31.3-alpine
- dependencies:
  - ci: upgrade to latest
  - devs: fix cves

## [1.0.4](https://github.com/InseeFr/walking-papers/releases/tag/1.0.4) - 2026-07-31

### Added

- Add a button to leave the questionnaire and go back to the base app

### Changed

- Authentication:
  - retrive scopes for jwt token
  - new env variable: `VITE_OIDC_SCOPES` (default value `"profile,roles"`)

## [1.0.2](https://github.com/InseeFr/walking-papers/releases/tag/1.0.2) - 2026-03-03

### Added

- Lunatic to **3.12.1**

### Fixed

- upgrade base docker image

## [1.0.1](https://github.com/InseeFr/walking-papers/releases/tag/1.0.1) - 2026-01-19

### Fixed

- Welcome modal is now displayed correctly.

## [1.0.0](https://github.com/InseeFr/walking-papers/releases/tag/1.0.0) - 2026-01-16

### Added

- Fill questionnaire and send data to server
- Oidc authentication with extras params (kc_idp_hint)

## [0.1.0](https://github.com/InseeFr/walking-papers/releases/tag/0.1.0) - 2025-11-05

### Added

- Initialized project
- Test out the application with an arbitrary Lunatic source
- Visualize empty questionnaire
- Download inputted data as JSON file
