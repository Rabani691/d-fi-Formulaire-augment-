const store = new Map<string, string>();

export function saveMessage(id: string, message: string) {
  store.set(id, message);
}

export function getMessage(id: string | undefined | null) {
  if (!id) return undefined;
  return store.get(id) ?? undefined;
}
