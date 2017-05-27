CREATE TABLE frames (
    id varchar(50) PRIMARY KEY,
    start_at timestamp WITHOUT TIME ZONE,
    end_at timestamp WITHOUT TIME ZONE,
    project_id uuid REFERENCES projects (id)
);
