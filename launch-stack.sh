#!/usr/bin/env bash

# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

DOT_BASE_DIR_NAME=dot-base
DEV_OVERLAY_SERVICE_NAME=icd-10-api

export DOT_BASE_DIR=$(realpath ./${DOT_BASE_DIR_NAME})
export DEV_OVERLAY_DIR=$(realpath .)
export USERID=${UID}

[[ ! -e ${DOT_BASE_DIR} ]] && {
  if ! git clone git@github.com:dot-base/deployments.git ${DOT_BASE_DIR_NAME} ; then
    echo
    echo "ERROR: Git clone via SSH failed. Are you behind a proxy?"
    echo "Trying https, please login with a Github Access Token."
    echo "https://github.com/settings/tokens/new?scopes=repo"
    echo
    git clone https://github.com/dot-base/deployments.git ${DOT_BASE_DIR_NAME}
  fi
}

echo "Starting dot-base stack with dev overlay for ${DEV_OVERLAY_SERVICE_NAME}"

${DOT_BASE_DIR}/dot-base.sh dev ${DEV_OVERLAY_DIR}/dev-overlay.yml

source ${DOT_BASE_DIR}/parameters.env

echo
echo "To stop the stack, run:"
echo "  ${DOT_BASE_DIR_NAME}/dot-base.sh stop"

echo
echo "To install node_modules, run:"
echo "  docker exec -it \$(docker ps -q -f name=${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}) \\"
echo "      npm install"

echo
echo "To re-build, start and debug, run:"
echo "  docker exec -it \$(docker ps -q -f name=${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}) \\"
echo "      npm start"

echo
echo "To re-build, debug and stop on start, run:"
echo "  docker exec -it \$(docker ps -q -f name=${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}) \\"
echo "      npm run debug-brk"

echo
echo "To get an interactive shell, run:"
echo "  docker exec -it \$(docker ps -q -f name=${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}) sh"

echo
echo "You can access the service directly via http://127.0.0.1:3000."
echo "Connect your debug adapter to 127.0.0.1:9229."
