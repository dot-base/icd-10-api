# ICD 10 Rest API (German Version)
API to search the german version of the 10th revision of the International Statistical Classification of Diseases Database. 

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dot-base/icd-10-api)](https://github.com/dot-base/icd-10-api/releases)


## Production Deployment
Want an ICD 10 api of your own? The easiest way is to deploy our docker container. Just follow the steps below to get started.

[![Docker Build Status](https://img.shields.io/badge/We%20love-Docker-blue?style=flat&logo=Docker)](https://github.com/orgs/dot-base/packages)


### Requirements
- [Docker Engine >= v1.13](https://www.docker.com/get-started)


### Deployment
1. Start the container with a single command
    ```
    docker run --name icd-10-api -p 3000:3000 -d ghcr.io/dot-base/icd-10-api:latest
    ```
1. Done and dusted 🎉. The ICD 10 rest api is available on port 3000.


## Development

This project is written in Typescript. For an introduction into the language and best practices see the [typescript documentation](https://www.typescriptlang.org/docs/home.html).

### Requirements
You will need `docker`, `git`, `jq` and `openssl`. Checkout a local copy of this repository, `cd` into it and run:
```bash
./launch-stack.sh
```
Follow the steps on the screen.

By default the server is available at http://localhost:3000.

Go and mix up some code 👩‍💻. The server will reload automatically once you save. Remember to keep an eye on the console.

