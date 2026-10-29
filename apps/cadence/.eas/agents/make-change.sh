#!/usr/bin/env bash
set -euo pipefail

: "${ISSUE_NUMBER:?No issue number. Pass -F issue_number=<number>.}"
: "${GITHUB_TOKEN:?GITHUB_TOKEN is not set. Add it to the preview environment.}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is not set. Add it to the preview environment.}"

PROJECT_DIR=$(pwd)
REPO_ROOT=${EAS_BUILD_WORKINGDIR:-$(git rev-parse --show-toplevel)}
APP_PATH=${PROJECT_DIR#"$REPO_ROOT"/}
WORK_DIR=/tmp/agent-change
APP_DIR="$WORK_DIR/$APP_PATH"
BRANCH="agent/issue-$ISSUE_NUMBER"
GITHUB_HELPER="$PROJECT_DIR/.eas/agents/github.mjs"
PUSH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

git clone --depth 1 "$PUSH_URL" "$WORK_DIR"
git -C "$WORK_DIR" remote set-url origin "https://github.com/${GITHUB_REPOSITORY}.git"
ln -s "$REPO_ROOT/node_modules" "$WORK_DIR/node_modules"
printf 'node_modules\nagent-output/\n' >> "$WORK_DIR/.git/info/exclude"
mkdir -p "$APP_DIR/agent-output"

{
  cat .eas/agents/make-change.md
  printf '\n## Issue #%s\n\n' "$ISSUE_NUMBER"
  node "$GITHUB_HELPER" issue "$ISSUE_NUMBER"
} > "$APP_DIR/agent-output/prompt.md"

cd "$APP_DIR"
env -u EXPO_TOKEN -u EXPO_TOKEN_SIMULATOR -u GITHUB_TOKEN \
  timeout 20m bash .eas/agents/run-agent.sh agent-output/prompt.md change || true

if [ -n "$(git -C "$WORK_DIR" status --porcelain -- "$APP_PATH/.eas" .github)" ]; then
  echo "The agent changed files in .eas or .github. The job does not open a pull request." >&2
  exit 1
fi

if [ -z "$(git -C "$WORK_DIR" status --porcelain)" ]; then
  REASON=$(head -n 1 agent-output/summary.md 2> /dev/null || true)
  REASON=${REASON#No change: }
  REASON=${REASON:-The agent did not change any file.}
  printf '### 🛠️ Issue to PR\n\n> [!WARNING]\n> **No change.** %s\n\nAdd detail to the issue, then remove the `agent` label and add it again.\n' "$REASON" > /tmp/comment.md
  node "$GITHUB_HELPER" comment "$ISSUE_NUMBER" /tmp/comment.md
  exit 1
fi

TITLE=$(head -n 1 agent-output/summary.md 2> /dev/null || true)
TITLE=${TITLE:-"Change for issue #$ISSUE_NUMBER"}
{
  tail -n +2 agent-output/summary.md 2> /dev/null \
    | awk '{ if (sub(/^Not verified: /, "")) print "> [!WARNING]\n> **Not verified:** " $0; else print }' || true
  printf '\n\nCloses #%s\n\n<sub>Opened by Issue to PR from #%s. Agentic CI tests it on iOS and Android.</sub>\n' "$ISSUE_NUMBER" "$ISSUE_NUMBER"
} > /tmp/pull-request.md

AUTHOR_EMAIL=$(node "$GITHUB_HELPER" author-email)
cd "$WORK_DIR"
git checkout -b "$BRANCH"
git add -A
git -c user.name="EAS agent" -c user.email="$AUTHOR_EMAIL" commit -m "$TITLE"
git push --force "$PUSH_URL" "HEAD:refs/heads/$BRANCH"
PR_URL=$(node "$GITHUB_HELPER" open-pull-request "$BRANCH" "$TITLE" /tmp/pull-request.md)

printf '### 🛠️ Issue to PR\n\n> [!TIP]\n> **Opened #%s.** %s\n\nAgentic CI tests it on iOS and Android and posts the results on the pull request.\n' "${PR_URL##*/}" "$TITLE" > /tmp/comment.md
node "$GITHUB_HELPER" comment "$ISSUE_NUMBER" /tmp/comment.md
