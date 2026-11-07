'use client';

import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/translations';
import { useWorkspace } from './store';
import { PageHeader } from './ui';
import { useClientLocale } from './client-locale';

const copy = {
  en: {
    eyebrow: 'Client Portal',
    title: 'Settings',
    intro: 'Manage your language preference and review the account details linked to your VERALEX projects.',
    languageTitle: 'Language',
    languageDesc: 'Choose the language used across the client portal. The change applies immediately and is remembered on this device.',
    profileTitle: 'Account details',
    profileDesc: 'These details come from the account registered for your project. Contact the VERALEX team if anything needs updating.',
    name: 'Name',
    email: 'Email',
    role: 'Account type',
    roleValue: 'Client account',
    readOnly: 'Managed by VERALEX',
    projectsTitle: 'Linked projects',
    projectsDesc: 'Projects this account can currently access.',
    noProjects: 'No projects are linked to this account yet.',
    noticesTitle: 'Email notifications',
    noticesDesc: 'Project status changes are sent to your registered email address. Notification preferences are managed together with your project agreement.',
    contactTitle: 'Need a change?',
    contactDesc: 'Name corrections, additional users, or access changes are handled by the VERALEX team so records stay consistent with your legal documents.',
    contactAction: 'Contact the team',
  },
  id: {
    eyebrow: 'Portal Klien',
    title: 'Pengaturan',
    intro: 'Atur bahasa portal dan tinjau data akun yang terhubung dengan proyek VERALEX Anda.',
    languageTitle: 'Bahasa',
    languageDesc: 'Pilih bahasa yang digunakan di portal klien. Perubahan langsung berlaku dan diingat pada perangkat ini.',
    profileTitle: 'Data akun',
    profileDesc: 'Data ini berasal dari akun yang terdaftar untuk proyek Anda. Hubungi tim VERALEX bila ada yang perlu diperbarui.',
    name: 'Nama',
    email: 'Email',
    role: 'Jenis akun',
    roleValue: 'Akun klien',
    readOnly: 'Dikelola oleh VERALEX',
    projectsTitle: 'Proyek terhubung',
    projectsDesc: 'Proyek yang dapat diakses akun ini saat ini.',
    noProjects: 'Belum ada proyek yang terhubung ke akun ini.',
    noticesTitle: 'Notifikasi email',
    noticesDesc: 'Perubahan status proyek dikirim ke email terdaftar Anda. Preferensi notifikasi dikelola bersama perjanjian layanan Anda.',
    contactTitle: 'Perlu perubahan?',
    contactDesc: 'Perbaikan nama, penambahan pengguna, atau perubahan akses ditangani oleh tim VERALEX agar data tetap selaras dengan dokumen legal Anda.',
    contactAction: 'Hubungi tim',
  },
  zh: {
    eyebrow: '客户门户',
    title: '设置',
    intro: '管理您的语言偏好，并查看与 VERALEX 项目关联的账号信息。',
    languageTitle: '语言',
    languageDesc: '选择客户门户使用的语言。更改立即生效，并会在此设备上记住。',
    profileTitle: '账号信息',
    profileDesc: '这些信息来自为您的项目注册的账号。如需更新，请联系 VERALEX 团队。',
    name: '姓名',
    email: '邮箱',
    role: '账号类型',
    roleValue: '客户账号',
    readOnly: '由 VERALEX 管理',
    projectsTitle: '关联项目',
    projectsDesc: '此账号当前可访问的项目。',
    noProjects: '此账号尚未关联任何项目。',
    noticesTitle: '邮件通知',
    noticesDesc: '项目状态变更将发送至您注册的邮箱。通知偏好与服务协议一并管理。',
    contactTitle: '需要修改？',
    contactDesc: '姓名更正、新增用户或权限变更由 VERALEX 团队处理，以确保记录与您的法律文件保持一致。',
    contactAction: '联系团队',
  },
} as const;

const languages: Array<{ value: Lang; label: string; note: string }> = [
  { value: 'en', label: 'English', note: 'English' },
  { value: 'id', label: 'Bahasa Indonesia', note: 'Indonesian' },
  { value: 'zh', label: '中文', note: 'Chinese' },
];

export function PortalSettings() {
  const { lang, setLanguage } = useClientLocale();
  const { data, clientAccountId } = useWorkspace();
  const account = data.clientAccounts.find(item => item.id === clientAccountId);
  const t = copy[lang];
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    if (!announce) return;
    const timer = window.setTimeout(() => setAnnounce(''), 4000);
    return () => window.clearTimeout(timer);
  }, [announce]);

  const linkedProjects = data.projects.filter(project => {
    const hasAccess = data.accesses.some(access => access.accountId === clientAccountId && access.projectId === project.id && !access.revokedAt);
    return hasAccess && project.status !== 'archived';
  });

  return (
    <div className="ws-settings-page">
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.intro} />

      <div className="ws-detail-grid">
        <section className="ws-surface ws-pad">
          <h2>{t.languageTitle}</h2>
          <p className="ws-muted ws-setting-copy">{t.languageDesc}</p>
          <fieldset className="ws-choice-group">
            <legend className="ws-sr-only">{t.languageTitle}</legend>
            {languages.map(option => (
              <label key={option.value} className={`ws-choice ${lang === option.value ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="portal-language"
                  value={option.value}
                  checked={lang === option.value}
                  onChange={() => { setLanguage(option.value); setAnnounce(`${t.languageTitle}: ${option.label}`); }}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.note}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="ws-sr-only" role="status" aria-live="polite">{announce}</p>
        </section>

        <section className="ws-surface ws-pad">
          <h2>{t.profileTitle}</h2>
          <p className="ws-muted ws-setting-copy">{t.profileDesc}</p>
          <dl className="ws-facts">
            <div><dt>{t.name}</dt><dd>{account?.name || '—'}</dd></div>
            <div><dt>{t.email}</dt><dd>{account?.email || '—'}</dd></div>
            <div><dt>{t.role}</dt><dd>{t.roleValue}</dd></div>
          </dl>
          <small className="ws-readonly-note">{t.readOnly}</small>
        </section>
      </div>

      <div className="ws-detail-grid ws-spaced">
        <section className="ws-surface ws-pad">
          <h2>{t.projectsTitle}</h2>
          <p className="ws-muted ws-setting-copy">{t.projectsDesc}</p>
          {linkedProjects.length ? (
            <ul className="ws-linked-list">
              {linkedProjects.map(project => (
                <li key={project.id}>
                  <span>
                    <strong>{project.title}</strong>
                    <small>{project.reference}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="ws-muted ws-setting-copy">{t.noProjects}</p>}
        </section>

        <section className="ws-surface ws-pad">
          <h2>{t.noticesTitle}</h2>
          <p className="ws-muted ws-setting-copy">{t.noticesDesc}</p>
          <h3 className="ws-setting-subtitle">{t.contactTitle}</h3>
          <p className="ws-muted ws-setting-copy">{t.contactDesc}</p>
          <a className="ws-button ws-button-secondary" href="https://wa.me/6281219476385" target="_blank" rel="noreferrer">{t.contactAction}</a>
        </section>
      </div>
    </div>
  );
}
