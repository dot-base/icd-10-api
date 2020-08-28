# ICD 10 Rest API (German Version)
API to search the german version of the 10th revision of the International Statistical Classification of Diseases Database. 

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dot-base/icd-10-api)](https://github.com/dot-base/icd-10-api/releases)


## Quick Nav
1. [Production Deployment](#Production-Deployment)
1. [Contributing](#Contributing)

## Production Deployment
Want an ICD 10 api of your own? The easiest way is to deploy our docker container. Just follow the steps below to get started.

[![Docker Build Status](https://img.shields.io/badge/We%20love-Docker-blue?style=flat&logo=Docker)](https://github.com/orgs/dot-base/packages)


### Requirements
- [Docker Engine >= v1.13](https://www.docker.com/get-started)


### Deployment
1. [Log into the GitHub package registry for Docker](https://docs.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages).
1. Start the container with a single command
    ```
    docker run --name icd-10-api -p 3000:3000 -d docker.pkg.github.com/dot-base/icd-10-api/icd-10-api:latest
    ```
1. Done and dusted 🎉. The ICD 10 rest api is available on port 3000.


## Contributing

This project is written in Typescript. For an introduction into the language and best practices see the [typescript documentation](https://www.typescriptlang.org/docs/home.html).

### Requirements
- [Node.js >= v12](https://nodejs.org/en/)
- A local copy of this repository

### Running Locally
1. Install all dependencies
    ```
    npm install
    ```
1. Start the development server
    ```
    npm start
    ```
1. By default the server is available at http://localhost:3000.
1. Go and mix up some code 👩‍💻. The server will reload automatically once you save. Remember to keep an eye on the console.

