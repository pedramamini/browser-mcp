<a href="https://browsermcp.io">
  <img src="./.github/images/banner.png" alt="Browser MCP banner">
</a>

<h3 align="center">Browser MCP</h3>

<p align="center">
  Automate your browser with AI.
  <br />
  <a href="https://browsermcp.io"><strong>Website</strong></a> 
  •
  <a href="https://docs.browsermcp.io"><strong>Docs</strong></a>
</p>

## About

Browser MCP is an MCP server + Chrome extension that allows you to automate your browser using AI applications like VS Code, Claude, Cursor, and Windsurf.

## Features

- ⚡ Fast: Automation happens locally on your machine, resulting in better performance without network latency.
- 🔒 Private: Since automation happens locally, your browser activity stays on your device and isn't sent to remote servers.
- 👤 Logged In: Uses your existing browser profile, keeping you logged into all your services.
- 🥷🏼 Stealth: Avoids basic bot detection and CAPTCHAs by using your real browser fingerprint.
- 📊 Network Monitoring: Monitor network requests and responses from the browser's network tab in addition to console logs.

## Network Monitoring

The Browser MCP server now includes network monitoring capabilities that allow you to:

- **Monitor Network Requests**: Track all HTTP/HTTPS requests made by the browser
- **View Response Details**: Access response headers, status codes, and timing information
- **Debug Network Issues**: Identify failed requests, slow responses, and network errors
- **API Testing**: Monitor API calls and their responses during automation

### Available Tools

- `get_network_logs`: Retrieves network request and response data from the browser's network tab
- `get_console_logs`: Retrieves console logs (existing functionality)
- `screenshot`: Takes screenshots of the current page

The network monitoring feature works alongside the existing console monitoring, providing comprehensive debugging capabilities for web automation tasks.

## Contributing

This repo contains all the core MCP code for Browser MCP, but currently cannot yet be built on its own due to dependencies on utils and types from the monorepo where it's developed.

## Credits

Browser MCP was adapted from the [Playwright MCP server](https://github.com/microsoft/playwright-mcp) in order to automate the user's browser rather than creating new browser instances. This allows using the user's existing browser profile to use logged-in sessions and avoid bot detection mechanisms that commonly block automated browser use.
