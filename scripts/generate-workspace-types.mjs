import { readFileSync, writeFileSync } from 'node:fs';

const migration=readFileSync('supabase/migrations/202610090001_workspace_schema.sql','utf8');
const tables=[...migration.matchAll(/create table if not exists public\.(\w+)\s*\(([\s\S]*?)\n\);/g)];
const typeFor=sql=>/^text\[\]/.test(sql)?'string[]':/^(uuid|text|char\(|date|timestamptz)/.test(sql)?'string':/^(integer|bigint)/.test(sql)?'number':/^boolean/.test(sql)?'boolean':'unknown';
const rendered=tables.map(([,name,body])=>{
  const fields=body.split('\n').flatMap(line=>{
    const match=line.trim().match(/^(\w+)\s+(uuid|text\[\]|text|char\(\d+\)|integer|bigint|boolean|date|timestamptz)(.*?)(?:,)?$/);
    if(!match)return [];
    const [,column,sqlType,rest]=match;
    const type=typeFor(sqlType);
    return `      ${column}: ${type}${/not null|primary key/i.test(rest)?'':' | null'};`;
  });
  return `    ${name}: {\n      Row: {\n${fields.join('\n')}\n      };\n    };`;
});
writeFileSync('src/types/workspace-database.ts',`// Generated from 202610090001_workspace_schema.sql by scripts/generate-workspace-types.mjs.\n// Regenerate after migration edits. Live Supabase types should replace this schema-derived file after deployment.\nexport interface WorkspaceDatabase {\n  public: {\n    Tables: {\n${rendered.join('\n')}\n    };\n  };\n}\n`);
console.log(`Generated row types for ${tables.length} workspace tables.`);
