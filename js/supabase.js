
/*
  COLT Waitlist — Supabase + localStorage integration
  
  SETUP:
  1. Create a Supabase project at https://supabase.com
  2. Create a table called "waitlist" with columns:
       - id        (int8, primary key, auto-increment)
       - email     (text, unique)
       - created_at (timestamptz, default now())
  3. Enable Row Level Security and add an INSERT policy for anon role
  4. Replace the URL and KEY below with your project values
*/

const SUPABASE_URL  = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY  = 'YOUR_ANON_KEY';

const LS_KEY = 'colt_waitlist_email';

// Check if user already applied (localStorage)
function isAlreadyApplied() {
  try { return !!localStorage.getItem(LS_KEY); } catch { return false; }
}

function getAppliedEmail() {
  try { return localStorage.getItem(LS_KEY) || ''; } catch { return ''; }
}

function markApplied(email) {
  try { localStorage.setItem(LS_KEY, email); } catch { /* private browsing */ }
}

// Submit to Supabase
async function submitWaitlist(email) {
  // Always mark locally first for instant feedback
  markApplied(email);

  // If Supabase isn't configured, succeed silently (localStorage-only mode)
  if (SUPABASE_URL.includes('YOUR_PROJECT')) {
    console.info('[COLT Waitlist] Supabase not configured. Stored in localStorage only.');
    return { ok: true, mode: 'local' };
  }

  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      return { ok: true, mode: 'db' };
    }

    // 409 = duplicate (already in DB) — still a success for the user
    if (res.status === 409 || res.status === 400) {
      return { ok: true, mode: 'duplicate' };
    }

    // Network or server error — already saved locally, so still okay
    console.warn('[COLT Waitlist] DB insert failed, status:', res.status);
    return { ok: true, mode: 'local-fallback' };

  } catch (err) {
    console.warn('[COLT Waitlist] Network error, saved locally:', err.message);
    return { ok: true, mode: 'local-fallback' };
  }
}

// Export for use in main.js
window.ColtWaitlist = { isAlreadyApplied, getAppliedEmail, markApplied, submitWaitlist };