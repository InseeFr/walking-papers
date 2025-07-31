# Orchestrateur de saisie papier

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_walking-papers&metric=alert_status)](https://sonarcloud.io/dashboard?id=InseeFr_walking-papers)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_walking-papers&metric=security_rating)](https://sonarcloud.io/dashboard?id=InseeFr_walking-papers)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_walking-papers&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=InseeFr_walking-papers)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=InseeFr_walking-papers&metric=coverage)](https://sonarcloud.io/dashboard?id=InseeFr_walking-papers)

This orchestrator is based on [Lunatic](https://github.com/InseeFr/Lunatic).

It is used to manually input data in Lunatic surveys, without any control or filter, to input respondent's answers as it is.

To use it, run `pnpm && pnpm start`.

You can change the `source.json` in `src/` to manually change the questionnaire. (Note: this is an alpha, it will be possible to import your source dynamically in a future version.)
