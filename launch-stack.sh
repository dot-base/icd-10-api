#!/usr/bin/env bash

# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

DOT_BASE_DIR_NAME=dot-base
DOT_BASE_BRANCH=feat/devenv

DEV_OVERLAY_SERVICE_NAME=icd-10-api
DOT_BASE_DIR=$(realpath ./${DOT_BASE_DIR_NAME})
DEV_OVERLAY_DIR=$(realpath .)

[[ ! -e ${DOT_BASE_DIR} ]] && {
  git clone --branch ${DOT_BASE_BRANCH} \
    git@github.com:dot-base/dot-base.git ${DOT_BASE_DIR_NAME}
  ${DOT_BASE_DIR}/dot-base.sh setup
}

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
echo "To re-build and start, run:"
echo "  docker exec -it \\"
echo "    \$(docker ps -q -f name=${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}) \\"
echo "      npm start"

echo
echo "To re-build and debug, run:"
echo "  docker exec -it \\"
echo "    \$(docker ps -q -f name=${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}) \\"
echo "      npm run debug"

echo
echo "To re-build, debug and stop on start, run:"
echo "  docker exec -it \\"
echo "    \$(docker ps -q -f name=${APP_NAME}_${DEV_OVERLAY_SERVICE_NAME}) \\"
echo "      npm run debug-brk"
