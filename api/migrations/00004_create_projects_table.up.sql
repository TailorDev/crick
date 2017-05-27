ALTER TABLE users ADD PRIMARY KEY (id);

CREATE TABLE projects (
    id uuid PRIMARY KEY,
    name text,
    user_id uuid REFERENCES users (id)
);
