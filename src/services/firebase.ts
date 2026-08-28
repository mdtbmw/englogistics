import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Firestore,
  onSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from 'firebase/auth';
import { BlogPost, BlogCategory, BlogComment, FirebaseConfigState, BookingRecord, DailyAnalyticsRecord } from '../types';
import { INITIAL_BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogData';
import { 
  recordDailyArticleView, 
  recordDailyBooking, 
  recordDailyLike, 
  recordDailySubscriber, 
  recordDailyDwellSeconds,
  fetchDailyAnalytics as fetchDailyAnalyticsInternal,
  exportAnalyticsCsv
} from './analyticsService';

const LOCAL_POSTS_KEY = 'engraced_blog_posts_v1';
const LOCAL_CATEGORIES_KEY = 'engraced_blog_categories_v1';
const LOCAL_SUBSCRIBERS_KEY = 'engraced_subscribers_v1';
const LOCAL_BOOKINGS_KEY = 'engraced_logistics_bookings_v2';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

export const getDefaultFirebaseConfig = (): FirebaseConfigState => {
  const envKey = import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBt8iKTwmrqNPZdCi6o6daQ8v1l6GzEla0';
  const envAuth = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'engracedlogistics-6b51c.firebaseapp.com';
  const envProject = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'engracedlogistics-6b51c';
  const envBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'engracedlogistics-6b51c.firebasestorage.app';
  const envSender = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '254344071705';
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID || '1:254344071705:web:d85aae36426bbfa8163888';

  const hasEnv = Boolean(envKey && envProject);
  return {
    apiKey: envKey,
    authDomain: envAuth,
    projectId: envProject,
    storageBucket: envBucket,
    messagingSenderId: envSender,
    appId: envAppId,
    isConnected: hasEnv,
    usingMock: !hasEnv,
  };
};

export const getFirebaseConfig = (): FirebaseConfigState => getDefaultFirebaseConfig();

export const saveFirebaseConfig = (_config: Partial<FirebaseConfigState>): void => {
  // Stored in .env in production
  initFirebase();
};

export const initFirebase = () => {
  const config = getDefaultFirebaseConfig();
  if (config.apiKey && config.projectId) {
    try {
      if (!getApps().length) {
        firebaseApp = initializeApp({
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          storageBucket: config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId,
        });
      } else {
        firebaseApp = getApp();
      }
      firestoreDb = getFirestore(firebaseApp);
      firebaseAuth = getAuth(firebaseApp);

      // Auto-seed initial publications to Firestore if empty
      seedFirestoreIfEmpty();

      return { app: firebaseApp, db: firestoreDb, auth: firebaseAuth, isConnected: true };
    } catch (err) {
      console.warn('Firebase init failed, using offline fallback', err);
      firestoreDb = null;
      firebaseAuth = null;
    }
  }
  return { app: null, db: null, auth: null, isConnected: false };
};

// Seed initial posts & categories to live Firestore if the collection is empty
export const seedFirestoreIfEmpty = async () => {
  if (!firestoreDb) return;
  try {
    const snap = await getDocs(collection(firestoreDb, 'blog_posts'));
    if (snap.empty) {
      console.log('Seeding initial publications to live Firestore...');
      for (const post of INITIAL_BLOG_POSTS) {
        await setDoc(doc(firestoreDb, 'blog_posts', post.id), post);
      }
      for (const cat of BLOG_CATEGORIES) {
        await setDoc(doc(firestoreDb, 'blog_categories', cat.id), cat);
      }
      console.log('Successfully seeded live Firestore database!');
    }
  } catch (e) {
    console.warn('Firestore auto-seed notice (check security rules if new project):', e);
  }
};

// Auto-initialize on module load
initFirebase();

// -------------------------------------------------------------
// LIVE FIREBASE AUTHENTICATION SERVICES
// -------------------------------------------------------------

export const loginAdmin = async (
  email: string, 
  pinOrPass: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  // Support both full password and PIN conversion for ease of executive use
  const password = pinOrPass.length < 6 ? `eng_${pinOrPass}_secure2026` : pinOrPass;

  if (firebaseAuth) {
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { success: true, user: cred.user };
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Verify credentials.';
      // Friendly messages for common Firebase error codes
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid administrator email or password. If this is your first time, use Admin Sign Up to register.' };
      }
      if (err?.code === 'auth/wrong-password') {
        return { success: false, error: 'Incorrect administrator password or PIN.' };
      }
      return { success: false, error: msg };
    }
  }

  return { success: false, error: 'Firebase Auth is not initialized.' };
};

export const registerAdmin = async (
  email: string, 
  pinOrPass: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  const password = pinOrPass.length < 6 ? `eng_${pinOrPass}_secure2026` : pinOrPass;

  if (firebaseAuth) {
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return { success: true, user: cred.user };
    } catch (err: any) {
      const msg = err?.message || 'Registration failed.';
      if (err?.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An admin account with this email already exists. Please Sign In instead.' };
      }
      if (err?.code === 'auth/weak-password') {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      return { success: false, error: msg };
    }
  }

  return { success: false, error: 'Firebase Auth is not initialized.' };
};

export const logoutAdmin = async (): Promise<void> => {
  if (firebaseAuth) {
    try {
      await signOut(firebaseAuth);
    } catch (e) {
      console.warn('Sign out error', e);
    }
  }
  sessionStorage.removeItem('eng_admin_auth');
};

export const onAdminAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  if (firebaseAuth) {
    return onAuthStateChanged(firebaseAuth, callback);
  }
  callback(null);
  return () => {};
};

export const getCurrentAdminUser = (): User | null => {
  return firebaseAuth?.currentUser || null;
};

export const testFirebaseConnection = async (customConfig?: Partial<FirebaseConfigState>): Promise<{ success: boolean; message: string }> => {
  const target = customConfig ? { ...getDefaultFirebaseConfig(), ...customConfig } : getDefaultFirebaseConfig();
  if (!target.apiKey || !target.projectId) {
    return {
      success: false,
      message: 'Missing API Key or Project ID. Fill in the fields or use the Offline Mock Mode.',
    };
  }

  try {
    const tempApp = initializeApp(
      {
        apiKey: target.apiKey,
        authDomain: target.authDomain,
        projectId: target.projectId,
        storageBucket: target.storageBucket,
        messagingSenderId: target.messagingSenderId,
        appId: target.appId,
      },
      'test-connection-' + Date.now()
    );
    const db = getFirestore(tempApp);
    // Simple ping to test connectivity
    await getDocs(query(collection(db, 'ping')));
    return {
      success: true,
      message: `Successfully connected to Firebase Project: ${target.projectId}`,
    };
  } catch (err: any) {
    // If it's permission-denied or resource-exhausted, it still reached Firebase!
    if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
      return {
        success: true,
        message: `Connected to Firebase (${target.projectId}). Note: Set Firestore Security Rules to allow read/write.`,
      };
    }
    return {
      success: false,
      message: `Firebase Connection Failed: ${err?.message || 'Check your API Key and Project ID.'}`,
    };
  }
};

// Local Storage caching helpers for instant offline fallback
const getLocalPosts = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
      return INITIAL_BLOG_POSTS;
    }
    const parsed: BlogPost[] = JSON.parse(raw);
    const missing = INITIAL_BLOG_POSTS.filter(
      (initP) => !parsed.some((p) => p.slug === initP.slug || p.id === initP.id)
    );
    if (missing.length > 0) {
      const merged = [...parsed, ...missing];
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (e) {
    return INITIAL_BLOG_POSTS;
  }
};

const setLocalPosts = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

// -------------------------------------------------------------
// POSTS CRUD OPERATIONS
// -------------------------------------------------------------

export const fetchPosts = async (): Promise<BlogPost[]> => {
  if (firestoreDb) {
    try {
      const q = query(collection(firestoreDb, 'blog_posts'), orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const posts: BlogPost[] = [];
        snapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        setLocalPosts(posts); // sync cache
        return posts;
      }
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local store', e);
    }
  }
  return getLocalPosts();
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await fetchPosts();
  return posts.find((p) => p.slug === slug || p.id === slug) || null;
};

export const savePost = async (post: BlogPost): Promise<BlogPost> => {
  const timestamp = new Date().toISOString();
  const postToSave: BlogPost = {
    ...post,
    id: post.id || `post-${Date.now()}`,
    updatedAt: timestamp,
    publishedAt: post.publishedAt || timestamp,
  };

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'blog_posts', postToSave.id), postToSave);
    } catch (e) {
      console.warn('Firestore save failed, saving locally', e);
    }
  }

  // Always update local cache
  const localPosts = getLocalPosts();
  const index = localPosts.findIndex((p) => p.id === postToSave.id);
  if (index >= 0) {
    localPosts[index] = postToSave;
  } else {
    localPosts.unshift(postToSave);
  }
  setLocalPosts(localPosts);
  return postToSave;
};

export const deletePost = async (id: string): Promise<boolean> => {
  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'blog_posts', id));
    } catch (e) {
      console.warn('Firestore delete failed, deleting locally', e);
    }
  }

  const localPosts = getLocalPosts().filter((p) => p.id !== id);
  setLocalPosts(localPosts);
  return true;
};

export const incrementPostViews = async (idOrSlug: string): Promise<void> => {
  const localPosts = getLocalPosts();
  const post = localPosts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (post) {
    post.viewsCount = (post.viewsCount || 0) + 1;
    setLocalPosts(localPosts);

    // Record in daily analytics aggregation
    recordDailyArticleView(post, firestoreDb);

    if (firestoreDb && post.id) {
      try {
        await setDoc(doc(firestoreDb, 'blog_posts', post.id), { viewsCount: post.viewsCount }, { merge: true });
      } catch (e) {
        // ignore view count background sync error
      }
    }
  }
};

export const addComment = async (
  postId: string, 
  comment: Omit<BlogComment, 'id' | 'createdAt'>
): Promise<BlogComment> => {
  const newComment: BlogComment = {
    ...comment,
    id: `c-${Date.now()}`,
    createdAt: new Date().toISOString(),
    approved: true,
  };

  const localPosts = getLocalPosts();
  const post = localPosts.find((p) => p.id === postId || p.slug === postId);
  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    setLocalPosts(localPosts);

    if (firestoreDb && post.id) {
      try {
        await setDoc(doc(firestoreDb, 'blog_posts', post.id), { comments: post.comments }, { merge: true });
      } catch (e) {
        console.warn('Firestore comment sync error', e);
      }
    }
  }
  return newComment;
};

export const subscribeNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    const raw = localStorage.getItem(LOCAL_SUBSCRIBERS_KEY) || '[]';
    const list: string[] = JSON.parse(raw);
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem(LOCAL_SUBSCRIBERS_KEY, JSON.stringify(list));
    }

    // Record in daily analytics aggregation
    recordDailySubscriber(firestoreDb);

    if (firestoreDb) {
      await setDoc(doc(firestoreDb, 'subscribers', email.replace(/[^a-zA-Z0-9]/g, '_')), {
        email,
        subscribedAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      message: 'Thank you for subscribing to Engraced Executive Insights!',
    };
  } catch (err: any) {
    return {
      success: true,
      message: 'Subscribed successfully (saved locally)!',
    };
  }
};

export const likePost = async (idOrSlug: string): Promise<number> => {
  const localPosts = getLocalPosts();
  const post = localPosts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (post) {
    post.likesCount = (post.likesCount || 0) + 1;
    setLocalPosts(localPosts);

    // Record in daily analytics aggregation
    recordDailyLike(firestoreDb);

    if (firestoreDb && post.id) {
      try {
        await setDoc(doc(firestoreDb, 'blog_posts', post.id), { likesCount: post.likesCount }, { merge: true });
      } catch (e) {}
    }
    return post.likesCount;
  }
  return 0;
};

const LOCAL_BOOKMARKS_KEY = 'engraced_bookmarked_slugs_v1';

export const getBookmarkedSlugs = (): string[] => {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBookmarkSlug = (slug: string): boolean => {
  try {
    const current = getBookmarkedSlugs();
    let updated: string[];
    let isBookmarked: boolean;
    if (current.includes(slug)) {
      updated = current.filter((s) => s !== slug);
      isBookmarked = false;
    } else {
      updated = [...current, slug];
      isBookmarked = true;
    }
    localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(updated));
    return isBookmarked;
  } catch (e) {
    return false;
  }
};

export const fetchCategories = async (): Promise<BlogCategory[]> => {
  try {
    const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(BLOG_CATEGORIES));
      return BLOG_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return BLOG_CATEGORIES;
  }
};

export const saveCategory = async (category: BlogCategory): Promise<BlogCategory[]> => {
  const cats = await fetchCategories();
  const idx = cats.findIndex((c) => c.id === category.id || c.slug === category.slug);
  if (idx >= 0) {
    cats[idx] = category;
  } else {
    cats.push(category);
  }
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(cats));
  return cats;
};

export const deleteCategory = async (slug: string): Promise<BlogCategory[]> => {
  const cats = await fetchCategories();
  const updated = cats.filter((c) => c.slug !== slug && c.id !== slug);
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
};

export const fetchSubscribers = async (): Promise<string[]> => {
  try {
    if (firestoreDb) {
      const snap = await getDocs(collection(firestoreDb, 'subscribers'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data().email).filter(Boolean);
      }
    }
  } catch (e) {}

  try {
    const raw = localStorage.getItem(LOCAL_SUBSCRIBERS_KEY) || '[]';
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveBooking = async (booking: BookingRecord): Promise<BookingRecord> => {
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'bookings', booking.id), booking);
    } catch (e) {
      console.warn('Firestore booking save failed, saving locally', e);
    }
  }

  // Record in daily analytics aggregation
  recordDailyBooking(firestoreDb);

  const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]';
  const list: BookingRecord[] = JSON.parse(raw);
  const idx = list.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    list[idx] = booking;
  } else {
    list.unshift(booking);
  }
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(list));
  return booking;
};

export const fetchBookings = async (): Promise<BookingRecord[]> => {
  if (firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, 'bookings'));
      if (!snap.empty) {
        const cloudList = snap.docs.map((d) => d.data() as BookingRecord);
        localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(cloudList));
        return cloudList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (e) {
      console.warn('Firestore booking fetch failed, using local cache', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]';
    const list: BookingRecord[] = JSON.parse(raw);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    return [];
  }
};

export const updateBookingStatus = async (id: string, status: BookingRecord['status']): Promise<void> => {
  const bookings = await fetchBookings();
  const target = bookings.find((b) => b.id === id);
  if (target) {
    target.status = status;
    await saveBooking(target);
  }
};

export const fetchDailyAnalytics = async (): Promise<DailyAnalyticsRecord[]> => {
  const [posts, bookings] = await Promise.all([fetchPosts(), fetchBookings()]);
  return fetchDailyAnalyticsInternal(firestoreDb, posts, bookings);
};

export const recordSessionDwell = async (seconds: number): Promise<void> => {
  return recordDailyDwellSeconds(seconds, firestoreDb);
};

export { exportAnalyticsCsv };

export const resetDatabaseToDefaults = async (): Promise<void> => {
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(BLOG_CATEGORIES));

  if (firestoreDb) {
    try {
      for (const post of INITIAL_BLOG_POSTS) {
        await setDoc(doc(firestoreDb, 'blog_posts', post.id), post);
      }
    } catch (e) {
      console.warn('Could not reset Firestore collection', e);
    }
  }
};