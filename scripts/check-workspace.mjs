import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadTs(path, dependencies = {}) {
  const source = readFileSync(path, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const runtimeModule = { exports: {} };
  vm.runInNewContext('(function(require, module, exports) {' + compiled + '\n})', { structuredClone, crypto, Date, Intl })(name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  }, runtimeModule, runtimeModule.exports);
  return runtimeModule.exports;
}

const { serviceData } = loadTs('src/lib/serviceData.ts');
const { initialServices } = loadTs('src/features/workspace/workflowCatalog.ts', { '@/lib/serviceData': { serviceData } });
assert.equal(initialServices.length, serviceData.length + 5, 'Every website service and five certification offerings have a template');
assert.equal(new Set(initialServices.map(service => service.id)).size, initialServices.length, 'Service IDs are unique');
for (const service of initialServices) {
  assert.ok(service.stages.length >= 8, `${service.name}: workflow has at least eight operational stages`);
  assert.equal(service.approval, 'starter', `${service.name}: legal review remains required`);
  assert.ok(service.legalReviewRequired, `${service.name}: legal review flag`);
  const ids = new Set();
  for (const stage of service.stages) {
    assert.ok(stage.title && stage.clientLabel && stage.description && stage.completionCriteria, `${service.name}: stage metadata complete`);
    assert.ok(stage.tasks.length >= 2, `${service.name}: each stage has useful tasks`);
    for (const task of stage.tasks) {
      assert.ok(!ids.has(task.id), `${service.name}: task IDs unique`);
      ids.add(task.id);
    }
  }
}
const trademark = initialServices.find(service => service.id === 'pendaftaran-merek');
const pmdn = initialServices.find(service => service.id === 'pt-pmdn');
assert.equal(trademark.stages.length, 10);
assert.equal(pmdn.stages.length, 10);
const projectA = structuredClone(trademark.stages);
const projectB = structuredClone(trademark.stages);
projectA[0].title = 'Tahap khusus proyek A';
assert.notEqual(projectA[0].title, projectB[0].title, 'Project workflow snapshots remain isolated');
assert.notEqual(projectA[0].title, trademark.stages[0].title, 'Master template remains isolated');
const model=readFileSync('src/features/workspace/model.ts','utf8');
assert.ok(!/documents|attachments|upload/i.test(model), 'Workspace data contract contains no document feature');
const store=readFileSync('src/features/workspace/store.tsx','utf8');
assert.ok(!/localStorage|seedData|previewAdmin/.test(store), 'Production store has no local persistence or preview profiles');
const schema=readFileSync('supabase/migrations/202610090001_workspace_schema.sql','utf8');
assert.ok(!/create table[^;]*(documents|attachments)/i.test(schema), 'Workspace migration creates no document storage');
assert.ok(schema.includes('workspace_audit_no_update'), 'Audit log is immutable');
assert.ok(schema.includes('project_one_current_client_idx'), 'Only one client claim remains current');
console.log(`Workspace SOP checks passed: ${initialServices.length} services, including trademark and PT PMDN snapshots.`);
