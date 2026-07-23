-- ============================================================================
-- Florería - Esquema de base de datos Supabase
-- ============================================================================
-- Ejecutar en Supabase (SQL Editor) sobre un proyecto nuevo o existente.
-- Requiere la extensión pgcrypto para gen_random_uuid().
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- Tabla: collections
-- ============================================================================
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Tabla: products
-- ============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(10, 2),
  marca text,
  etiquetas text[] default '{}',
  stock integer not null default 0,
  collection_id uuid references public.collections(id) on delete set null,
  imagenes text[] default '{}',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_collection_id_idx on public.products(collection_id);
create index if not exists products_activo_idx on public.products(activo);

-- ============================================================================
-- Tabla: orders
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  nombre_cliente text not null,
  telefono text not null,
  tipo_entrega text not null check (tipo_entrega in ('envio', 'recoger', 'punto_medio')),
  direccion text,
  producto_id uuid references public.products(id) on delete set null,
  producto_nombre text,
  precio numeric(10, 2),
  created_at timestamptz not null default now()
);

create index if not exists orders_producto_id_idx on public.orders(producto_id);

-- ============================================================================
-- Tabla: gallery_images
-- ============================================================================
-- Imágenes sueltas (no ligadas a un producto) que el admin sube desde el
-- panel para mostrarse en la sección "Galería" de la página principal.
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_orden_idx on public.gallery_images(orden);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.gallery_images enable row level security;

-- --- collections: lectura pública, escritura solo autenticados -------------

drop policy if exists "collections_select_public" on public.collections;
create policy "collections_select_public"
  on public.collections for select
  to anon, authenticated
  using (true);

drop policy if exists "collections_insert_auth" on public.collections;
create policy "collections_insert_auth"
  on public.collections for insert
  to authenticated
  with check (true);

drop policy if exists "collections_update_auth" on public.collections;
create policy "collections_update_auth"
  on public.collections for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "collections_delete_auth" on public.collections;
create policy "collections_delete_auth"
  on public.collections for delete
  to authenticated
  using (true);

-- --- products: lectura pública, escritura solo autenticados ----------------

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "products_insert_auth" on public.products;
create policy "products_insert_auth"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "products_update_auth" on public.products;
create policy "products_update_auth"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "products_delete_auth" on public.products;
create policy "products_delete_auth"
  on public.products for delete
  to authenticated
  using (true);

-- --- orders: inserción pública, lectura solo autenticados -------------------

drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
  on public.orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "orders_select_auth" on public.orders;
create policy "orders_select_auth"
  on public.orders for select
  to authenticated
  using (true);

-- Nota: no se crean políticas de update/delete para orders. Solo el rol
-- "service_role" (usado desde el backend/Supabase Studio) puede modificarlas
-- por defecto, ya que ese rol ignora RLS.

-- --- gallery_images: lectura pública, escritura solo autenticados -----------

drop policy if exists "gallery_images_select_public" on public.gallery_images;
create policy "gallery_images_select_public"
  on public.gallery_images for select
  to anon, authenticated
  using (true);

drop policy if exists "gallery_images_insert_auth" on public.gallery_images;
create policy "gallery_images_insert_auth"
  on public.gallery_images for insert
  to authenticated
  with check (true);

drop policy if exists "gallery_images_delete_auth" on public.gallery_images;
create policy "gallery_images_delete_auth"
  on public.gallery_images for delete
  to authenticated
  using (true);
