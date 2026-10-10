'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getWorkspaceSnapshot, mutateWorkspace } from '@/app/workspace-actions';
import type { Operation } from '@/lib/workspace/operations';
import type { WorkspaceData, Project, ProjectStatus, TaskStatus, Stage, PriorityStatus } from './model';
import { retainUnclaimedTokens } from './snapshot';

export type DraftProject = Pick<Project,'title'|'serviceId'|'picId'|'startAt'|'followUpAt'|'notes'|'supportingIds'> & {clientId?:string;clientName:string;clientEmail:string;clientPhone:string};
interface WorkspaceContextValue {
  data:WorkspaceData;ready:boolean;error:string;actorId:string;clientAccountId:string;toast:string;toastError:boolean;pendingCount:number;
  refresh:()=>Promise<void>;clearToast:()=>void;
  createProject:(draft:DraftProject)=>Promise<string>;
  updateProject:(id:string,patch:Partial<Project>,message:string,clientVisible?:boolean)=>Promise<void>;
  updateWorkflow:(projectId:string,stages:Stage[],reason:string)=>Promise<void>;
  setTaskStatus:(projectId:string,taskId:string,status:TaskStatus,reason?:string)=>Promise<void>;
  addProjectUpdate:(projectId:string,message:string,clientVisible:boolean)=>Promise<void>;
  updateClient:(id:string,patch:{name:string;email:string;phone:string})=>Promise<void>;
  deleteClient:(id:string)=>Promise<void>;
  createTeamMember:(name:string,email:string,phone:string,initialPassword:string)=>Promise<void>;
  updateTeamContact:(id:string,name:string,phone:string)=>Promise<void>;
  deleteTeamMember:(id:string)=>Promise<void>;
  deleteProject:(id:string)=>Promise<void>;
  setAdminActive:(id:string,active:boolean)=>Promise<void>;
  updateService:(id:string,changes:Partial<WorkspaceData['services'][number]>)=>Promise<void>;
  publishService:(id:string)=>Promise<void>;
  updateOffering:(changes:Partial<WorkspaceData['priorityOffering']>)=>Promise<void>;
  setPriority:(projectId:string,status:PriorityStatus)=>Promise<void>;
  createAccessLink:(projectId:string)=>Promise<void>;
  revokeAccessLink:(projectId:string)=>Promise<void>;
  revokeAccess:(projectId:string)=>Promise<void>;
  resetAccess:(projectId:string)=>Promise<void>;
  markRead:(id:string)=>Promise<void>;markAllRead:(role:'admin'|'client')=>Promise<void>;
}
const empty:WorkspaceData={admins:[],clients:[],clientAccounts:[],accesses:[],services:[],projects:[],activities:[],accessLinks:[],notifications:[],priorityOffering:{enabled:false,serviceIds:[],stageIds:[],title:'Layanan Prioritas Penanganan VERALEX',description:'',commitment:'',limitations:'',terms:'',price:0}};
const Context=createContext<WorkspaceContextValue|null>(null);
const message=(cause:unknown)=>cause instanceof Error?cause.message:'Operasi belum dapat diselesaikan.';
const refreshIntervalMs=20_000;
const operationKey=(input:Operation)=>{
  const item=input as Operation & {id?:string;projectId?:string;taskId?:string;email?:string};
  return [input.type,item.id||item.projectId||item.taskId||item.email?.toLowerCase()||'global'].join(':');
};

export function WorkspaceProvider({children,role}:{children:React.ReactNode;role:'admin'|'client'}) {
  const [data,setData]=useState<WorkspaceData>(empty); const [ready,setReady]=useState(false); const [error,setError]=useState(''); const [pendingCount,setPendingCount]=useState(0);
  const [actorId,setActorId]=useState(''); const [clientAccountId,setClientAccountId]=useState(''); const [toast,setToast]=useState(''); const [toastError,setToastError]=useState(false);
  const refreshVersion=useRef(0); const mutationsInFlight=useRef(0); const inFlightKeys=useRef(new Set<string>()); const lastPassiveRefresh=useRef(0);
  const refresh=useCallback(async()=>{
    const version=++refreshVersion.current;
    const snapshot=await getWorkspaceSnapshot(role);
    if(version!==refreshVersion.current)return;
    setData(previous=>retainUnclaimedTokens(previous,snapshot.data));
    setActorId(snapshot.actorId);setClientAccountId(snapshot.clientAccountId);setError('');setReady(true);
  },[role]);
  useEffect(()=>{
    let mounted=true;
    refresh().catch(cause=>{if(mounted){setError(role==='client'?'Client portal is temporarily unavailable.':message(cause));setReady(true);}});
    return()=>{mounted=false;};
  },[refresh,role]);
  useEffect(()=>{
    const whenVisible=()=>{
      if(document.visibilityState!=='visible'||mutationsInFlight.current>0||Date.now()-lastPassiveRefresh.current<1000)return;
      lastPassiveRefresh.current=Date.now();
      refresh().catch(()=>{/* Keep the latest usable snapshot on transient failures. */});
    };
    const timer=window.setInterval(whenVisible,refreshIntervalMs);
    window.addEventListener('focus',whenVisible);
    document.addEventListener('visibilitychange',whenVisible);
    return()=>{window.clearInterval(timer);window.removeEventListener('focus',whenVisible);document.removeEventListener('visibilitychange',whenVisible);};
  },[refresh]);
  const run=useCallback(async(input:Operation,success:string,projectId?:string)=>{
    const key=operationKey(input);
    if(inFlightKeys.current.has(key))throw new Error('Operasi ini sedang diproses.');
    inFlightKeys.current.add(key);
    mutationsInFlight.current++;
    setPendingCount(mutationsInFlight.current);
    try {
      let result:{id?:string;token?:string};
      try {
        const response=await mutateWorkspace(input);
        if (!response.ok) throw new Error(response.error);
        result=response.result;
      } catch(cause) {
        setToast(role==='client'?'This client portal request could not be completed.':message(cause));setToastError(true);
        throw cause;
      }
      try {
        await refresh();
      } catch(cause) {
        setError(role==='client'?'Client portal is temporarily unavailable.':message(cause));
        setToast(role==='client'?'Client portal could not refresh.':'Perubahan tersimpan, tetapi tampilan belum dapat dimuat ulang. Coba muat ulang.');setToastError(true);
        return result;
      }
      if(result.token && projectId) setData(previous=>({...previous,accessLinks:previous.accessLinks.map(link=>link.projectId===projectId&&link.status==='active'?{...link,token:result.token!}:link)}));
      setToast(success);setToastError(false);
      return result;
    } finally {
      mutationsInFlight.current--;
      inFlightKeys.current.delete(key);
      setPendingCount(mutationsInFlight.current);
    }
  },[refresh,role]);
  const safe=useCallback(async(input:Operation,success:string,projectId?:string)=>{try{await run(input,success,projectId);}catch{/* Error is shown in the shared toast. */}},[run]);
  const value=useMemo<WorkspaceContextValue>(()=>({data,ready,error,actorId,clientAccountId,toast,toastError,pendingCount,refresh,clearToast:()=>setToast(''),
    async createProject(draft){const result=await run({type:'create_project',draft},'Proyek dibuat. Bagikan tautan setelah memverifikasi penerima.');if(!result.id)throw new Error('Proyek belum dibuat.');if(result.token)setData(previous=>({...previous,accessLinks:previous.accessLinks.map(link=>link.projectId===result.id&&link.status==='active'?{...link,token:result.token!}:link)}));return result.id;},
    async updateProject(id,patch){await run({type:'update_project',id,patch},'Proyek diperbarui.');},
    updateWorkflow:(projectId,stages,reason)=>safe({type:'update_workflow',projectId,stages,reason},'Workflow proyek diperbarui.'),
    async setTaskStatus(projectId,taskId,status,reason){await run({type:'set_task_status',projectId,taskId,status,reason},'Status tugas diperbarui.');},
    async addProjectUpdate(projectId,message,clientVisible){await run({type:'add_project_update',projectId,message,clientVisible},'Pembaruan proyek ditambahkan.');},
    updateClient:async(id,patch)=>{await run({type:'update_client',id,patch},'Kontak klien diperbarui.');},
    deleteClient:async id=>{await run({type:'delete_client',id},'Data kontak klien dihapus.');},
    async createTeamMember(name,email,phone,password){await run({type:'create_team',name,email,phone,password},'Akun administrator dibuat. Sampaikan kata sandi awal melalui kanal privat.');},
    updateTeamContact:async(id,name,phone)=>{await run({type:'update_team_contact',id,name,phone},'Kontak WhatsApp anggota tim diperbarui.');},
    deleteTeamMember:async id=>{await run({type:'delete_team',id},'Anggota tim dinonaktifkan dan dikeluarkan dari daftar. Riwayat serta akun Auth dipertahankan.');},
    deleteProject:async id=>{await run({type:'delete_project',id},'Proyek dihapus dari tampilan aktif. Riwayatnya dipertahankan.');},
    setAdminActive:async(id,active)=>{await run({type:'set_admin_active',id,active},'Status administrator diperbarui.');},
    updateService:(id,changes)=>safe({type:'update_service',id,stages:changes.stages||data.services.find(item=>item.id===id)?.draftStages||data.services.find(item=>item.id===id)?.stages||[]},'Draf SOP disimpan.'),
    publishService:id=>safe({type:'publish_service',id},'SOP diterbitkan untuk proyek baru.'),
    updateOffering:async changes=>{await run({type:'update_offering',value:{...data.priorityOffering,...changes}},'Penawaran prioritas diperbarui.');},
    setPriority:(projectId,status)=>safe({type:'set_priority',projectId,status},'Status prioritas diperbarui.'),
    createAccessLink:async projectId=>{await run({type:'create_link',projectId},'Tautan baru diterbitkan.',projectId);},
    revokeAccessLink:async projectId=>{await run({type:'revoke_link',projectId},'Tautan dicabut.');},
    revokeAccess:async projectId=>{await run({type:'revoke_access',projectId},'Akses klien dicabut.');},
    resetAccess:async projectId=>{await run({type:'reset_access',projectId},'Akses diatur ulang. Verifikasi penerima sebelum membagikan tautan baru.',projectId);},
    markRead:id=>safe({type:'mark_read',id},'Notifikasi dibaca.'),
    markAllRead:()=>safe({type:'mark_all_read'},'Semua notifikasi ditandai dibaca.'),
  }),[data,ready,error,actorId,clientAccountId,toast,toastError,pendingCount,refresh,run,safe]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useWorkspace(){const value=useContext(Context);if(!value)throw new Error('WorkspaceProvider belum terpasang');return value;}
export const formatDate=(value?:string)=>value?new Date(value).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):'—';
export const formatDateTime=(value?:string)=>value?new Date(value).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'}):'—';
export const currentStage=(stages:Stage[])=>stages.find(stage=>stage.tasks.some(task=>task.status!=='completed'&&task.status!=='skipped'))||stages.at(-1);
export const nextTask=(stages:Stage[])=>stages.flatMap(stage=>stage.tasks).find(task=>task.status!=='completed'&&task.status!=='skipped');
export const completedStages=(stages:Stage[])=>stages.filter(stage=>stage.tasks.length>0&&stage.tasks.every(task=>task.status==='completed'||task.status==='skipped')).length;
export const isActionStatus=(status:ProjectStatus)=>['active','review','waiting_client'].includes(status);
