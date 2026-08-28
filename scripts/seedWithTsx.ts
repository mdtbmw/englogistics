import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_BLOG_POSTS, BLOG_CATEGORIES } from '../src/data/blogData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id
    });

const db = getFirestore(app);

async function main() {
  console.log('Connecting to Live Firebase Firestore (' + serviceAccount.project_id + ')...');
  
  console.log('Seeding ' + INITIAL_BLOG_POSTS.length + ' blog publications...');
  for (const post of INITIAL_BLOG_POSTS) {
    await db.collection('blog_posts').doc(post.id).set(post, { merge: true });
    console.log('  ✓ Seeded post: ' + post.title + ' [' + post.id + ']');
  }

  console.log('Seeding ' + BLOG_CATEGORIES.length + ' blog categories...');
  for (const cat of BLOG_CATEGORIES) {
    await db.collection('blog_categories').doc(cat.id).set(cat, { merge: true });
    console.log('  ✓ Seeded category: ' + cat.name + ' [' + cat.id + ']');
  }

  console.log('\n✅ 100% COMPLETE: All publications & categories are now live in Firestore!');
}

main().catch(console.error);
