# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser MCP is an MCP (Model Context Protocol) server that enables AI applications to automate browser interactions. It connects to a Chrome extension via WebSocket to control the user's actual browser (not headless instances), allowing automation while preserving logged-in sessions and avoiding bot detection.

**Key distinction**: Unlike Playwright MCP which creates new browser instances, Browser MCP controls the user's existing browser profile through a Chrome extension connection.

## Build & Development Commands

```bash
# Type checking
npm run typecheck

# Build the project
npm run build

# Watch mode for development
npm run watch

# Run MCP inspector for debugging
npm run inspector
```

## Architecture

### Core Communication Flow

1. **MCP Server** (src/index.ts, src/server.ts) - Implements MCP protocol using `@modelcontextprotocol/sdk`
2. **WebSocket Bridge** (src/ws.ts, src/context.ts) - Maintains WebSocket connection to Chrome extension
3. **Tool Handlers** (src/tools/) - Convert MCP tool calls to WebSocket messages sent to the extension
4. **Chrome Extension** (not in this repo) - Executes browser automation commands in the actual browser

### Context Management

The `Context` class (src/context.ts) is the central communication hub:
- Manages WebSocket connection to the browser extension
- Provides `sendSocketMessage()` method used by all tools to communicate with the extension
- Throws helpful error message if extension is not connected: "No connection to browser extension..."
- Connection is established when a user clicks "Connect" in the Browser MCP extension

### Tool Architecture

Tools are defined in three categories in src/tools/:

**common.ts** - Navigation and basic interactions:
- `navigate`, `goBack`, `goForward` - Page navigation
- `newPage` - Open URL in new browser tab (see browser_new_page below)
- `wait`, `pressKey` - Timing and keyboard input
- Tools can optionally capture ARIA snapshots after execution (controlled by factory parameter)

**snapshot.ts** - Snapshot-based interactions (always capture ARIA snapshot after execution):
- `snapshot` - Capture current page state as ARIA tree
- `click`, `hover`, `type`, `selectOption` - Element interactions
- These tools require element references from previous snapshots

**custom.ts** - Specialized tools:
- `getConsoleLogs` - Retrieve browser console output
- `screenshot` - Capture page screenshot as base64 PNG

### Tool Implementation Pattern

Each tool follows this structure:
1. Define schema using Zod types from `@repo/types/mcp/tool` (workspace dependency)
2. Convert Zod schema to JSON Schema using `zod-to-json-schema`
3. Implement `handle()` function that:
   - Validates params with Zod schema
   - Calls `context.sendSocketMessage()` with appropriate message type
   - Returns `ToolResult` with text/image content

Example message types used: `browser_navigate`, `browser_click`, `browser_snapshot`, `browser_screenshot`, etc.

### ARIA Snapshot Mechanism

The `captureAriaSnapshot()` function (src/utils/aria-snapshot.ts) is critical:
- Requests page snapshot from extension via `browser_snapshot` message
- Returns YAML-formatted ARIA tree showing page structure
- Used by snapshot-based tools to provide page context after actions
- Includes page URL and title for reference

### WebSocket Server Setup

The WebSocket server (src/ws.ts):
- Defaults to port from `mcpConfig.defaultWsPort`
- Kills any process using the port before starting
- Waits until port is free before creating WebSocketServer
- Only maintains one active connection at a time (new connections close previous ones)

## Workspace Dependencies

This repository depends on workspace packages (not yet published):
- `@repo/types` - Shared TypeScript types (e.g., message types, tool schemas)
- `@repo/config` - Configuration objects (app.config, mcp.config)
- `@repo/messaging` - WebSocket messaging utilities
- `@repo/utils` - Shared utility functions
- `@r2r/messaging` - Socket message sender utilities

**Important**: These dependencies prevent standalone builds outside the monorepo environment.

## Path Aliases

TypeScript is configured with path alias `@/*` → `./src/*`

## New Feature: browser_new_page

The `browser_new_page` tool allows opening URLs in new browser tabs.

**Implementation** (src/tools/common.ts:127-148):
- `newPage` tool factory that sends `browser_new_page` WebSocket message
- Registered in `snapshotTools` array (src/index.ts:31)
- Uses inline Zod schema (`NewPageSchema`) for URL validation
- Captures ARIA snapshot of new page after opening

**Chrome Extension Support**:
- Requires corresponding handler in Chrome extension for `browser_new_page` message
- Extension should use `chrome.tabs.create({url})` API to open new tab
- Feature is backward compatible: gracefully fails if extension doesn't support the message

## Key Constraints

- Tools cannot execute browser automation without an active WebSocket connection
- Connection requires user to manually connect a tab via the Browser MCP Chrome extension
- All browser commands have 30-second timeout by default (configurable in `sendSocketMessage`)
