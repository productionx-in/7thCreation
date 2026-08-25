const SUPABASE_URL = 'https://wdsnhciwuhkwkwuvxrru.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yqGOdTs4J5Vbz8_jMBTGBg_rcU2hykV';
const SESSION_KEY = '7tc_session_id';

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// A raw PostgREST insert rather than the full supabase-js client — logging a
// page view doesn't need auth state, realtime, or storage, so there's no
// reason every visitor's first load should fetch the ~220KB supabase-js
// chunk just for this. `keepalive` lets the request survive a same-tab
// navigation away from the page that fired it.
export function logPageView(path: string) {
  try {
    fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
        session_id: getSessionId(),
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Tracking must never break the page — silently drop on any failure
    // (ad blockers, private browsing storage restrictions, etc.).
  }
}
