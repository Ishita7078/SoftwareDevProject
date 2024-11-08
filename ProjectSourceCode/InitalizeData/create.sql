DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password CHAR(60) NOT NULL,
  name CHAR(50) NOT NULL,
  email CHAR(100) NOT NULL,
  gender CHAR(1),
  age INT
);

