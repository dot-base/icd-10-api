#!/usr/bin/env bash

# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

DOT_BASE_DIR_NAME=dot-base

DEV_OVERLAY_SERVICE_NAME=icd-10-api
DOT_BASE_DIR=$(realpath ./${DOT_BASE_DIR_NAME})
DEV_OVERLAY_DIR=$(realpath .)

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

${DOT_BASE_DIR}/dot-base.sh setup

echo "Starting dot-base stack with dev overlay for ${DEV_OVERLAY_SERVICE_NAME}"

source ${DOT_BASE_DIR}/parameters.env

export DOT_BASE_DIR
export DEV_OVERLAY_DIR

export USERID=${UID}

docker stack deploy \
  --with-registry-auth=true \
  --compose-file=${DOT_BASE_DIR}/stack.yml \
  --compose-file=${DOT_BASE_DIR}/stack-standalone.yml \
  --compose-file=${DEV_OVERLAY_DIR}/dev-overlay.yml \
  $APP_NAME

echo
echo "To offload the local swarm manager and migrate most services to external workers run:"
echo "  ${DOT_BASE_DIR_NAME}/dot-base.sh offloadExcept ${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}"

echo
echo "To migrate all services to the local swarm manager run:"
echo "  ${DOT_BASE_DIR_NAME}/dot-base.sh runOnManager"

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
