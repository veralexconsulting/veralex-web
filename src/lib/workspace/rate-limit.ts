import 'server-only';
import { createHash } from 'node:crypto';
import { transaction } from './db';

export async function workspaceRateLimit(key:string,action:string,limit:number) {
  const hashed=createHash('sha256').update(key).digest('hex');
  const attempts=await transaction(async client=>{
    const result=await client.query("insert into public.workspace_rate_limits(key_hash,action,window_start,attempts) values($1,$2,date_trunc('hour',now()),1) on conflict(key_hash,action,window_start) do update set attempts=public.workspace_rate_limits.attempts+1 returning attempts",[hashed,action]);
    return Number(result.rows[0].attempts);
  });
  if(attempts>limit) throw new Error('Terlalu banyak percobaan. Coba lagi nanti.');
}
