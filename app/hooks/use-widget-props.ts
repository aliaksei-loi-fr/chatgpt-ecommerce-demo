/**
 * Source: https://github.com/openai/openai-apps-sdk-examples/tree/main/src
 */

import { useOpenAIGlobal } from "./use-openai-global";

/**
 * Hook to get widget props (tool output) from ChatGPT.
 *
 * @param defaultState - Default value or function to compute it if tool output is not available
 * @returns The tool output props, undefined if loading in ChatGPT, or the default fallback
 *
 * @example
 * ```tsx
 * const props = useWidgetProps({ userId: "123", name: "John" });
 * if (props === undefined) return <Loader />;
 * ```
 */
export function useWidgetProps<T extends Record<string, unknown>>(
  defaultState?: T | (() => T),
): T | undefined {
  const toolOutput = useOpenAIGlobal("toolOutput") as T | null;

  // Check if we're in ChatGPT environment
  const isChatGptApp =
    typeof window !== "undefined" && (window as any).__isChatGptApp;

  // If in ChatGPT and toolOutput is null, we're still loading
  if (isChatGptApp && toolOutput === null) {
    return undefined;
  }

  const fallback =
    typeof defaultState === "function"
      ? (defaultState as () => T | null)()
      : (defaultState ?? null);

  return toolOutput ?? (fallback as T);
}
