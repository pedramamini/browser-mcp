import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

import { GetConsoleLogsTool, ScreenshotTool } from "@repo/types/mcp/tool";

import { Tool } from "./tool";

// Network monitoring tool schema
const GetNetworkLogsTool = z.object({
  name: z.literal("get_network_logs"),
  description: z.literal("Get network requests and responses from the browser's network tab"),
  arguments: z.object({}).optional(),
});

export const getConsoleLogs: Tool = {
  schema: {
    name: GetConsoleLogsTool.shape.name.value,
    description: GetConsoleLogsTool.shape.description.value,
    inputSchema: zodToJsonSchema(GetConsoleLogsTool.shape.arguments),
  },
  handle: async (context, _params) => {
    const consoleLogs = await context.sendSocketMessage(
      "browser_get_console_logs",
      {},
    );
    const text: string = consoleLogs
      .map((log) => JSON.stringify(log))
      .join("\n");
    return {
      content: [{ type: "text", text }],
    };
  },
};

export const getNetworkLogs: Tool = {
  schema: {
    name: GetNetworkLogsTool.shape.name.value,
    description: GetNetworkLogsTool.shape.description.value,
    inputSchema: zodToJsonSchema(GetNetworkLogsTool.shape.arguments),
  },
  handle: async (context, _params) => {
    const networkLogs = await context.sendSocketMessage(
      "browser_get_network_logs",
      {},
    );
    const text: string = networkLogs
      .map((log: any) => JSON.stringify(log, null, 2))
      .join("\n\n");
    return {
      content: [{ type: "text", text }],
    };
  },
};

export const screenshot: Tool = {
  schema: {
    name: ScreenshotTool.shape.name.value,
    description: ScreenshotTool.shape.description.value,
    inputSchema: zodToJsonSchema(ScreenshotTool.shape.arguments),
  },
  handle: async (context, _params) => {
    const screenshot = await context.sendSocketMessage(
      "browser_screenshot",
      {},
    );
    return {
      content: [
        {
          type: "image",
          data: screenshot,
          mimeType: "image/png",
        },
      ],
    };
  },
};
