#!/usr/bin/env bash

case "$1" in
  android) APP_ID=$(node -p 'require("./app.json").expo.android.package') ;;
  ios) APP_ID=$(node -p 'require("./app.json").expo.ios.bundleIdentifier') ;;
  *)
    echo "Unknown platform \"$1\". Use android or ios." >&2
    exit 1
    ;;
esac
mkdir -p agent-output/evidence

export EXPO_TOKEN="$EXPO_TOKEN_SIMULATOR"
npx --yes eas-cli@latest simulator:start --platform "$1" --type agent-device \
  --build-id "$2" --name "$3" --tag "$4" \
  --max-duration-minutes 30 --json > /tmp/session.json
trap 'npx --yes eas-cli@latest simulator:stop --non-interactive > /dev/null 2>&1 || true' EXIT

npx --yes eas-cli@latest simulator:exec npx --yes agent-device@latest open "$APP_ID" --platform "$1"

cat > agent-output/device.md << EOF2
## Device

- Platform: $1
- App ID: $APP_ID

Control the device only with this shell command:

    npx --yes eas-cli@latest simulator:exec npx --yes agent-device@latest <command>

Use these agent-device commands:

- snapshot -i lists the elements on the screen, with references such as @e2. The references change after each action, so run snapshot -i again before each press or fill.
- snapshot lists all the elements, with the text on the screen. On Android, snapshot -i does not show plain text.
- press @e2 taps an element.
- fill @e4 "text" types text into a field.
- scroll down scrolls the screen.
- home sends the app to the background.
- screenshot agent-output/evidence/<number>-<name>.png saves a screenshot.
- open $APP_ID --platform $1 opens the app again.

EOF2
cat .eas/agents/app-facts.md >> agent-output/device.md
