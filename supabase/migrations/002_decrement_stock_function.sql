-- Function to safely decrement product stock
create or replace function decrement_stock(product_id uuid, quantity int)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set stock = greatest(0, stock - quantity),
      updated_at = now()
  where id = product_id;
end;
$$;

-- Coupon usage increment
create or replace function increment_coupon_uses(coupon_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update coupons
  set uses = uses + 1
  where id = coupon_id;
end;
$$;

-- Customer order stats update
create or replace function update_customer_stats(p_customer_id uuid, p_amount numeric)
returns void
language plpgsql
security definer
as $$
begin
  update customers
  set orders_count  = orders_count + 1,
      total_spent   = total_spent + p_amount,
      last_order_at = now()
  where id = p_customer_id;
end;
$$;
