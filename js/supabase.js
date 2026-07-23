/**
 * Inicializa el cliente de Supabase para toda la app.
 * Requiere que se haya cargado antes:
 *   - js/config.js
 *   - https://unpkg.com/@supabase/supabase-js@2 (UMD, expone window.supabase)
 */
(function () {
  const cfg = window.APP_CONFIG || {};

  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    console.warn(
      "[supabase.js] Faltan credenciales en js/config.js (SUPABASE_URL / SUPABASE_ANON_KEY). " +
        "La app funcionará visualmente pero las operaciones con la base de datos fallarán."
    );
  }

  window.supabaseClient = null;

  try {
    if (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      window.supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    }
  } catch (err) {
    console.error("[supabase.js] Error creando el cliente de Supabase:", err);
  }

  window.getSupabase = function getSupabase() {
    if (!window.supabaseClient) {
      throw new Error(
        "Supabase no está configurado. Completa js/config.js con SUPABASE_URL y SUPABASE_ANON_KEY."
      );
    }
    return window.supabaseClient;
  };
})();
