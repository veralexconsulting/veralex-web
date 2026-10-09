import assert from 'node:assert/strict';
import test from 'node:test';
import { retainUnclaimedTokens } from '../src/features/workspace/snapshot.ts';

test('refresh keeps only the active one-time link from the same record', () => {
  const previous={accessLinks:[{id:'old',projectId:'project',status:'active',token:'secret-token'}]};
  const same={accessLinks:[{id:'old',projectId:'project',status:'active',token:''}]};
  assert.equal(retainUnclaimedTokens(previous,same).accessLinks[0].token,'secret-token');

  const replaced={accessLinks:[{id:'new',projectId:'project',status:'active',token:''}]};
  assert.equal(retainUnclaimedTokens(previous,replaced).accessLinks[0].token,'');

  const revoked={accessLinks:[{id:'old',projectId:'project',status:'revoked',token:''}]};
  assert.equal(retainUnclaimedTokens(previous,revoked).accessLinks[0].token,'');
});
