/**
 * Autenticación (Supabase Auth) para el panel de administración.
 */
window.Auth = (function () {
  async function getSession() {
    let sb;
    try {
      sb = window.getSupabase();
    } catch (err) {
      console.error("[auth.js] getSession:", err.message);
      return null;
    }
    const { data, error } = await sb.auth.getSession();
    if (error) {
      console.error("[auth.js] getSession error:", error);
      return null;
    }
    return data.session;
  }

  async function signIn(email, password) {
    const sb = window.getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const sb = window.getSupabase();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  }

  /** Redirige a dashboard.html si ya existe una sesión activa. Usar en admin/index.html */
  async function redirectIfAuthenticated(destination) {
    const session = await getSession();
    if (session) {
      window.location.href = destination || "dashboard.html";
    }
  }

  /** Redirige a index.html (login) si no hay sesión activa. Usar en admin/dashboard.html */
  async function requireAuth(loginPage) {
    const session = await getSession();
    if (!session) {
      window.location.href = loginPage || "index.html";
      return null;
    }
    return session;
  }

  return { getSession, signIn, signOut, redirectIfAuthenticated, requireAuth };
})();
