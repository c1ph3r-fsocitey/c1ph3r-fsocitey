-- ============================================================
-- C1PH3R FSOCIETY — Initial Database Schema
-- Run with: supabase db push
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- PRODUCTS
-- ============================================================
create type product_category as enum (
  'ble-tools', 'wifi-tools', 'rf-tools', 'multi-tools', 'educational', 'accessories'
);

create table products (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text not null unique,
  tagline          text not null,
  description      text not null,
  long_description text,
  price            numeric(10,2) not null,
  price_inr        numeric(10,2),
  compare_at_price numeric(10,2),
  images           text[] default '{}',
  category         product_category not null,
  tags             text[] default '{}',
  stock            integer not null default 0,
  sku              text not null unique,
  weight_grams     integer,
  specs            jsonb default '{}',
  features         text[] default '{}',
  legal_disclaimer text,
  is_active        boolean not null default true,
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_products_slug on products(slug);
create index idx_products_category on products(category);
create index idx_products_active on products(is_active);
create index idx_products_featured on products(is_featured);

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table customers (
  id             uuid primary key default uuid_generate_v4(),
  email          text not null unique,
  full_name      text not null,
  phone          text,
  orders_count   integer not null default 0,
  total_spent    numeric(12,2) not null default 0,
  created_at     timestamptz not null default now(),
  last_order_at  timestamptz
);

create index idx_customers_email on customers(email);

-- ============================================================
-- COUPONS
-- ============================================================
create type coupon_type as enum ('percentage', 'fixed');

create table coupons (
  id         uuid primary key default uuid_generate_v4(),
  code       text not null unique,
  type       coupon_type not null,
  value      numeric(10,2) not null,
  min_order  numeric(10,2),
  max_uses   integer,
  uses       integer not null default 0,
  expires_at timestamptz,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create type order_status as enum (
  'pending', 'payment_pending', 'confirmed', 'processing',
  'shipped', 'delivered', 'cancelled', 'refunded'
);
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type payment_provider as enum ('paypal', 'razorpay');
create type currency_code as enum ('USD', 'INR');

create table orders (
  id                uuid primary key default uuid_generate_v4(),
  order_number      text not null unique default 'ORD-' || upper(substr(md5(random()::text), 1, 8)),
  customer_id       uuid references customers(id) on delete set null,
  customer_email    text not null,
  customer_name     text not null,
  subtotal          numeric(12,2) not null,
  discount          numeric(12,2) not null default 0,
  shipping          numeric(12,2) not null default 0,
  tax               numeric(12,2) not null default 0,
  total             numeric(12,2) not null,
  currency          currency_code not null default 'USD',
  status            order_status not null default 'pending',
  payment_status    payment_status not null default 'pending',
  payment_provider  payment_provider,
  payment_id        text,
  coupon_code       text,
  shipping_address  jsonb not null,
  tracking_number   text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_orders_customer_id    on orders(customer_id);
create index idx_orders_customer_email on orders(customer_email);
create index idx_orders_status         on orders(status);
create index idx_orders_payment_status on orders(payment_status);
create index idx_orders_created_at     on orders(created_at desc);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id) on delete restrict,
  quantity    integer not null,
  unit_price  numeric(12,2) not null,
  total_price numeric(12,2) not null
);

create index idx_order_items_order_id   on order_items(order_id);
create index idx_order_items_product_id on order_items(product_id);

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table blog_posts (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  excerpt         text not null,
  content         text not null,
  cover_image     text,
  author          text not null default 'Rahul Thareja',
  tags            text[] default '{}',
  categories      text[] default '{}',
  is_published    boolean not null default false,
  published_at    timestamptz,
  reading_time    integer,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_blog_posts_slug        on blog_posts(slug);
create index idx_blog_posts_published   on blog_posts(is_published);
create index idx_blog_posts_published_at on blog_posts(published_at desc);

-- ============================================================
-- RESEARCH PROJECTS
-- ============================================================
create type research_category as enum (
  'ble-security', 'wifi-security', 'rf-research',
  'embedded-systems', 'robotics', 'educational'
);
create type research_status as enum ('ongoing', 'completed', 'published');

create table research_projects (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  summary      text not null,
  description  text not null,
  images       text[] default '{}',
  video_url    text,
  github_url   text,
  tags         text[] default '{}',
  category     research_category not null,
  status       research_status not null default 'ongoing',
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

create index idx_research_slug     on research_projects(slug);
create index idx_research_category on research_projects(category);

-- ============================================================
-- SPEAKING EVENTS
-- ============================================================
create type event_type as enum (
  'conference', 'workshop', 'webinar', 'podcast', 'demo'
);

create table speaking_events (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  event_name  text not null,
  event_type  event_type not null,
  date        date not null,
  location    text,
  is_online   boolean not null default false,
  description text not null,
  video_url   text,
  slides_url  text,
  event_url   text,
  cover_image text,
  tags        text[] default '{}',
  created_at  timestamptz not null default now()
);

create index idx_speaking_date on speaking_events(date desc);

-- ============================================================
-- MEDIA
-- ============================================================
create type media_type as enum ('image', 'video');
create type media_category as enum (
  'conference', 'workshop', 'product', 'research', 'demo', 'misc'
);

create table media_items (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  type        media_type not null,
  url         text not null,
  thumbnail   text,
  description text,
  category    media_category not null default 'misc',
  tags        text[] default '{}',
  created_at  timestamptz not null default now()
);

create index idx_media_category on media_items(category);
create index idx_media_type     on media_items(type);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
create type inquiry_type as enum (
  'general', 'business', 'speaking', 'support', 'wholesale'
);

create table contact_submissions (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  subject      text not null,
  message      text not null,
  inquiry_type inquiry_type not null default 'general',
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index idx_contact_is_read   on contact_submissions(is_read);
create index idx_contact_created   on contact_submissions(created_at desc);

-- ============================================================
-- SHIPPING RATES
-- ============================================================
create table shipping_rates (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  carrier        text not null,
  estimated_days text not null,
  price          numeric(10,2) not null,
  currency       currency_code not null default 'USD',
  countries      text[] not null default '{"*"}',
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
create table site_settings (
  id                   integer primary key default 1 check (id = 1), -- singleton
  site_name            text not null default 'C1ph3r Fsociety',
  tagline              text not null default 'Cybersecurity Hardware Research & Education',
  description          text not null default 'We design, build, and sell offensive security hardware for ethical hackers, penetration testers, and security researchers.',
  contact_email        text not null default 'rahulthegreat2001@gmail.com',
  contact_phone        text,
  address              text,
  instagram_url        text default 'https://instagram.com/c1ph3r.fsocitey/',
  github_url           text default 'https://github.com/c1ph3r-fsocitey',
  twitter_url          text,
  linkedin_url         text,
  youtube_url          text,
  upi_id               text,
  razorpay_enabled     boolean not null default true,
  paypal_enabled       boolean not null default true,
  maintenance_mode     boolean not null default false,
  announcement_banner  text,
  banner_enabled       boolean not null default false,
  updated_at           timestamptz not null default now()
);

insert into site_settings (id) values (1) on conflict do nothing;

-- ============================================================
-- ADMIN USERS
-- ============================================================
create type admin_role as enum ('super_admin', 'admin', 'editor');

create table admin_users (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  role       admin_role not null default 'admin',
  name       text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at   before update on products         for each row execute procedure update_updated_at();
create trigger orders_updated_at     before update on orders           for each row execute procedure update_updated_at();
create trigger blog_updated_at       before update on blog_posts       for each row execute procedure update_updated_at();
create trigger settings_updated_at   before update on site_settings    for each row execute procedure update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table products           enable row level security;
alter table customers          enable row level security;
alter table orders             enable row level security;
alter table order_items        enable row level security;
alter table blog_posts         enable row level security;
alter table research_projects  enable row level security;
alter table speaking_events    enable row level security;
alter table media_items        enable row level security;
alter table contact_submissions enable row level security;
alter table site_settings      enable row level security;
alter table coupons            enable row level security;
alter table shipping_rates     enable row level security;

-- Public read access for storefront data
create policy "Public can read active products"
  on products for select using (is_active = true);

create policy "Public can read published blog posts"
  on blog_posts for select using (is_published = true);

create policy "Public can read research projects"
  on research_projects for select using (true);

create policy "Public can read speaking events"
  on speaking_events for select using (true);

create policy "Public can read media"
  on media_items for select using (true);

create policy "Public can read site settings"
  on site_settings for select using (true);

create policy "Public can read active shipping rates"
  on shipping_rates for select using (is_active = true);

-- Service role has full access (used in API routes with service key)
-- Customers can read their own orders
create policy "Customers can view own orders"
  on orders for select
  using (customer_email = current_setting('request.jwt.claims', true)::json->>'email');
