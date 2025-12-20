// auth/jwt.ts
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { JWTPayload } from "jose";


const JWKS_URL = new URL(
    `${process.env.BETTER_AUTH_URL}/api/auth/jwks`
);

/**
 * jose handles:
 * - caching
 * - key rotation
 * - kid selection
 */
const JWKS = createRemoteJWKSet(JWKS_URL);

export async function verifyJWT(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, JWKS, {
        algorithms: ["EdDSA"],
    });

    return payload;
}


// console.log(process.env.BETTER_AUTH_URL!, "hello")

// export const verifyJWT = () => {
//     return "hi"
// }