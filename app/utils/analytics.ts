// Track tool usage in localStorage
export function trackToolUsage(toolKey: string, type: 'conversation' | 'download' = 'conversation') {
  const storageKey = `${toolKey}-${type}s`;
  const currentCount = parseInt(localStorage.getItem(storageKey) || '0');
  localStorage.setItem(storageKey, (currentCount + 1).toString());
}
