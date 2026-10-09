import type { WorkspaceData } from './model';

export function retainUnclaimedTokens(previous:WorkspaceData, next:WorkspaceData):WorkspaceData {
  const tokens=new Map(previous.accessLinks.filter(link=>link.status==='active'&&link.token).map(link=>[link.id,link.token]));
  return {...next,accessLinks:next.accessLinks.map(link=>({...link,token:link.status==='active'?(link.token||tokens.get(link.id)||''):''}))};
}
