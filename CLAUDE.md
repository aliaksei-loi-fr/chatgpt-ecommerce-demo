# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that demonstrates building an OpenAI Apps SDK compatible MCP (Model Context Protocol) server with widget rendering in ChatGPT. The app uses Shopify Polaris for UI components and supports theme switching.

## Tech Stack

- **Framework**: Next.js 15.5.7 with App Router and Turbopack
- **Runtime**: React 19
- **Package Manager**: pnpm 10.14.0
- **UI Library**: Shopify Polaris 13.x
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **MCP**: `mcp-handler` and `@modelcontextprotocol/sdk`

## Common Commands

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm inspect      # Run MCP inspector
pnpm tunnel       # Start ngrok tunnel for testing with ChatGPT
```

## Project Architecture

### Key Directories

- `app/` - Next.js App Router pages and API routes
- `app/mcp/route.ts` - MCP server endpoint (tools and resources registration)
- `app/hooks/` - Custom React hooks for OpenAI SDK integration
- `components/` - Reusable React components
- `lib/context/` - React context providers (Theme, Shopify/Polaris)

### MCP Server (`app/mcp/route.ts`)

The MCP server exposes tools and resources to ChatGPT:
- **Tools**: Functions that ChatGPT can call (registered with `server.registerTool`)
- **Resources**: HTML content for iframe rendering (registered with `server.registerResource`)
- Tools link to resources via `templateUri` for widget display

OpenAI-specific metadata keys:
- `openai/outputTemplate` - Links tool to a resource
- `openai/toolInvocation/invoking` - Loading state text
- `openai/toolInvocation/invoked` - Completion state text
- `openai/widgetAccessible` - Widget visibility flag
- `openai/resultCanProduceWidget` - Enable widget rendering

### ChatGPT Iframe Integration

The app runs inside a ChatGPT iframe, requiring special handling:

1. **Asset Prefix** (`next.config.ts`): Must set `assetPrefix` to ensure `/_next/` assets load correctly
2. **CORS Middleware** (`middleware.ts`): Handles preflight requests for cross-origin RSC fetching
3. **SDK Bootstrap** (`app/layout.tsx`): Patches browser APIs (`history.pushState`, `window.fetch`) for iframe compatibility

### Path Aliases

- `@/*` maps to project root (e.g., `@/components`, `@/lib/context`)

## Development Notes

- The `suppressHydrationWarning` on `<html>` is required because ChatGPT modifies the initial HTML before hydration
- External links are handled via `window.openai.openExternal()` when running inside ChatGPT
- The `baseUrl.ts` file auto-detects Vercel environment variables for correct URL configuration
