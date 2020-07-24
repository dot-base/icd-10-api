# ICD 10 Rest API (German Version)
API to search the german version of the 10th revision of the International Statistical Classification of Diseases Database. 

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dot-base/icd-10-api)](https://github.com/dot-base/icd-10-api/releases)
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/dotbase/icd-10-api)](https://hub.docker.com/r/dotbase/icd-10-api)


## Quick Nav
1. [API Documentation](#API-Documentation)
1. [Production Deployment](#Production-Deployment)
1. [Contributing](#Contributing)


## API Documentation
You can find our [API documentation at Spotlight](https://dotbase.stoplight.io/docs/icd-10-api)!


## Production Deployment
Want an ICD 10 api of your own? The easiest way is to deploy our docker container. Just follow the steps below to get started.

[![Docker Build Status](https://img.shields.io/badge/%E2%9D%A4%EF%B8%8F-We%20love%20Docker-blue)](https://hub.docker.com/u/dotbase)


### Requirements
- [Docker Engine >= v1.13](https://www.docker.com/get-started)


### Deployment
1. Start the container with a single command
    ```
    docker run --name icd-10-api -p 3000:3000 -d dotbase/icd-10-api
    ```
1. Done and dusted 🎉. The ICD 10 rest api will be available on port 3000.
1. [optional] Add this container to your docker swarm or kubernetes config.


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

