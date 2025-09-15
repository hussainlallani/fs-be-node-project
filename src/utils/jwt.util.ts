import jwt, { SignOptions, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Ensure JWT_SECRET is defined and typed correctly
const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "fs_be_node_project_jwt_secret";
const JWT_EXPIRATION: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRATION as SignOptions["expiresIn"]) || "1d";

const JWT_REFRESH_SECRET: Secret =
  process.env.JWT_REFRESH_SECRET || "fs_be_node_project_jwt_refresh_secret";
const JWT_REFRESH_EXPIRATION: SignOptions["expiresIn"] =
  (process.env.JWT_REFRESH_EXPIRATION as SignOptions["expiresIn"]) || "7d";

/**
 * Generate a signed JWT token.
 * @param payload - Data to embed in the token (user ID, role, etc.)
 * @param expiresIn - Expiration time (e.g., "1d", "2h", 3600)
 * @returns Signed JWT string
 */
export function generateToken(
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = JWT_EXPIRATION
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Generate a refresh token \
 * Typically long-lived (e.g., 7d to 30d) and stored in HTTP-only cookies or DB
 */
export function generateRefreshToken(
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = JWT_REFRESH_EXPIRATION
): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}

export function getTokenFromHeader(header: string | undefined): string | null {
  if (!header) return null;
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded.exp) return true; // If no exp, treat as expired
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true; // If decoding fails, treat as expired
  }
}

export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded.exp) return null; // If no exp, return null
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuer(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issuer or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudience(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string };
    return decoded.aud || null; // Return audience or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedAt(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as { iat?: number };
    if (!decoded.iat) return null; // If no iat, return null
    return new Date(decoded.iat * 1000);
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenId(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { jti?: string };
    return decoded.jti || null; // Return jti or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenSubject(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { sub?: string };
    return decoded.sub || null; // Return subject or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAlgorithm(token: string): string | null {
  try {
    const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload & {
      header?: jwt.JwtHeader;
    };
    return decoded.header?.alg || null; // Return algorithm or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedBy(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issuer or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenCustomClaims(
  token: string
): Record<string, any> | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const customClaims: Record<string, any> = {};
    for (const key in decoded) {
      if (
        key !== "exp" &&
        key !== "iat" &&
        key !== "iss" &&
        key !== "aud" &&
        key !== "sub" &&
        key !== "jti"
      ) {
        customClaims[key] = decoded[key];
      }
    }
    return Object.keys(customClaims).length > 0 ? customClaims : null;
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenScopes(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { scopes?: string[] };
    return decoded.scopes || null; // Return scopes or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenRoles(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { roles?: string[] };
    return decoded.roles || null; // Return roles or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuerId(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issuer ID or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceId(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string };
    return decoded.aud || null; // Return audience ID or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedAtTimestamp(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as { iat?: number };
    return decoded.iat ? decoded.iat * 1000 : null; // Return issued at timestamp or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenExpirationTimestamp(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    return decoded.exp ? decoded.exp * 1000 : null; // Return expiration timestamp or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedById(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issued by ID or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceIdList(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string[] };
    return decoded.aud || null; // Return audience ID list or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedByList(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string[] };
    return decoded.iss || null; // Return issued by list or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuerName(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issuer name or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceName(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string };
    return decoded.aud || null; // Return audience name or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedByName(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issued by name or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceNameList(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string[] };
    return decoded.aud || null; // Return audience name list or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedByNameList(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string[] };
    return decoded.iss || null; // Return issued by name list or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuerUrl(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issuer URL or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceUrl(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string };
    return decoded.aud || null; // Return audience URL or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedByUrl(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issued by URL or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceUrlList(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string[] };
    return decoded.aud || null; // Return audience URL list or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedByUrlList(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string[] };
    return decoded.iss || null; // Return issued by URL list or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuerEmail(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issuer email or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceEmail(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string };
    return decoded.aud || null; // Return audience email or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenIssuedByEmail(token: string): string | null {
  try {
    const decoded = jwt.decode(token) as { iss?: string };
    return decoded.iss || null; // Return issued by email or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}

export function getTokenAudienceEmailList(token: string): string[] | null {
  try {
    const decoded = jwt.decode(token) as { aud?: string[] };
    return decoded.aud || null; // Return audience email list or null if not present
  } catch (error) {
    return null; // If decoding fails, return null
  }
}
