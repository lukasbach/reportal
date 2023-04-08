# helloGH


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