import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import type { Lang } from '@/lib/translations';
import { legalDocuments, legalHref, type LegalKind } from '@/lib/legal/routes';
import './legal.css';

const ui = {
  en: { eyebrow:'LEGAL INFORMATION', contents:'On this page', updated:'Last updated: 9 October 2026', other:'Read the other document', privacy:'Privacy Policy', terms:'Terms & Conditions', contact:'Contact VERALEX', back:'Back to top' },
  id: { eyebrow:'INFORMASI HUKUM', contents:'Daftar isi', updated:'Terakhir diperbarui: 9 Oktober 2026', other:'Baca dokumen lainnya', privacy:'Kebijakan Privasi', terms:'Syarat & Ketentuan', contact:'Hubungi VERALEX', back:'Kembali ke atas' },
  zh: { eyebrow:'法律信息', contents:'本页目录', updated:'最后更新：2026年10月9日', other:'阅读另一份文件', privacy:'隐私政策', terms:'条款与条件', contact:'联系 VERALEX', back:'返回顶部' },
};

export default function LegalDocumentPage({kind,lang}:{kind:LegalKind;lang:Lang}) {
  const doc=legalDocuments[kind][lang]; const copy=ui[lang]; const other:LegalKind=kind==='privacy-policy'?'terms-and-conditions':'privacy-policy';
  return <><Navbar/><main id="top" className="legal-page" lang={lang==='zh'?'zh-CN':lang}>
    <header className="legal-hero"><div className="container"><p className="legal-eyebrow">{copy.eyebrow}</p><h1>{doc.title}</h1><p className="legal-intro">{doc.intro}</p><div className="legal-meta"><span>{copy.updated}</span></div></div></header>
    <div className="container legal-grid"><nav className="legal-toc" aria-label={copy.contents}><div className="legal-toc-desktop"><strong>{copy.contents}</strong><ol>{doc.sections.map((section,i)=><li key={section.id}><a href={`#${section.id}`}>{i+1}. {section.title}</a></li>)}</ol></div><details className="legal-toc-mobile"><summary>{copy.contents}</summary><ol>{doc.sections.map((section,i)=><li key={section.id}><a href={`#${section.id}`}>{i+1}. {section.title}</a></li>)}</ol></details></nav>
      <article className="legal-content">{doc.sections.map((section,i)=><section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}><h2 id={`${section.id}-heading`}><span>{String(i+1).padStart(2,'0')}</span>{section.title}</h2>{section.paragraphs.map((paragraph,j)=><p key={j}>{paragraph}</p>)}{section.id==='privacy'&&kind==='terms-and-conditions'&&<p><Link href={legalHref('privacy-policy',lang)}>{copy.privacy} →</Link></p>}{section.id==='contact'&&<p><a href="mailto:admin@veralexconsulting.com">{copy.contact}: admin@veralexconsulting.com</a></p>}</section>)}
        <div className="legal-end"><p>{copy.other}</p><Link href={legalHref(other,lang)}>{other==='privacy-policy'?copy.privacy:copy.terms} →</Link><a href="#top" className="legal-back">↑ {copy.back}</a></div>
      </article></div>
  </main><Footer/></>;
}
