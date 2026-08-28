import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
const rulesPath = path.resolve(__dirname, '../firestore.rules');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
const rulesContent = fs.readFileSync(rulesPath, 'utf8');

async function deployRules() {
  console.log('Deploying Firestore rules to project: ' + serviceAccount.project_id + '...');
  
  const auth = new GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ['https://www.googleapis.com/auth/firebase', 'https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = tokenResponse.token;

  if (!token) {
    throw new Error('Failed to obtain Google OAuth access token');
  }

  // 1. Create Ruleset
  const createRulesetUrl = 'https://firebaserules.googleapis.com/v1/projects/' + serviceAccount.project_id + '/rulesets';
  const rulesetRes = await fetch(createRulesetUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: rulesContent
          }
        ]
      }
    })
  });

  const rulesetData = await rulesetRes.json() as any;
  if (!rulesetRes.ok) {
    console.error('Failed to create ruleset:', JSON.stringify(rulesetData, null, 2));
    return;
  }

  console.log('✓ Ruleset created: ' + rulesetData.name);

  // 2. Release Ruleset to Cloud Firestore
  const releaseUrl = 'https://firebaserules.googleapis.com/v1/projects/' + serviceAccount.project_id + '/releases/cloud.firestore?updateMask=rulesetName';
  const releaseRes = await fetch(releaseUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'projects/' + serviceAccount.project_id + '/releases/cloud.firestore',
      rulesetName: rulesetData.name
    })
  });

  const releaseData = await releaseRes.json() as any;
  if (!releaseRes.ok) {
    // If release didn't exist yet, try creating it with POST
    const createReleaseUrl = 'https://firebaserules.googleapis.com/v1/projects/' + serviceAccount.project_id + '/releases';
    const createReleaseRes = await fetch(createReleaseUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'projects/' + serviceAccount.project_id + '/releases/cloud.firestore',
        rulesetName: rulesetData.name
      })
    });
    const createReleaseData = await createReleaseRes.json() as any;
    if (!createReleaseRes.ok) {
      console.error('Failed to release ruleset:', JSON.stringify(createReleaseData, null, 2));
      return;
    }
  }

  console.log('\n🛡️ SUCCESS! Firestore Security Rules are now officially DEPLOYED LIVE to ' + serviceAccount.project_id + '!');
}

deployRules().catch(console.error);
