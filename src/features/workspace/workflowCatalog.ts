import { serviceData } from '@/lib/serviceData';
import type { Service, Stage, Task } from './model';

// Operational starters for product review. These are not official legal checklists.
// A question mark marks a conditional task, not a required successful outcome.
type StageSpec = readonly [title: string, ...tasks: string[]];
const specs: Record<string, StageSpec[]> = {
  'pendaftaran-merek': [
    ['Konsultasi dan konfirmasi permohonan', 'Konfirmasi tujuan dan jenis pemohon', 'Sepakati ruang lingkup penanganan'],
    ['Pengumpulan persyaratan', 'Catat status penerimaan persyaratan melalui kanal eksternal', 'Periksa kelengkapan awal tanpa menyimpan berkas'],
    ['Pengecekan awal merek dan klasifikasi', 'Telusuri merek terkait', 'Tinjau kelas dan uraian barang atau jasa', 'Sampaikan risiko awal kepada klien'],
    ['Persiapan permohonan', 'Verifikasi data pemohon dan representasi merek', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan ke DJKI', 'Siapkan pengajuan pada kanal resmi', 'Catat nomor permohonan dan status pengajuan'],
    ['Pemeriksaan formalitas', 'Pantau hasil pemeriksaan formalitas', '?Tindak lanjuti permintaan perbaikan'],
    ['Pengumuman dan keberatan', 'Pantau pengumuman resmi', '?Catat keberatan dan tindak lanjut bila ada'],
    ['Pemeriksaan substantif', 'Pantau pemeriksaan substantif', '?Tindak lanjuti pemberitahuan atau tanggapan yang diperlukan'],
    ['Keputusan permohonan', 'Catat hasil resmi', '?Bahas pilihan tindak lanjut bila hasil tidak sesuai harapan'],
    ['Penyerahan hasil', 'Konfirmasi hasil telah disampaikan melalui proses eksternal', 'Tutup proyek setelah tindak lanjut selesai'],
  ],
  'perpanjangan-merek': [
    ['Verifikasi merek terdaftar', 'Konfirmasi identitas merek', 'Periksa status pendaftaran'],
    ['Pemeriksaan kelayakan perpanjangan', 'Tinjau masa perlindungan', 'Konfirmasi jalur yang sesuai'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan permohonan', 'Verifikasi data pemegang hak', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan perpanjangan', 'Ajukan melalui kanal resmi', 'Catat referensi pengajuan'],
    ['Pemantauan dan tindak lanjut', 'Pantau status permohonan', '?Tindak lanjuti koreksi bila diminta'],
    ['Konfirmasi hasil', 'Catat keputusan resmi', '?Bahas tindak lanjut bila belum disetujui'],
    ['Penyerahan hasil', 'Sampaikan hasil melalui proses eksternal', 'Tutup proyek'],
  ],
  'pengalihan-merek': [
    ['Verifikasi merek dan pihak terkait', 'Konfirmasi merek yang dialihkan', 'Verifikasi pihak lama dan baru'],
    ['Pemeriksaan dasar pengalihan', 'Konfirmasi dasar transaksi pengalihan', 'Tinjau ruang lingkup hak yang dialihkan'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan pencatatan', 'Verifikasi data pencatatan', 'Konfirmasi kesiapan permohonan'],
    ['Pengajuan ke DJKI', 'Ajukan pencatatan pada kanal resmi', 'Catat referensi pengajuan'],
    ['Pemeriksaan dan tindak lanjut', 'Pantau pemeriksaan', '?Tindak lanjuti permintaan tambahan'],
    ['Konfirmasi pencatatan', 'Catat hasil resmi', '?Bahas tindak lanjut bila pencatatan tertunda'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'hak-cipta': [
    ['Identifikasi jenis ciptaan', 'Konfirmasi jenis karya', 'Konfirmasi tujuan pencatatan'],
    ['Verifikasi para pihak', 'Konfirmasi pencipta', 'Konfirmasi pemegang hak'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan permohonan', 'Verifikasi metadata ciptaan', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan pencatatan', 'Ajukan melalui kanal resmi', 'Catat nomor atau referensi pengajuan'],
    ['Pemeriksaan dan perbaikan', 'Pantau status pemeriksaan', '?Tindak lanjuti permintaan perbaikan'],
    ['Konfirmasi hasil', 'Catat hasil resmi', '?Bahas penolakan atau koreksi bila ada'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'desain-industri': [
    ['Konsultasi objek desain', 'Identifikasi produk dan desain', 'Konfirmasi pemohon dan pendesain'],
    ['Pemeriksaan awal', 'Tinjau persyaratan awal', 'Bahas potensi kendala'],
    ['Pengumpulan persyaratan', 'Catat penerimaan representasi desain di luar portal', 'Periksa kelengkapan'],
    ['Persiapan permohonan', 'Verifikasi data dan klasifikasi', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan', 'Ajukan melalui kanal resmi', 'Catat referensi pengajuan'],
    ['Pemeriksaan formalitas', 'Pantau pemeriksaan formalitas', '?Tindak lanjuti koreksi'],
    ['Pengumuman', 'Pantau pengumuman bila berlaku', '?Catat keberatan dan tindak lanjut'],
    ['Pemeriksaan lanjutan', 'Pantau tahap lanjutan bila berlaku', '?Tanggapi permintaan tambahan'],
    ['Keputusan', 'Catat hasil resmi', '?Bahas tindak lanjut bila hasil tidak sesuai harapan'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'pt-perorangan': [
    ['Konsultasi kelayakan', 'Konfirmasi bentuk usaha yang diinginkan', 'Tinjau kecocokan jalur perseroan perorangan'],
    ['Konfirmasi nama dan usaha', 'Konfirmasi nama perseroan', 'Tinjau kegiatan usaha'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan pendirian', 'Verifikasi data pendirian', 'Konfirmasi kesiapan pendaftaran'],
    ['Pendaftaran melalui AHU', 'Lakukan pendaftaran pada kanal resmi', 'Catat status pendaftaran'],
    ['Verifikasi hasil', 'Periksa hasil pendaftaran', '?Tindak lanjuti koreksi'],
    ['NIB/OSS sesuai ruang lingkup', 'Konfirmasi kebutuhan NIB dan izin', '?Lakukan tindak lanjut OSS yang disepakati'],
    ['Pemeriksaan akhir', 'Cocokkan hasil dengan ruang lingkup layanan', 'Konfirmasi kesiapan penyerahan'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'pendirian-cv': [
    ['Konsultasi bentuk usaha', 'Konfirmasi kebutuhan CV', 'Sepakati ruang lingkup layanan'],
    ['Nama dan struktur sekutu', 'Konfirmasi nama CV', 'Konfirmasi sekutu aktif dan pasif'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Koordinasi akta notaris', 'Koordinasikan rancangan akta', 'Tinjau data usaha dan para pihak'],
    ['Penandatanganan akta', 'Konfirmasi jadwal penandatanganan', 'Catat bahwa penandatanganan selesai'],
    ['Pendaftaran AHU/SABU', 'Koordinasikan pendaftaran melalui kanal resmi', 'Catat hasil pendaftaran'],
    ['NIB/OSS sesuai ruang lingkup', 'Konfirmasi kebutuhan izin berusaha', '?Tindak lanjuti OSS yang disepakati'],
    ['Pemeriksaan hasil', 'Cocokkan hasil dengan ruang lingkup layanan', '?Tindak lanjuti koreksi'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'pt-pmdn': [
    ['Konsultasi struktur perusahaan', 'Konfirmasi tujuan pendirian', 'Tinjau struktur awal perusahaan'],
    ['Nama, pengurus, modal, dan KBLI', 'Konfirmasi nama dan pemegang saham', 'Tinjau pengurus, modal, dan KBLI'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan akta', 'Koordinasikan rancangan akta', 'Verifikasi data pendirian'],
    ['Penandatanganan notaris', 'Koordinasikan jadwal', 'Catat penandatanganan selesai'],
    ['Pengesahan AHU', 'Koordinasikan pengajuan pengesahan', 'Catat hasil resmi'],
    ['NPWP dan NIB/OSS', 'Konfirmasi cakupan administrasi perpajakan', 'Tindak lanjuti NIB/OSS sesuai kesepakatan'],
    ['Perizinan berbasis risiko', 'Tinjau kebutuhan sesuai KBLI', '?Tindak lanjuti izin sektoral bila berlaku'],
    ['Pemeriksaan akhir', 'Cocokkan hasil dengan ruang lingkup', '?Tindak lanjuti koreksi'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'pt-pma': [
    ['Konsultasi investasi asing', 'Konfirmasi rencana investasi', 'Tinjau kelayakan bidang usaha awal'],
    ['KBLI dan kepemilikan', 'Tinjau KBLI serta kepemilikan asing', 'Catat persyaratan investasi yang perlu dikonfirmasi'],
    ['Struktur dan modal', 'Konfirmasi pemegang saham dan pengurus', 'Konfirmasi struktur modal'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Koordinasi akta notaris', 'Koordinasikan rancangan akta', 'Catat penandatanganan selesai'],
    ['Pengesahan AHU', 'Koordinasikan pengesahan badan hukum', 'Catat hasil resmi'],
    ['Administrasi perpajakan', 'Konfirmasi cakupan layanan', '?Tindak lanjuti administrasi yang disepakati'],
    ['NIB/OSS dan investasi', 'Tinjau kebutuhan OSS', 'Catat hasil pengurusan yang disepakati'],
    ['Persyaratan sektoral', 'Periksa kebutuhan sektoral', '?Tindak lanjuti izin tambahan bila berlaku'],
    ['Pemeriksaan akhir', 'Cocokkan hasil dengan ruang lingkup', '?Tindak lanjuti koreksi'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'itas-investor': [
    ['Konsultasi izin tinggal', 'Konfirmasi tujuan dan jenis izin', 'Tinjau kecocokan jalur investor'],
    ['Verifikasi sponsor', 'Konfirmasi perusahaan penjamin', 'Tinjau status dasar sponsor'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Pemeriksaan kelengkapan', 'Cocokkan data permohonan', '?Minta perbaikan melalui kanal eksternal'],
    ['Persiapan imigrasi', 'Siapkan data pengajuan', 'Konfirmasi kesiapan sponsor dan pemohon'],
    ['Pengajuan resmi', 'Ajukan melalui kanal resmi yang sesuai', 'Catat nomor permohonan'],
    ['Pemantauan pemeriksaan', 'Pantau status resmi', '?Tindak lanjuti permintaan tambahan'],
    ['Keputusan dan penerbitan', 'Catat hasil resmi', '?Bahas tindak lanjut bila belum disetujui'],
    ['Penyerahan informasi hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'kitas-kerja': [
    ['Konsultasi tenaga kerja asing', 'Konfirmasi kebutuhan posisi', 'Sepakati ruang lingkup layanan'],
    ['Verifikasi sponsor dan posisi', 'Konfirmasi perusahaan sponsor', 'Tinjau jabatan dan lokasi kerja'],
    ['Persyaratan ketenagakerjaan', 'Periksa jalur ketenagakerjaan yang berlaku', 'Catat kelengkapan proses eksternal'],
    ['Persetujuan ketenagakerjaan', 'Koordinasikan proses yang berlaku', '?Tindak lanjuti koreksi atau persetujuan tambahan'],
    ['Persiapan keimigrasian', 'Verifikasi data untuk izin terkait', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan izin/visa', 'Ajukan melalui kanal resmi', 'Catat referensi pengajuan'],
    ['Pemantauan pemeriksaan', 'Pantau status resmi', '?Tindak lanjuti permintaan tambahan'],
    ['Kedatangan/izin tinggal', 'Konfirmasi prosedur yang berlaku', '?Koordinasikan tindak lanjut kedatangan'],
    ['Konfirmasi hasil', 'Catat hasil resmi', '?Bahas tindak lanjut bila hasil tertunda'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  visa: [
    ['Tujuan perjalanan', 'Konfirmasi tujuan kunjungan', 'Tinjau kebutuhan sponsor'],
    ['Kategori visa', 'Periksa indeks visa resmi yang sesuai', 'Konfirmasi kategori bersama klien'],
    ['Verifikasi persyaratan', 'Catat penerimaan data melalui kanal eksternal', 'Periksa kelengkapan'],
    ['Persiapan permohonan', 'Verifikasi data permohonan', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan resmi', 'Ajukan melalui kanal resmi', 'Catat referensi pengajuan'],
    ['Pemantauan dan tindak lanjut', 'Pantau status resmi', '?Tindak lanjuti permintaan tambahan'],
    ['Keputusan', 'Catat hasil resmi', '?Bahas langkah berikutnya bila permohonan tidak disetujui'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'sertifikasi-halal': [
    ['Identifikasi produk dan skema', 'Konfirmasi kategori produk', 'Tinjau skema sertifikasi yang sesuai'],
    ['Kelayakan skema', 'Periksa jalur reguler atau self-declare', 'Konfirmasi pilihan dengan klien'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan data', 'Koordinasikan data proses produk', 'Konfirmasi kesiapan permohonan'],
    ['Pengajuan resmi', 'Ajukan melalui sistem yang berlaku', 'Catat nomor permohonan'],
    ['Verifikasi/pemeriksaan', 'Pantau tahap sesuai skema', '?Tindak lanjuti temuan'],
    ['Penetapan/penerbitan', 'Pantau keputusan resmi', '?Tindak lanjuti permintaan tambahan'],
    ['Konfirmasi sertifikat', 'Catat hasil resmi', 'Konfirmasi status kepada klien'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'izin-bpom': [
    ['Jenis produk dan jalur', 'Identifikasi kategori produk', 'Tentukan jalur registrasi yang perlu ditinjau'],
    ['Kebutuhan izin edar', 'Tinjau kewajiban registrasi', 'Konfirmasi cakupan layanan'],
    ['Legalitas usaha dan sarana', 'Periksa status persyaratan usaha di luar portal', '?Catat kebutuhan tindak lanjut sarana'],
    ['Persyaratan produk', 'Catat penerimaan data produk di luar portal', 'Periksa kelengkapan'],
    ['Label dan informasi', 'Tinjau label dan klaim produk melalui proses eksternal', '?Catat koreksi yang diperlukan'],
    ['Persiapan permohonan', 'Verifikasi data pendaftaran', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan resmi', 'Ajukan melalui sistem sesuai kategori', 'Catat referensi pengajuan'],
    ['Biaya resmi bila berlaku', 'Konfirmasi tagihan pada sistem resmi', '?Catat status pembayaran resmi'],
    ['Evaluasi dan tindak lanjut', 'Pantau evaluasi resmi', '?Tindak lanjuti permintaan tambahan'],
    ['Keputusan/penerbitan', 'Catat hasil resmi', '?Bahas tindak lanjut bila belum disetujui'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'sertifikasi-sni': [
    ['Identifikasi produk dan standar', 'Konfirmasi jenis produk', 'Tinjau standar yang relevan'],
    ['Status wajib atau sukarela', 'Periksa penerapan SNI', 'Konfirmasi jalur yang sesuai'],
    ['Skema dan lembaga', 'Tentukan skema sertifikasi', 'Konfirmasi lembaga terkait'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan permohonan', 'Verifikasi data permohonan', 'Konfirmasi kesiapan pengajuan'],
    ['Evaluasi/pengujian/audit', 'Koordinasikan pemeriksaan sesuai skema', '?Catat temuan'],
    ['Tindak lanjut temuan', '?Koordinasikan tindakan koreksi', 'Konfirmasi penyelesaian bila berlaku'],
    ['Keputusan sertifikasi', 'Catat hasil resmi', '?Bahas tindak lanjut bila belum disetujui'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'sertifikasi-k3l': [
    ['Identifikasi produk', 'Konfirmasi jenis produk', 'Tinjau kewajiban registrasi'],
    ['Klasifikasi dan persyaratan', 'Tinjau klasifikasi', 'Konfirmasi persyaratan yang berlaku'],
    ['Pengumpulan persyaratan', 'Catat penerimaan persyaratan di luar portal', 'Periksa kelengkapan'],
    ['Persiapan registrasi', 'Verifikasi data registrasi', 'Konfirmasi kesiapan pengajuan'],
    ['Pengajuan resmi', 'Ajukan melalui kanal yang berlaku', 'Catat referensi pengajuan'],
    ['Evaluasi dan tindak lanjut', 'Pantau evaluasi', '?Tindak lanjuti koreksi'],
    ['Konfirmasi hasil', 'Catat hasil resmi', '?Bahas hasil yang belum sesuai'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
  'sertifikasi-postel': [
    ['Identifikasi perangkat', 'Konfirmasi jenis perangkat', 'Tinjau kewajiban sertifikasi'],
    ['Klasifikasi perangkat', 'Tinjau fitur komunikasi', 'Konfirmasi jalur sertifikasi'],
    ['Persyaratan pemohon dan produk', 'Catat penerimaan data di luar portal', 'Periksa kelengkapan'],
    ['Kebutuhan pengujian', 'Tentukan kebutuhan uji', 'Koordinasikan lembaga pengujian'],
    ['Persiapan permohonan', 'Verifikasi data permohonan', 'Konfirmasi kesiapan pengajuan'],
    ['Pengujian/evaluasi', 'Pantau proses pengujian', '?Tindak lanjuti temuan'],
    ['Pemrosesan sertifikasi', 'Ajukan atau pantau proses resmi', 'Catat referensi pengajuan'],
    ['Tindak lanjut temuan', '?Koordinasikan perbaikan', 'Konfirmasi hasil tindak lanjut'],
    ['Keputusan sertifikasi', 'Catat hasil resmi', '?Bahas langkah berikutnya bila belum disetujui'],
    ['Penyerahan hasil', 'Sampaikan hasil di luar portal', 'Tutup proyek'],
  ],
};

const productServices = [
  { slug: 'sertifikasi-halal', title: 'Sertifikasi Halal' },
  { slug: 'izin-bpom', title: 'Registrasi BPOM' },
  { slug: 'sertifikasi-sni', title: 'Sertifikasi SNI' },
  { slug: 'sertifikasi-k3l', title: 'Sertifikasi K3L' },
  { slug: 'sertifikasi-postel', title: 'Sertifikasi Alat Telekomunikasi / Perangkat Digital' },
];

function templateKey(slug: string): string {
  if (slug.startsWith('itas-investor-')) return 'itas-investor';
  if (slug.startsWith('visa-')) return 'visa';
  return slug;
}

function makeStages(serviceId: string, items: StageSpec[]): Stage[] {
  return items.map(([title, ...taskNames], stageIndex) => {
    const tasks: Task[] = taskNames.map((raw, taskIndex) => ({
      id: `${serviceId}-s${stageIndex + 1}-t${taskIndex + 1}`,
      title: raw.replace(/^\?/, ''),
      status: 'pending',
      conditional: raw.startsWith('?'),
    }));
    const external = /pengajuan|pemeriksaan|pengumuman|evaluasi|keputusan|penerbitan|pengesahan|sertifikasi/i.test(title);
    const client = /persyaratan|pengumpulan|konfirmasi/i.test(title);
    return {
      id: `${serviceId}-s${stageIndex + 1}`,
      title,
      description: taskNames.map(item => item.replace(/^\?/, '')).join(' · '),
      clientLabel: title,
      clientVisible: true,
      waitingKind: external ? 'institution' : client ? 'client' : 'internal',
      completionCriteria: 'Tugas wajib selesai; pengecualian dicatat dengan alasan.',
      tasks,
    };
  });
}

const catalog: { id: string; name: string }[] = [
  ...serviceData.map(item => ({ id: item.slug, name: item.title })),
  ...productServices.map(item => ({ id: item.slug, name: item.title })),
];
export const initialServices: Service[] = catalog.map(item => ({
  id: item.id, name: item.name, approval: 'starter', version: 1,
  legalReviewRequired: true, stages: makeStages(item.id, specs[templateKey(item.id)]),
}));
