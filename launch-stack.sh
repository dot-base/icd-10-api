#!/usr/bin/env bash

# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

DOT_BASE_DIR_NAME=dot-base
DOT_BASE_BRANCH=feat/devenv

DOT_BASE_DIR=$(realpath ./${DOT_BASE_DIR_NAME})
DEV_OVERLAY_DIR=$(realpath .)

[[ ! -e ${DOT_BASE_DIR} ]] && {
  git clone --branch ${DOT_BASE_BRANCH} \
    git@github.com:dot-base/dot-base.git ${DOT_BASE_DIR_NAME}
  ${DOT_BASE_DIR}/dot-base.sh setup
}

echo "Starting dot-base stack with dev overlay for icd-10-api"

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
echo "To re-build and run the icd-10-api as part of the stack, run:"
echo "  docker exec -it \\"
echo "    \$(docker ps -q -f name=${APP_NAME}_icd-10-api) \\"
echo "      npm start"

echo
echo "To re-build and debug the icd-10-api as part of the stack, run:"
echo "  docker exec -it \\"
echo "    \$(docker ps -q -f name=${APP_NAME}_icd-10-api) \\"
echo "      npm run debug"
