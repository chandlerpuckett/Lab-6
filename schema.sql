CREATE TABLE user_search (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255) UNIQUE,
  latitude VARCHAR(255),
  longitude VARCHAR(255),
  formatted_query VARCHAR(255)
);

/* 

search - query UNIQUE 
latitude - DECIMAL(<precision>, <scale>) : (7)
longitude - DECIMAL (7)

*/
