import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, dependencies = {}) {
  const source = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const runtimeModule = { exports: {} };
  vm.runInNewContext('(function(require, module, exports) {' + source + '\n})', { structuredClone, crypto, Date, Intl })(name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency ${name}`);
    return dependencies[name];
  }, runtimeModule, runtimeModule.exports);
  return runtimeModule.exports;
}
const { serviceData } = load('src/lib/serviceData.ts');
const { initialServices } = load('src/features/workspace/workflowCatalog.ts', { '@/lib/serviceData': { serviceData } });
if (initialServices.length !== serviceData.length + 5 || initialServices.some(item => !item.stages.length)) throw new Error('SOP catalog incomplete');
const json = JSON.stringify(initialServices.map(item => ({ slug: item.id, name: item.name, stages: item.stages.map(stage => ({ title: stage.title, description: stage.description, client_label: stage.clientLabel, client_visible: stage.clientVisible, waiting_kind: stage.waitingKind, completion_criteria: stage.completionCriteria, tasks: stage.tasks.map(task => ({ title: task.title, conditional: task.conditional })) })) })));
if (json.includes('$workspace_seed$')) throw new Error('Unsafe seed delimiter');
const sql = `-- Generated from src/features/workspace/workflowCatalog.ts. Do not edit generated rows by hand.\n-- Idempotent: existing services or team-edited templates are never overwritten.\ndo $$\ndeclare service_item jsonb; stage_item jsonb; task_item jsonb; template_uuid uuid; step_uuid uuid; stage_pos integer; task_pos integer;\nbegin\n  for service_item in select value from jsonb_array_elements($workspace_seed$${json}$workspace_seed$::jsonb) loop\n    insert into public.workspace_services(slug,name) values(service_item->>'slug', service_item->>'name') on conflict(slug) do nothing;\n    if not exists(select 1 from public.workflow_templates where service_slug = service_item->>'slug') then\n      insert into public.workflow_templates(service_slug,version,status,legal_review_required,published_at) values(service_item->>'slug',1,'published',true,now()) returning id into template_uuid;\n      stage_pos := 0;\n      for stage_item in select value from jsonb_array_elements(service_item->'stages') loop\n        stage_pos := stage_pos + 1;\n        insert into public.workflow_template_steps(template_id,position,title,description,client_label,client_visible,waiting_kind,completion_criteria)\n        values(template_uuid,stage_pos,stage_item->>'title',stage_item->>'description',stage_item->>'client_label',(stage_item->>'client_visible')::boolean,stage_item->>'waiting_kind',stage_item->>'completion_criteria') returning id into step_uuid;\n        task_pos := 0;\n        for task_item in select value from jsonb_array_elements(stage_item->'tasks') loop\n          task_pos := task_pos + 1;\n          insert into public.workflow_template_tasks(step_id,position,title,conditional) values(step_uuid,task_pos,task_item->>'title',(task_item->>'conditional')::boolean);\n        end loop;\n      end loop;\n    end if;\n  end loop;\n  insert into public.priority_offerings(singleton,enabled,title,description,commitment,limitations,terms,price_idr)\n  values(true,false,'Layanan Prioritas Penanganan VERALEX','Penanganan internal VERALEX sesuai kelayakan layanan.','Tindak lanjut internal sesuai kesepakatan tertulis.','Tidak mempercepat keputusan atau proses instansi pemerintah.','Pembayaran menunggu penyedia resmi.',0) on conflict(singleton) do nothing;\nend $$;\n`;
writeFileSync('supabase/migrations/202610090002_workspace_seed.sql', sql);
console.log(`Generated ${initialServices.length} idempotent service workflows.`);
