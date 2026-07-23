/**
 * Operaciones sobre la tabla `collections` de Supabase.
 */
window.Colecciones = (function () {
  async function listarActivas() {
    const sb = window.getSupabase();
    const { data, error } = await sb
      .from("collections")
      .select("*")
      .eq("activa", true)
      .order("nombre", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function listarTodas() {
    const sb = window.getSupabase();
    const { data, error } = await sb
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function obtenerPorSlug(slug) {
    const sb = window.getSupabase();
    const { data, error } = await sb.from("collections").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  }

  function slugify(texto) {
    return texto
      .toString()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function crear({ nombre, activa }) {
    const sb = window.getSupabase();
    const slug = slugify(nombre);
    const { data, error } = await sb
      .from("collections")
      .insert([{ nombre, slug, activa: activa !== false }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function actualizar(id, cambios) {
    const sb = window.getSupabase();
    const payload = { ...cambios };
    if (payload.nombre) payload.slug = slugify(payload.nombre);
    const { data, error } = await sb.from("collections").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async function cambiarEstado(id, activa) {
    return actualizar(id, { activa });
  }

  async function eliminar(id) {
    const sb = window.getSupabase();
    const { error } = await sb.from("collections").delete().eq("id", id);
    if (error) throw error;
  }

  return { listarActivas, listarTodas, obtenerPorSlug, crear, actualizar, cambiarEstado, eliminar, slugify };
})();
