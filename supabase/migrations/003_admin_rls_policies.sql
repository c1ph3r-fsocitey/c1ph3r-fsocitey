-- ============================================================
-- MIGRATION 003: Admin RLS write policies
-- Allows authenticated Supabase users to perform all write
-- operations on admin-managed tables.
-- ============================================================

-- PRODUCTS
create policy "Authenticated users can insert products"
  on products for insert to authenticated with check (true);

create policy "Authenticated users can update products"
  on products for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete products"
  on products for delete to authenticated using (true);

-- BLOG POSTS
create policy "Authenticated users can insert blog posts"
  on blog_posts for insert to authenticated with check (true);

create policy "Authenticated users can update blog posts"
  on blog_posts for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete blog posts"
  on blog_posts for delete to authenticated using (true);

-- RESEARCH PROJECTS
create policy "Authenticated users can insert research projects"
  on research_projects for insert to authenticated with check (true);

create policy "Authenticated users can update research projects"
  on research_projects for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete research projects"
  on research_projects for delete to authenticated using (true);

-- SPEAKING EVENTS
create policy "Authenticated users can insert speaking events"
  on speaking_events for insert to authenticated with check (true);

create policy "Authenticated users can update speaking events"
  on speaking_events for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete speaking events"
  on speaking_events for delete to authenticated using (true);

-- MEDIA ITEMS
create policy "Authenticated users can insert media"
  on media_items for insert to authenticated with check (true);

create policy "Authenticated users can update media"
  on media_items for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete media"
  on media_items for delete to authenticated using (true);

-- CONTACT SUBMISSIONS (admin reads all, public can insert)
create policy "Public can submit contact forms"
  on contact_submissions for insert to anon with check (true);

create policy "Authenticated users can read contact submissions"
  on contact_submissions for select to authenticated using (true);

create policy "Authenticated users can update contact submissions"
  on contact_submissions for update to authenticated using (true) with check (true);

-- ORDERS (admin can read/update all)
create policy "Authenticated users can read all orders"
  on orders for select to authenticated using (true);

create policy "Authenticated users can update orders"
  on orders for update to authenticated using (true) with check (true);

create policy "Authenticated users can insert orders"
  on orders for insert to authenticated with check (true);

-- ORDER ITEMS (admin can read all)
create policy "Authenticated users can read all order items"
  on order_items for select to authenticated using (true);

create policy "Authenticated users can insert order items"
  on order_items for insert to authenticated with check (true);

-- CUSTOMERS (admin can manage all)
create policy "Authenticated users can read all customers"
  on customers for select to authenticated using (true);

create policy "Authenticated users can insert customers"
  on customers for insert to authenticated with check (true);

create policy "Authenticated users can update customers"
  on customers for update to authenticated using (true) with check (true);

-- COUPONS
create policy "Authenticated users can manage coupons"
  on coupons for all to authenticated using (true) with check (true);

-- SHIPPING RATES
create policy "Authenticated users can manage shipping rates"
  on shipping_rates for all to authenticated using (true) with check (true);

-- SITE SETTINGS (singleton row)
create policy "Authenticated users can update site settings"
  on site_settings for update to authenticated using (true) with check (true);

-- ADMIN USERS
create policy "Authenticated users can read admin users"
  on admin_users for select to authenticated using (true);
