import { jwtVerify, createRemoteJWKSet } from 'jose'

export default async function validateToken(token: string) {
    try {
        // Use environment variable with fallback
        const authUrl = process.env.BETTER_AUTH_URL!

        const JWKS = createRemoteJWKSet(
            new URL(`${authUrl}/api/auth/jwks`)
        )

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: authUrl,
            audience: authUrl,
        })

        return payload
    } catch (error) {
        console.error('Token validation failed:', error)
        throw error
    }
}