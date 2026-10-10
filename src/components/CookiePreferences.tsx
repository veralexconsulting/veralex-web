'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/useLang';
import GoogleTagManager from './GoogleTagManager';
import MarketingTracking from './MarketingTracking';
import './cookie-preferences.css';

type Choice='accepted'|'rejected'|null;
const storageKey='veralex-optional-tags';
const copy={
  en:{title:'Optional cookies',body:'With your permission, VERALEX counts WhatsApp, phone and email clicks to see which pages and services interest visitors. No IP address, device fingerprint or message content is stored. Optional marketing tags stay separate. You can change this later in the footer.',allow:'Allow optional measurement',reject:'Reject optional measurement',close:'Close cookie settings',settings:'Cookie settings',current:'Current choice:'},
  id:{title:'Cookie pilihan',body:'Dengan izin Anda, VERALEX menghitung klik WhatsApp, telepon, dan email untuk melihat halaman dan layanan yang diminati pengunjung. Alamat IP, sidik jari perangkat, dan isi pesan tidak disimpan. Tag pemasaran opsional tetap terpisah. Pilihan dapat diubah lewat footer.',allow:'Izinkan pengukuran opsional',reject:'Tolak pengukuran opsional',close:'Tutup pengaturan cookie',settings:'Pengaturan cookie',current:'Pilihan saat ini:'},
  zh:{title:'可选 Cookie',body:'经您允许，VERALEX 会统计 WhatsApp、电话和邮件的点击次数，以了解访客关注哪些页面和服务。我们不会存储 IP 地址、设备指纹或消息内容。可选的营销标签独立运行。您可以随时在页脚更改此选择。',allow:'允许可选统计',reject:'拒绝可选统计',close:'关闭 Cookie 设置',settings:'Cookie 设置',current:'当前选择：'},
};
// Google Tag Manager is optional. First-party click measurement is not: without
// it the owner dashboard stays empty, so it must not depend on a GTM container.
const gtm=Boolean(process.env.NEXT_PUBLIC_GTM_ID && /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID));
export default function CookiePreferences(){
  const {lang}=useLang(); const t=copy[lang]; const [choice,setChoice]=useState<Choice>(null);const [ready,setReady]=useState(false);const [open,setOpen]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{const stored=localStorage.getItem(storageKey);setChoice(stored==='accepted'||stored==='rejected'?stored:null);setReady(true);},0);const show=()=>setOpen(true);window.addEventListener('veralex-cookie-settings',show);return()=>{window.clearTimeout(timer);window.removeEventListener('veralex-cookie-settings',show);};},[]);
  function choose(next:Exclude<Choice,null>){const hadAccepted=choice==='accepted';localStorage.setItem(storageKey,next);setChoice(next);setOpen(false);if(hadAccepted&&next==='rejected')window.location.reload();}
  return <>{ready&&choice==='accepted'&&<>{gtm&&<GoogleTagManager/>}<MarketingTracking/></>}{ready&&(open||choice===null)&&<div className="cookie-panel" role="dialog" aria-modal="false" aria-labelledby="cookie-title"><div><span className="cookie-brand">VERALEX</span><strong id="cookie-title">{t.title}</strong><p>{t.body}</p>{open&&choice&&<small>{t.current} {choice==='accepted'?t.allow:t.reject}</small>}</div><div className="cookie-actions"><button type="button" className="cookie-allow" onClick={()=>choose('accepted')}>{t.allow}</button><button type="button" className="cookie-reject" onClick={()=>choose('rejected')}>{t.reject}</button>{open&&<button type="button" className="cookie-reject" onClick={()=>setOpen(false)}>{t.close}</button>}</div></div>}</>;
}
