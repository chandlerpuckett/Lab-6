CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255),
  formatted_query VARCHAR(255)
);
