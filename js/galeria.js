/**
 * Operaciones sobre la tabla `gallery_images` de Supabase.
 * Imágenes sueltas (sin producto asociado) para la sección "Galería" del sitio.
 */
window.Galeria = (function () {
  async function listarTodas() {
    const sb = window.getSupabase();
    const { data, error } = await sb
      .from("gallery_images")
      .select("*")
      .order("orden", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function agregar(url) {
    const sb = window.getSupabase();
    const { data, error } = await sb.from("gallery_images").insert([{ url }]).select().single();
    if (error) throw error;
    return data;
  }

  async function eliminar(id) {
    const sb = window.getSupabase();
    const { error } = await sb.from("gallery_images").delete().eq("id", id);
    if (error) throw error;
  }

  return { listarTodas, agregar, eliminar };
})();
