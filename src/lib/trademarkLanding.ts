import type { Lang } from '@/lib/translations';

export const trademarkLandingCopy: Record<Lang, {
    value: string;
    priceNote: string;
    cta: string;
}> = {
    id: {
        value: 'Pengecekan awal, pemilihan kelas, pengajuan ke DJKI, dan pemantauan proses dalam satu layanan.',
        priceNote: 'Harga promo per kelas barang/jasa. Biaya resmi dan cakupan akhir dikonfirmasi sebelum pemesanan.',
        cta: 'Konsultasi Pendaftaran Merek',
    },
    en: {
        value: 'From an initial search and class selection to DJKI filing and application monitoring.',
        priceNote: 'Promotional fee per class. Applicable official fees and final scope are confirmed before ordering.',
        cta: 'Consult About Trademark Registration',
    },
    zh: {
        value: '从前期检索、类别选择到向 DJKI 提交申请及跟进进度。',
        priceNote: '优惠价按每个商品／服务类别计算；官方费用及最终服务范围将在下单前确认。',
        cta: '咨询商标注册',
    },
};
