-- Create products table
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric(10,2) not null check (price >= 0),
  category text not null,
  created_at timestamptz not null default now()
);

-- Seed sample products
insert into public.products (name, price, category)
values
  ('Classic White T-Shirt', 19.99, 'Tops'),
  ('Blue Denim Jeans', 49.99, 'Bottoms'),
  ('Lightweight Hoodie', 39.50, 'Outerwear')
on conflict do nothing;
