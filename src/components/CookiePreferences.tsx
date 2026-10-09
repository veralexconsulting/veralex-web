'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/useLang';
import GoogleTagManager from './GoogleTagManager';
import MarketingTracking from './MarketingTracking';
import './cookie-preferences.css';

type Choice='accepted'|'rejected'|null;
const storageKey='veralex-optional-tags';
const copy={
  en:{title:'Optional cookies',body:'Necessary session features work without this choice. If you allow optional tags, the configured Google Tag Manager container may measure website use or marketing activity. The tags used depend on the container configuration.',allow:'Allow optional tags',reject:'Reject optional tags',close:'Close cookie settings',settings:'Cookie settings',none:'No optional tag container is currently configured.',current:'Current choice:'},
  id:{title:'Cookie pilihan',body:'Fitur sesi yang diperlukan tetap berjalan tanpa pilihan ini. Jika Anda mengizinkan tag pilihan, Google Tag Manager yang dikonfigurasi dapat mengukur penggunaan situs atau kegiatan pemasaran. Jenis tag yang digunakan bergantung pada konfigurasi kontainer.',allow:'Izinkan tag pilihan',reject:'Tolak tag pilihan',close:'Tutup pengaturan cookie',settings:'Pengaturan cookie',none:'Saat ini belum ada kontainer tag pilihan yang dikonfigurasi.',current:'Pilihan saat ini:'},
  zh:{title:'可选 Cookie',body:'必要的会话功能不受此选择影响。若您允许可选标签，已配置的 Google Tag Manager 容器可能用于统计网站使用或营销活动。实际使用的标签取决于容器配置。',allow:'允许可选标签',reject:'拒绝可选标签',close:'关闭 Cookie 设置',settings:'Cookie 设置',none:'目前未配置可选标签容器。',current:'当前选择：'},
};
const configured=Boolean(process.env.NEXT_PUBLIC_GTM_ID && /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID));
export default function CookiePreferences(){
  const {lang}=useLang(); const t=copy[lang]; const [choice,setChoice]=useState<Choice>(null);const [ready,setReady]=useState(false);const [open,setOpen]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{const stored=localStorage.getItem(storageKey);setChoice(stored==='accepted'||stored==='rejected'?stored:null);setReady(true);},0);const show=()=>setOpen(true);window.addEventListener('veralex-cookie-settings',show);return()=>{window.clearTimeout(timer);window.removeEventListener('veralex-cookie-settings',show);};},[]);
  function choose(next:Exclude<Choice,null>){const hadAccepted=choice==='accepted';localStorage.setItem(storageKey,next);setChoice(next);setOpen(false);if(hadAccepted&&next==='rejected')window.location.reload();}
  return <>{configured&&ready&&choice==='accepted'&&<><GoogleTagManager/><MarketingTracking/></>}{ready&&(open||(configured&&choice===null))&&<div className="cookie-panel" role="dialog" aria-modal="false" aria-labelledby="cookie-title"><div><strong id="cookie-title">{t.title}</strong><p>{configured?t.body:t.none}</p>{open&&choice&&<small>{t.current} {choice==='accepted'?t.allow:t.reject}</small>}</div><div className="cookie-actions">{configured&&<><button type="button" onClick={()=>choose('rejected')}>{t.reject}</button><button type="button" className="cookie-allow" onClick={()=>choose('accepted')}>{t.allow}</button></>}{open&&<button type="button" onClick={()=>setOpen(false)}>{t.close}</button>}</div></div>}</>;
}
