import 'server-only';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
export function newProjectToken() { return randomBytes(32).toString('base64url'); }
export function tokenHash(token: string) { return createHash('sha256').update(token, 'utf8').digest('hex'); }
export function validTokenShape(token: string) { return /^[A-Za-z0-9_-]{43}$/.test(token); }
export function constantTimeTokenMatch(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x,y); }
