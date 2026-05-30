CREATE TABLE IF NOT EXISTS tripadvisor_restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  address_string VARCHAR(255),
  postalcode VARCHAR(20),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  phone_number VARCHAR(50),
  website_url VARCHAR(255),
  photos TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
