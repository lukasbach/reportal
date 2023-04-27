# ![](./src/assets/icon.svg) Reportal

> A dashboarding- and item management tool for Github.

[![Demo](https://raw.githubusercontent.com/lukasbach/hellogh/main/src/assets/demo-medium.gif)](https://reportal.lukasbach.com)

Use for free on [reportal.lukasbach.com](https://reportal.lukasbach.com).

Reportal allows you to create custom dashboards and list views with your data from
GitHub. You can create dashboards for specific repositories, which list relevant
issues, discussions, pull requests and release information, or create a dashboard
for your user or organization, which shows information related to all your
repositories.

You can create custom lists of GitHub items, and use lots of filtering- and searching
options to customize the lists to your needs. Those lists can be helpful in reporting
scenarios, but also just for keeping an overview of which issues are important to you,
or which pull requests you should review.

In the dashboard view, you can combine multiple lists alongside additional widgets
that aggregate repository information. You can create multiple dashboards, for example
one per repository, or one for each of your teams.

## One note on GitHub Projects

The list view features of Reportal are similar to the 
Projects feature of GitHub, but they do provide different features. Reportal does not
aim to replace Projects, but provide a solution to seperate use cases that what Projects
aims for. Reportal Lists allow you to define reusable search strings that provide
an overview of all items that match the search, whereas Projects are rather based on
custom setup of items. Also, Projects focuses on Issues and Pull Requests, whereas
Reportal allows you to create lists of all sorts of items, such as Discussions,
Repositories, or Repository Events.

## Supported List Views

You can create lists of

- Issues and Pull Requests
- Discussions
- Repositories
- Repository Events
- User Notifications

## Supported Dashboard Items

You can add the following items to your dashboards:

- List Views (see above)
- Value Board: shows a set of custom values, such as...
  - Total count of items in list
  - Repository created date
  - Repository last updated date
  - Repository last release creation date
  - Repository last release publish date
  - Repository Fork Count
  - Repository Open Issue Count
  - Repository Closed Issue Count
  - Repository Open PR Count
  - Repository Merged PR Count
  - Repository Closed PR Count
  - Repository Releases Count
  - Repository Stargazer CXount
  - Repository Latest Release Name
  - Download Count of NPM Package
- List of custom Links
- Stargazer Count Graph
- Open Issue Count Graph
- NPM Package Download Graph


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
