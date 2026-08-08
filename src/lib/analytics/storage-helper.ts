import 'client-only';

export function getLocalStorage(key: string, defaultValue?: unknown) {
  const stickyValue = localStorage.getItem(key);

  if (stickyValue !== null && stickyValue !== 'undefined') {
    try {
      return JSON.parse(stickyValue);
    } catch (error) {
      console.error(`Error parsing JSON from localStorage for key "${key}": ${error}`);
    }
  } else {
    return defaultValue;
  }

  return null;
}

export function setLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function deleteLocalStorage(key: string) {
  localStorage.removeItem(key);
}
