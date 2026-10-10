'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/useLang';
import GoogleTagManager from './GoogleTagManager';
import MarketingTracking from './MarketingTracking';
import './cookie-preferences.css';

type Choice='accepted'|'rejected'|null;
const storageKey='veralex-optional-tags';
const copy={
  en:{title:'Optional cookies',body:'Necessary session features work without this choice. If you allow optional measurement, VERALEX counts how often visitors click WhatsApp, phone and email buttons on this site, so the business can see which pages and services people are interested in. No IP address, device fingerprint or message content is recorded. A Google Tag Manager container, when configured, adds marketing tags on top of that.',allow:'Allow optional measurement',reject:'Reject optional measurement',close:'Close cookie settings',settings:'Cookie settings',current:'Current choice:'},
  id:{title:'Cookie pilihan',body:'Fitur sesi yang diperlukan tetap berjalan tanpa pilihan ini. Jika Anda mengizinkan pengukuran opsional, VERALEX menghitung berapa kali pengunjung mengeklik tombol WhatsApp, telepon, dan email di situs ini agar bisnis dapat melihat halaman dan layanan yang diminati. Alamat IP, sidik jari perangkat, dan isi pesan tidak dicatat. Kontainer Google Tag Manager, bila dikonfigurasi, menambahkan tag pemasaran di atasnya.',allow:'Izinkan pengukuran opsional',reject:'Tolak pengukuran opsional',close:'Tutup pengaturan cookie',settings:'Pengaturan cookie',current:'Pilihan saat ini:'},
  zh:{title:'可选 Cookie',body:'必要的会话功能不受此选择影响。若您允许可选的统计，VERALEX 会统计访客在本站点击 WhatsApp、电话和邮件按钮的次数，以便业务了解哪些页面和服务受到关注。我们不会记录 IP 地址、设备指纹或消息内容。若已配置 Google Tag Manager 容器，则会在此基础上附加营销标签。',allow:'允许可选统计',reject:'拒绝可选统计',close:'关闭 Cookie 设置',settings:'Cookie 设置',current:'当前选择：'},
};
// Google Tag Manager is optional. First-party click measurement is not: without
// it the owner dashboard stays empty, so it must not depend on a GTM container.
const gtm=Boolean(process.env.NEXT_PUBLIC_GTM_ID && /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID));
export default function CookiePreferences(){
  const {lang}=useLang(); const t=copy[lang]; const [choice,setChoice]=useState<Choice>(null);const [ready,setReady]=useState(false);const [open,setOpen]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{const stored=localStorage.getItem(storageKey);setChoice(stored==='accepted'||stored==='rejected'?stored:null);setReady(true);},0);const show=()=>setOpen(true);window.addEventListener('veralex-cookie-settings',show);return()=>{window.clearTimeout(timer);window.removeEventListener('veralex-cookie-settings',show);};},[]);
  function choose(next:Exclude<Choice,null>){const hadAccepted=choice==='accepted';localStorage.setItem(storageKey,next);setChoice(next);setOpen(false);if(hadAccepted&&next==='rejected')window.location.reload();}
  return <>{ready&&choice==='accepted'&&<>{gtm&&<GoogleTagManager/>}<MarketingTracking/></>}{ready&&(open||choice===null)&&<div className="cookie-panel" role="dialog" aria-modal="false" aria-labelledby="cookie-title"><div><strong id="cookie-title">{t.title}</strong><p>{t.body}</p>{open&&choice&&<small>{t.current} {choice==='accepted'?t.allow:t.reject}</small>}</div><div className="cookie-actions"><button type="button" onClick={()=>choose('rejected')}>{t.reject}</button><button type="button" className="cookie-allow" onClick={()=>choose('accepted')}>{t.allow}</button>{open&&<button type="button" onClick={()=>setOpen(false)}>{t.close}</button>}</div></div>}</>;
}
