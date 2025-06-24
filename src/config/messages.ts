type ErrorContext =
  | "CREATE"
  | "FETCH"
  | "UPDATE"
  | "DELETE"
  | "BULK_CREATE"
  | "BULK_DELETE";

type MessageTemplate = {
  message: string;
  status: number;
};

export const MESSAGES_BASE = {
  NOT_FOUND: "Resource not found",
  INVALID_BODY: "Invalid request body",
} as const;

export const STATUS_CODES = {
  NOT_FOUND: 404,
  INVALID_BODY: 400,
  INTERNAL_ERROR: 500,
} as const;

const generateErrorMessages = (context: ErrorContext): MessageTemplate => ({
  message: `Error ${context.replace("_", " ").toLowerCase()} resource`,
  status: STATUS_CODES.INTERNAL_ERROR,
});

const generateErrorMessagesWithDetails = (
  context: ErrorContext,
  error: unknown
): MessageTemplate => ({
  message: `Error ${context
    .replace("_", " ")
    .toLowerCase()} resource: ${error}`,
  status: STATUS_CODES.INTERNAL_ERROR,
});

export const MESSAGES = {
  ...MESSAGES_BASE,

  // Single error messages
  ERROR_CREATE: generateErrorMessages("CREATE").message,
  ERROR_FETCH: generateErrorMessages("FETCH").message,
  ERROR_UPDATE: generateErrorMessages("UPDATE").message,
  ERROR_DELETE: generateErrorMessages("DELETE").message,
  ERROR_BULK_CREATE: generateErrorMessages("BULK_CREATE").message,
  ERROR_BULK_DELETE: generateErrorMessages("BULK_DELETE").message,

  // Status codes
  NOT_FOUND_STATUS: STATUS_CODES.NOT_FOUND,
  INVALID_BODY_STATUS: STATUS_CODES.INVALID_BODY,
  ERROR_CREATE_STATUS: STATUS_CODES.INTERNAL_ERROR,
  ERROR_FETCH_STATUS: STATUS_CODES.INTERNAL_ERROR,
  ERROR_UPDATE_STATUS: STATUS_CODES.INTERNAL_ERROR,
  ERROR_DELETE_STATUS: STATUS_CODES.INTERNAL_ERROR,
  ERROR_BULK_CREATE_STATUS: STATUS_CODES.INTERNAL_ERROR,
  ERROR_BULK_DELETE_STATUS: STATUS_CODES.INTERNAL_ERROR,

  // Error with details (functions returning object)
  ERROR_CREATE_WITH_DETAILS: (err: unknown) =>
    generateErrorMessagesWithDetails("CREATE", err),
  ERROR_FETCH_WITH_DETAILS: (err: unknown) =>
    generateErrorMessagesWithDetails("FETCH", err),
  ERROR_UPDATE_WITH_DETAILS: (err: unknown) =>
    generateErrorMessagesWithDetails("UPDATE", err),
  ERROR_DELETE_WITH_DETAILS: (err: unknown) =>
    generateErrorMessagesWithDetails("DELETE", err),
  ERROR_BULK_CREATE_WITH_DETAILS: (err: unknown) =>
    generateErrorMessagesWithDetails("BULK_CREATE", err),
  ERROR_BULK_DELETE_WITH_DETAILS: (err: unknown) =>
    generateErrorMessagesWithDetails("BULK_DELETE", err),

  NO_IDS_PROVIDED: "No IDs provided",
};
