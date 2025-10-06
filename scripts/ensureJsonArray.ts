export function ensureJsonArray(output: string) {
  const start = output.indexOf("[");
  const end = output.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON array found");
  }
  return output.slice(start, end + 1);
}
