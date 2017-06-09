ALTER TABLE teams ADD CONSTRAINT unique_name_for_user UNIQUE (name, owner_id);
