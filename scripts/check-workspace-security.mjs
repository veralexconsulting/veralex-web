import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { workspacePgSsl } from '../src/lib/workspace/pg-ssl.mjs';

const require=createRequire(import.meta.url);
const source=ts.transpileModule(readFileSync('src/lib/workspace/token.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const runtimeModule={exports:{}};
vm.runInNewContext('(function(require,module,exports){'+source+'\n})')((name)=>name==='server-only'?{}:require(name),runtimeModule,runtimeModule.exports);
const {newProjectToken,tokenHash,validTokenShape}=runtimeModule.exports;
const tokens=new Set(Array.from({length:500},()=>newProjectToken()));
assert.equal(tokens.size,500,'random share tokens must be unique in a sample');
for(const token of tokens){assert.equal(token.length,43);assert.equal(validTokenShape(token),true);assert.match(tokenHash(token),/^[a-f0-9]{64}$/);assert.notEqual(tokenHash(token),token);}
assert.equal(validTokenShape('project-id'),false);
assert.equal(workspacePgSsl({ DATABASE_SSL: 'disable' }), false);
assert.equal(workspacePgSsl({ DATABASE_SSL: 'require' }).rejectUnauthorized, false);
assert.throws(() => workspacePgSsl({ DATABASE_SSL: 'verify-full' }), /DATABASE_CA_CERT/);
assert.deepEqual(workspacePgSsl({ DATABASE_SSL: 'verify-full', DATABASE_CA_CERT: 'test\\nca' }), { rejectUnauthorized: true, ca: 'test\nca' });
console.log('Workspace token checks passed: 500 unique 256-bit tokens and SHA-256 hashes.');
