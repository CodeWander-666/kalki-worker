# ⚡ Kalki Worker – Production‑Ready Mesh Node

Browser‑based GPU sharing node for the Kalki Intelligence network.  
Earn points by donating idle compute to distributed AI tasks.

## Features
- 🚀 **One-click start** – just enter a GitHub token and go
- 🔍 **Automatic hardware detection** and benchmark
- 📋 **Complete activity logging** in real time
- 🔁 **Multi‑task concurrency** for performance
- 🔒 **Secure communication** via GitHub Issues
- 📱 **PWA support** – install on any device

## Setup
1. Fork / clone this repository.
2. Enable GitHub Pages (main branch, root folder).
3. Obtain a GitHub personal access token with `public_repo` scope.
4. Open the worker page and enter the token + target KalkiCore repository owner/name.
5. Click "Start Sharing GPU".

Your points will be visible in the connected kalkicore repository's `tasks.json`.

## Integration
The worker expects a kalkicore repository with a `tasks.json` file containing a `pending` array of compute tasks.  
Results are submitted as GitHub issues with the label `worker-result`.  
A GitHub Actions workflow (in kalkicore) processes these issues and credits points.

## License
AGPL-3.0
