'use server';
import { adminSnapshot, clientSnapshot } from '@/lib/workspace/queries';
import { runOperation, type Operation } from '@/lib/workspace/operations';
import { inspectProjectInvitation, claimProjectInvitation, finishFirstPasswordChange } from '@/lib/workspace/claims';
import { currentActor } from '@/lib/workspace/auth';

export async function getWorkspaceSnapshot(role:'admin'|'client') { return role==='admin' ? adminSnapshot() : clientSnapshot(); }
export async function mutateWorkspace(input:Operation) { return runOperation(input); }
export async function inspectInvitation(token:string) { return inspectProjectInvitation(token); }
export async function claimInvitation(token:string) { return claimProjectInvitation(token); }
export async function changeInitialPassword(password:string) { return finishFirstPasswordChange(password); }
export async function getCurrentWorkspaceActor() { return currentActor(); }
