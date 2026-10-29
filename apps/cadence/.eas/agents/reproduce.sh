#!/usr/bin/env bash
set -euo pipefail

: "${BUILD_ID:?No simulator build. Check the build or repack job of this run.}"
: "${ISSUE_NUMBER:?No issue number. Check the intake job, or pass -F issue_number=<number>.}"
: "${PLATFORM:?No platform. Set PLATFORM to android or ios in the reproduce job.}"

node .eas/agents/github.mjs issue "$ISSUE_NUMBER" > /tmp/issue.json
source .eas/agents/start-session.sh "$PLATFORM" "$BUILD_ID" "Issue #$ISSUE_NUMBER triage" bug-triage

{
  cat .eas/agents/reproduce.md
  printf '\n## Bug report\n\n'
  cat /tmp/issue.json
  printf '\n'
  cat agent-output/device.md
} > agent-output/prompt.md

env -u EXPO_TOKEN -u EXPO_TOKEN_SIMULATOR -u GITHUB_TOKEN \
  timeout 20m bash .eas/agents/run-agent.sh agent-output/prompt.md device || true

VERDICT=$(head -n 1 agent-output/evidence/verdict.md 2> /dev/null || true)
VERDICT=${VERDICT:-"INCONCLUSIVE: The agent did not write a verdict. See the logs of this run."}
SESSION_URL=$(node -p 'require("/tmp/session.json").deviceRunSessionUrl')

case "$PLATFORM" in
  ios) TITLE='🍏 iOS · Bug triage'; DEVICE='iOS Simulator' ;;
  *) TITLE='🤖 Android · Bug triage'; DEVICE='Android Emulator' ;;
esac
case "$VERDICT" in
  REPLICATED:*)
    ALERT=IMPORTANT RESULT=Replicated
    NEXT='read the steps, then add the `agent` label to start Issue to PR.'
    ;;
  NOT-REPLICATED:*)
    ALERT=NOTE RESULT='Not replicated'
    NEXT='add the missing steps to the issue, then run this workflow again.'
    ;;
  *)
    ALERT=WARNING RESULT=Inconclusive
    NEXT='open the report, then run this workflow again.'
    ;;
esac

{
  printf '### %s\n\n> [!%s]\n> **%s.** %s\n>\n> **Next:** %s\n\n' "$TITLE" "$ALERT" "$RESULT" "${VERDICT#*: }" "$NEXT"
  printf '**[Recording](%s)** · [Report and screenshots](%s)\n\n' "$SESSION_URL" "$RUN_URL"
  printf '<details>\n<summary>Steps the agent followed</summary>\n\n'
  tail -n +2 agent-output/evidence/verdict.md 2> /dev/null || true
  printf '\n</details>\n\n'
  printf '<sub>Claude Code agent · %s · build of the default branch · A person reviews the evidence and decides.</sub>\n' "$DEVICE"
} > /tmp/comment.md
node .eas/agents/github.mjs comment "$ISSUE_NUMBER" /tmp/comment.md
