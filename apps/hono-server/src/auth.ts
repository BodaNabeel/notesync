import { createRemoteJWKSet, jwtVerify } from "jose";
import type { JWTPayload } from "jose";


const JWKS_URL = new URL(
    `${process.env.BETTER_AUTH_URL}/api/auth/jwks`
);


const JWKS = createRemoteJWKSet(JWKS_URL);

export async function verifyJWT(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, JWKS, {
        algorithms: ["EdDSA"],
    });

    return payload;
}
