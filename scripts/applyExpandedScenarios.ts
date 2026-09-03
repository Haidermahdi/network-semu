import * as fs from 'fs';
import { EXPANDED_STEPS_ALL } from './expandedStepsData';

console.log('Loading networkData.ts...');
let code = fs.readFileSync('./src/data/networkData.ts', 'utf-8');

// For each scenario in EXPANDED_STEPS_ALL, replace its steps: [ ... ]
for (const [scenarioId, steps] of Object.entries(EXPANDED_STEPS_ALL)) {
  const scRegex = new RegExp(`(id:\\s*'${scenarioId}',[\\s\\S]*?steps:\\s*\\[)[\\s\\S]*?(\\n\\s*\\]\\s*\\n\\s*\\})`);
  const match = code.match(scRegex);
  if (!match) {
    console.error(`Could not find scenario: ${scenarioId}`);
    continue;
  }

  const stepsJson = JSON.stringify(steps, null, 8)
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim();

  const formattedSteps = '\n        ' + stepsJson + '\n      ';
  code = code.replace(scRegex, `$1${formattedSteps}$2`);
  console.log(`Updated scenario: ${scenarioId} with ${steps.length} steps.`);
}

fs.writeFileSync('./src/data/networkData.ts', code, 'utf-8');
console.log('Successfully updated networkData.ts!');
