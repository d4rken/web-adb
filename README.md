# darken's ADB Web Helper

A browser-based tool that runs ADB commands on your Android device over USB — no software installation required.

**[Open ADB Web Helper](https://d4rken.github.io/web-adb/)**

## What is this?

Some Android apps need ADB permissions to work around OS restrictions. This tool lets you grant those permissions directly from your browser using [WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API), without installing ADB or any desktop software.

Currently supported:
- **SD Maid SE** — Grant/revoke `WRITE_SECURE_SETTINGS`

## How to use

1. Enable USB debugging on your Android device
2. Connect it to your computer via USB
3. Open the [web app](https://d4rken.github.io/web-adb/) in Chrome or Edge
4. Select your device when prompted
5. Tap "Allow" on the USB debugging prompt on your phone
6. Pick an app and run the command you need

## Requirements

- A Chromium-based browser (Chrome, Edge, Brave, Opera) — Firefox and Safari don't support WebUSB
- A USB cable (not just charging — must support data transfer)
- USB debugging enabled on the device

## Support

- Discord: https://discord.gg/ENtVkMHqZg

## Development

```sh
npm install
npm run dev
```

Tests: `npm test`

Deployments happen automatically when a version tag (`v*`) is pushed.
