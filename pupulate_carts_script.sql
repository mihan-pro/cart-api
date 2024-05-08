do $$
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
DECLARE my_uuid uuid := uuid_generate_v4();

begin
insert into carts (id, user_id, created_at, updated_at, status) 
	values (my_uuid, uuid_generate_v4(), '2024-05-03', '2024-05-03', 'OPEN');
insert into cart_items (cart_id, product_id, count)
	values (my_uuid, uuid_generate_v4(), 6);

my_uuid := uuid_generate_v4();
insert into carts (id, user_id, created_at, updated_at, status) 
	values (my_uuid, uuid_generate_v4(), '2024-05-03', '2024-05-03', 'OPEN');
insert into cart_items (cart_id, product_id, count)
	values (my_uuid, uuid_generate_v4(), 10);

my_uuid := uuid_generate_v4();
insert into carts (id, user_id, created_at, updated_at, status) 
	values (my_uuid, uuid_generate_v4(), '2024-05-03', '2024-05-03', 'OPEN');
insert into cart_items (cart_id, product_id, count)
	values (my_uuid, uuid_generate_v4(), 15);

my_uuid := uuid_generate_v4();
insert into carts (id, user_id, created_at, updated_at, status) 
	values (my_uuid, uuid_generate_v4(), '2024-05-03', '2024-05-03', 'OPEN');
insert into cart_items (cart_id, product_id, count)
	values (my_uuid, uuid_generate_v4(), 0);

end $$