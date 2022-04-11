# ICD-10 API (German Version)
API to search the german version of the 10th revision of the International Statistical Classification of Diseases Database. 

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/dot-base/icd-10-api)](https://github.com/dot-base/icd-10-api/releases)


## Quick Nav
1. [Production Deployment](#Production-Deployment)
1. [Considerations](#Considerations)
1. [Contributing](#Contributing)

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

## Contributing

This project is written in Typescript. For an introduction into the language and best practices see the [typescript documentation](https://www.typescriptlang.org/docs/home.html).

You will need `docker`, `git`, `jq` and `openssl`. Checkout a local copy of this repository, `cd` into it and run:
```bash
./launch-stack.sh
```
Follow the steps on the screen.

By default the server is available at http://localhost:3000.

Go and mix up some code 👩‍💻. The server will reload automatically once you save. Remember to keep an eye on the console.

