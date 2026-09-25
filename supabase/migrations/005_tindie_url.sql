-- Add Tindie product URL to products table
-- Run this in the Supabase SQL editor

alter table products
  add column if not exists tindie_url text;

comment on column products.tindie_url is
  'Direct link to this product listing on Tindie (e.g. https://www.tindie.com/products/c1ph3r_fsocitey/disruptorx-v2/)';
