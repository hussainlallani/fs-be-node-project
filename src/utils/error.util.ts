// Helper to normalize error messages
export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return (error as { message: string }).message;
  }
  return String(error);
}
