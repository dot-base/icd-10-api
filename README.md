# ICD-10 API (German Version)
API to search the german version of the 10th revision of the International Statistical Classification of Diseases Database. 

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dot-base/icd-10-api)](https://github.com/dot-base/icd-10-api/releases)


## Contents
1. [Production Deployment](#Production-Deployment)
1. [Configuration](#Configuration)
1. [Considerations](#Considerations)
1. [Setup for Local Development](#setup-for-local-development)


## Production Deployment
Want an ICD-10 api of your own? The easiest way is to deploy our docker container. Just follow the steps below to get started.

[![Docker Build Status](https://img.shields.io/badge/We%20love-Docker-blue?style=flat&logo=Docker)](https://github.com/orgs/dot-base/packages)


### Requirements
- [Docker Engine >= v1.13](https://www.docker.com/get-started)


### Deployment
1. Set environment variables to configure the container:
    ```sh
    export MAX_SEARCH_WORDS="6"
    ```
1. Start the container with a single command
    ```
    docker run --name icd-10-api -p 3000:3000 -d ghcr.io/dot-base/icd-10-api:latest
    ```
1. Done and dusted 🎉. The ICD-10 api is available on port 3000.

### Usage
Submit a GET request to `/api/icd10` using the `search` query parameter:
```
'Parkinson-Syndrom Primär' -> http://localhost:3000/api/icd10?search=Parkinson-Syndrom%20Prim%C3%A4r
```

## Configuration

### Environment Variables
| Variable Name | Default | Example |
| --- | --- | --- |
| MAX_SEARCH_WORDS | 6 | - |


## Considerations

### Pre-processing and multi-term searches
The ICD-10 api processes a search query by first splitting it into separate search terms as in the following example:

```
'Parkinson-Syndrom Primär' -> ['Parkinson', 'Syndrom', Primär]
'Parkinson G20.9 unspezifisch' -> ['Parkinson', 'G20.9', 'unspezifisch']
```

If a query consists of several terms, the ICD-10 api will assemble all combinations of these terms and order them by length:

```
'Parkinson-Syndrom Primär' -> ['Parkinson Syndrom Primär', 'Parkinson Syndrom', 'Parkinson Primär', 'Syndrom Primär', 'Parkinson', 'Syndrom', 'Primär']
```

The service will search for matches in descending order, meaning it will first search for the full term '*Parkinson Syndrom Primär*'. If no match was found, the search will proceed with '*Parkinson AND Syndrom*' '*Parkinson AND Primär*' '*Syndrom AND Primär*'. If the combination of two search terms results in one or several matches, the search will stop and return the result. Otherwise, it will proceed to search for each single term separately.
Due too performance and time-out reasons the default max. value for search terms is set to 6, but can be changed indiviually by setting `MAX_SEARCH_WORDS`.

### Prioritization of ICD-10 codes
Terms that match the ICD code pattern are handled with priority. If a query contains something like  '*Parkinson G20*' or '*Parkinson G20.9*', the service will first try to find exact matches for these ICD codes. It will only search for further results matching 'Parkinson', if no matching ICD codes were found.


## Setup for Local Development

The following steps need to be done only once. After that, you are ready to deploy a dot.base stack with very little commands for testing and development.

### Install prerequisits

You will need `bash`, `coreutils`, `docker`, `git`, `mkcert`, `openssl`, `sudo` and `watch`.

### Checkout this repository

Checkout the dot.base repository and move into it.

```bash
git clone git@github.com:dot-base/icd-10-api.git
cd icd-10-api
```

### Generate a Github personal access token

Some components of the dot.base stack are private. So you need to generate a Github personal access token for an account that has access to private dot.base repositories. The token needs the right to `write:packages/read:packages`. Go to https://github.com/settings/tokens/new?scopes=write:packages to generate it.

### Login with your access token

Use `YOUR_TOKEN` and `YOUR_GITHUB_USERNAME` to login to the container registry.

```bash
export CR_PAT=<YOUR_TOKEN>
echo $CR_PAT | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin
```

### Deploy a stack with one service overlayed for development

In order to develop a service in its complete dot.base environment, you need to deploy the complete dot.base stack and replace the service you want develop with a dev overlay (a dev container containing the toolchains required for develpment). All dot.base services contain a `launch-stack.sh`.

❗ This requires root!

```bash
./launch-stack.sh
```

### Install service dependencies

```bash
docker exec -it $(docker ps -q -f name=dotbase_icd-10-api) npm install
```

### Start this service in development mode

```bash
docker exec -it $(docker ps -q -f name=dotbase_icd-10-api) npm start
```

### Watch your dot.base stack

```bash
./dot-base/dot-base.sh watch
```

### Observe logs
```bash
./dot-base/dot-base.sh logs
```

### Stats
```bash
docker stats
```

### Use it

Just checkout the dot.base instance on `https://${APP_HOSTNAME}`, e.g. https://dotbase.local

You need to accept the security exception once in your browser as we are using a self-signed certificate.

#### Add a user

You'll want to add a user in keycloak's `dotbase` realm via the Keycloak Admin panel. `https://${APP_HOSTNAME}/auth`, e.g. https://dotbase.local/auth

Username: `admin` Password: `password`.

### Stop the stack

```bash
./dot-base/dot-base.sh stop
```

### Cleanup 

To undo initial setup, run:

❗ This requires root!
```bash
./dot-base/dot-base.sh cleanup
```

To cleanup dockers cache of images and containers run the following.

❗ **Be sure to know what you are doing. This deletes on your whole docker instance, not only on the dot.base stack! This is destructive!**

```bash
docker images prune --all
docker container prune --all
```

To cleanup dockers volumes, which will reset all databases, including dot.base FHIR data and keycloak user data, run the following.

❗ **Be sure to know what you are doing. This deletes on your whole docker instance, not only on the dot.base stack! This is destructive!**

```bash
docker volumes prune --all
```

To cleanup all of dockers data, run the following.

❗ **Be sure to know what you are doing. This deletes on your whole docker instance, not only on the dot.base stack! This is destructive!**

```bash
docker system prune --all
```
