/* needed to use uuid_generate_v4() */
CREATE EXTENSION "uuid-ossp";

ALTER TABLE users ADD COLUMN auth0_id VARCHAR(50);
