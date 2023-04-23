# Reportal

> A dashboarding- and item management tool for Github.

[![Demo](https://raw.githubusercontent.com/lukasbach/hellogh/main/src/assets/demo-medium.gif)](https://reportal.lukasbach.com)

Use for free on [reportal.lukasbach.com](https://reportal.lukasbach.com).

Reportal allows you to create custom dashboards and list views with your data from
GitHub. You can create dashboards for specific repositories, which list relevant
issues, discussions, pull requests and release information, or create a dashboard
for your user or organization, which shows information related to all your
repositories.

## How to develop

- `yarn` to install dependencies
- `yarn start` to run in dev mode
- `yarn test` to run tests
- `yarn lint` to test and fix linter errors

To publish a new version, the publish pipeline can be manually
invoked, or run `yarn publish`.


## Scaffold Templates

You can use [scaffold-cli](https://github.com/lukasbach.com/scaffold-cli) to generate new files from
templates.

```bash
# Install with
npm i -g @lukasbach/scaffold

# To create a new file from a template:
scaf template-name

# List available templates:
scaf list
```
