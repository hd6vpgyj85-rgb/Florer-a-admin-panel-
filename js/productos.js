/**
 * Operaciones sobre la tabla `products` de Supabase.
 */
window.Productos = (function () {
  async function listarActivos({ collectionId } = {}) {
    const sb = window.getSupabase();
    let query = sb.from("products").select("*").eq("activo", true).order("created_at", { ascending: false });
    if (collectionId) query = query.eq("collection_id", collectionId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function listarTodos() {
    const sb = window.getSupabase();
    const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function obtenerPorId(id) {
    const sb = window.getSupabase();
    const { data, error } = await sb.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function crear(payload) {
    const sb = window.getSupabase();
    const { data, error } = await sb.from("products").insert([payload]).select().single();
    if (error) throw error;
    return data;
  }

  async function actualizar(id, cambios) {
    const sb = window.getSupabase();
    const { data, error } = await sb.from("products").update(cambios).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async function eliminar(id) {
    const sb = window.getSupabase();
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) throw error;
  }

  return { listarActivos, listarTodos, obtenerPorId, crear, actualizar, eliminar };
})();
