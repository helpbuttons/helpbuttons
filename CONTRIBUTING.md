## Contributing

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.
Use the table of contents icon (TOC) on the top left corner of the this document to get to a specific section of this guide quickly.

## New contributor guide

To get an overview of the project, read the [README](README.md). Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)


### Issues

#### Create a new issue

If you spot a problem with the help buttons backend, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue.

## Contributing with a Pull Request

If you would like to contribute to helpbuttons, we recommend that either you pick an issue in the github helpbuttons repository, or create a new issue, so that we can agree into adding this new feature or bugfix into the main code of helpbuttons. We recommend that you take a look at the issues labeled with [good first issue](https://github.com/helpbuttons/helpbuttons/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

After picking up your issue, you should known that we use git flow. So you should do a branch from the `dev`, and when you feel your code is ready push your branch and open a pull request to the `dev` branch.

The instance of helpbuttons runnning in https://dev.helpbuttons.org is up to date with the latest changes in the `dev` branch, the changes are automatically pulled.

## Requirements (recommended)
 - Docker >= 24.0.7
 - docker-compose >= 2.23.3
 - node >= v20.11.0
 - yarn >= 1.22.21 

## Setup for development

1. Change to the dev branch

`$ git checkout dev`

2. copy the sample env file

`$ cp env.sample .env`

3. Choose one of the next two options:

+ <details>
    <summary>To develop frontend code (api + db will run in docker)</summary>

    >
    >1. Edit .env accordingly.
    >
    > - set `hostName` to `localhost`
    >
    > - set `VERSION` to `dev`
    >
    > - set `API_URL` to `http://localhost:3001/`
    >
    >2. Generate jwt token:
    >
    >`$ docker-compose run api yarn config:genjwt`
    >
    >3. Add the generated string as a `jwtSecret` to the `.env`
    >
    >4. Edit the `docker-compose.yml`, so that the frontend has access to the api, by binding the port 3001
    >
    >```
    > ports: 
    >  - 3001:3001
    >```
    >
    >and make sure api is in the external_network network by uncomenting the line on the networks of the api
    >
    >` - external_network`
    >
    >5. Run api and database:
    >
    >`$ docker-compose up api`
    >
    >6. Run all the migrations / setup the database schema:
    >
    >`$ docker-compose exec api yarn migration:run`
    >
</details>

+ <details>
    <summary>To develop backend code (modified postgis version will be run using docker)</summary>

    >
    >_We recommend that you use our pre-build docker image for postgres, because we added goodies like the [h3](https://github.com/uber/h3) library and gis._
    >
    >3. Edit .env accordingly.
    > set `POSTGRES_HOSTNAME` to `localhost`.
    >
    > set `hostName` to `localhost`
    >
    > set `VERSION` to `dev`
    >
    > set `API_URL` to `http://localhost:3001/`
    >
    >4. You want to be able to access 5432 port on your localhost machine because database still running on docker, so you have to expose it by editing the `docker-compose.yml` file.
    >
    >```
    > ports: 
    >  - 5432:5432
    >```
    >
    >and make sure api is in the external_network network by uncomenting the line on the networks of the db
    >
    >` - external_network`
    >
    >5. Run the database
    >
    >`$ docker-compose up db`
    >
    >6. To run the api in watch mode you need firstly to go into the api directory
    >
    >`$ cd api`
    >
    >7. Create the uploads directory and give the correct permissions
    >
    >`$ mkdir uploads`
    >
    >`$ chmod o+w uploads`
    >
    >8. Install all node_modules packages
    >
    >`$ yarn`
    >
    >9. Generate jwt token:
    >
    >`$ yarn config:genjwt`
    >
    >10. Add the generated string as a `jwtSecret` to the `.env` file
    >
    >11. Create a symlink or copy the .env file to the api directory
    >
    >`$ ln -s ../.env .` or `$ cp ../.env .`
    >
    >12. Run in watch/development mode
    >
    >`$ yarn dev`
    >
    >13. Run all the migrations / setup the database schema:
    >
    >`$ yarn migration:run`
</details>

4. To run the ui in development mode, enter the frontend source folder

`$ cd web`

5. Create a symlink or copy the .env file to the api directory

`$ ln -s ../.env .` or `$ cp ../.env .`

6. Install all node_modules packages

`$ yarn`

7. Run the app in watch mode

`$ yarn dev`

8. You can now browse to `http://localhost:3000` to configure helpbuttons!

### Troubleshooting

If you find this error with yarn dev in web directory

`Error: error:0308010C:digital envelope routines:: unsupported`

try this command and retry:

`export NODE_OPTIONS=--openssl-legacy-provider`

## Key Elements, Components and Layouts

To see a preview of all the styled key pieces that conform the app, open http://localhost:3000/RepositoryPage.

For available icons visit :

https://react-icons.github.io/react-icons/icons?name=bs

## Complete Documentation

Please load and read complete documentation
[hb-docs](https://github.com/helpbuttons/hb-docs)


## guide to add a new attribute in a network

go to api/src/modules/network

add the new attr to 
 - network.entity.ts (this is to define in the db)
 - network.dto.ts (this is for the post request to validate)

run `$ yarn migration:generate src/data/migrations/name`

run `$ yarn migration:run`

in the frontend:
web/src/pages/Configuration/index.tsx

add the attr to the submit field
