import 'server-only';
import { transaction } from './db';

export interface PaymentInitiation { requestId:string; amountIdr:number; returnUrl:string }
export interface PaymentSession { providerReference:string; checkoutUrl:string }
export interface VerifiedPaymentEvent { providerEventId:string; providerReference:string; amountIdr:number; status:'confirmed'|'failed' }
export interface PaymentProvider {
  createSession(input:PaymentInitiation):Promise<PaymentSession>;
  verifyWebhook(body:string,headers:Headers):Promise<VerifiedPaymentEvent>;
}

// No provider is approved yet. Priority requests remain reviewable, but payment
// and activation deliberately fail closed until a real verified provider is added.
export function paymentProvider():PaymentProvider {
  throw new Error('Penyedia pembayaran belum dikonfigurasi. Pembayaran prioritas belum tersedia.');
}

// Call only after PaymentProvider.verifyWebhook has validated the provider's
// signature. There is deliberately no public webhook route before onboarding.
export async function applyVerifiedPaymentEvent(provider:string,event:VerifiedPaymentEvent):Promise<boolean> {
  if(!provider||!event.providerEventId||!event.providerReference||!Number.isSafeInteger(event.amountIdr)||event.amountIdr<=0)throw new Error('Peristiwa pembayaran tidak valid.');
  return transaction(async client=>{
    const payment=(await client.query('select * from public.workspace_payments where provider=$1 and provider_reference=$2 for update',[provider,event.providerReference])).rows[0];
    if(!payment||Number(payment.amount_idr)!==event.amountIdr)throw new Error('Referensi atau jumlah pembayaran tidak cocok.');
    if(payment.status==='confirmed')return false;
    const request=(await client.query('select * from public.priority_requests where id=$1 for update',[payment.priority_request_id])).rows[0];
    if(!request||!['approved','payment_unavailable','active'].includes(request.status))throw new Error('Permintaan prioritas tidak dapat menerima pembayaran.');
    const inserted=await client.query('insert into public.payment_webhook_events(provider,provider_event_id,payment_id) values($1,$2,$3) on conflict(provider,provider_event_id) do nothing returning id',[provider,event.providerEventId,payment.id]);
    if(!inserted.rowCount)return false;
    await client.query('update public.workspace_payments set status=$2,confirmed_at=case when $2=$3 then now() else null end where id=$1',[payment.id,event.status,'confirmed']);
    if(event.status==='confirmed'){
      await client.query("update public.priority_requests set status='active',updated_at=now() where id=$1",[request.id]);
      await client.query('insert into public.audit_logs(project_id,event_type,message) values($1,$2,$3)',[request.project_id,'priority_payment_confirmed','Pembayaran layanan prioritas terverifikasi oleh penyedia.']);
    }
    const title=event.status==='confirmed'?'Pembayaran prioritas terkonfirmasi':'Pembayaran prioritas gagal';
    const recipients=await client.query("select id from public.profiles where role='admin' and active=true union select client_user_id as id from public.client_project_access where project_id=$1 and revoked_at is null",[request.project_id]);
    for(const recipient of recipients.rows){const target=recipient.id===request.client_user_id?`/portal/proyek/${request.project_id}`:`/admin/proyek/${request.project_id}`;const notice=await client.query('insert into public.notifications(recipient_user_id,project_id,event_type,title,message,target_path) values($1,$2,$3,$4,$4,$5) returning id',[recipient.id,request.project_id,'priority_payment',title,target]);await client.query("insert into public.notification_outbox(notification_id,channel,status) values($1,'in_app','sent')",[notice.rows[0].id]);}
    return true;
  });
}
