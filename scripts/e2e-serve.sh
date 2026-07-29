#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -z "${JAVA_HOME:-}" ]]; then
  for candidate in \
    /opt/homebrew/opt/openjdk@21 \
    /opt/homebrew/opt/openjdk \
    /usr/local/opt/openjdk@21 \
    /usr/local/opt/openjdk; do
    if [[ -x "$candidate/bin/java" ]]; then
      export JAVA_HOME="$candidate"
      export PATH="$JAVA_HOME/bin:$PATH"
      break
    fi
  done
fi

export NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
export NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=127.0.0.1
export NEXT_PUBLIC_FIREBASE_PROJECT_ID=gym-tracker-demo
export NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gym-tracker-demo.appspot.com
export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
export NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

exec npx firebase emulators:exec \
  --only auth,firestore \
  --project gym-tracker-demo \
  "npx next dev -H 127.0.0.1 -p 3000"
