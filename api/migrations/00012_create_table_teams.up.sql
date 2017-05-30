CREATE TABLE teams (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    projects text[],
    user_ids uuid[],
    owner_id uuid NOT NULL REFERENCES users (id)
);
