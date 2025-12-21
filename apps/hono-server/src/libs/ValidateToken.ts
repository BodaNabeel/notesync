import { jwtVerify, createRemoteJWKSet } from 'jose'

export default async function validateToken(token: string) {
    try {
        const JWKS = createRemoteJWKSet(
            new URL('http://localhost:3000/api/auth/jwks')
        )
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: process.env.BETTER_AUTH_URL,
            audience: process.env.BETTER_AUTH_URL,
        })
        return payload
    } catch (error) {
        console.error('Token validation failed:', error)
        throw error
    }
}

