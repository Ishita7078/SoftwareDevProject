DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password CHAR(100) NOT NULL,
  name CHAR(50) NOT NULL,
  email CHAR(100) NOT NULL,
  gender CHAR(1),
  age INT
);

/* 
Creating a table for teams
  team_id: unique number for each team
  team_name: name of the team
  created_at: time of team creation
*/
CREATE TABLE teams (
  team_id SERIAL PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 
Creating a table for the many-to-many relationship from users to teams
  team_id: from teams table
  username: from users table
  role: is either "member" or "admin", but will default to "member" if none is specified
  joined_at: time of user joining team
  need to define enum beforehand
*/
CREATE TYPE role AS ENUM ('member', 'admin'); 
CREATE TABLE team_members (
  team_id INT NOT NULL,
  username VARCHAR(50) NOT NULL,
  role role DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, username),
  FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

/* 
Creating a table for files
  file_id: unique identifier for each file
  file_name: original name of the file
  file_path: server path where the file is stored
  uploader_username: user who uploaded the file (foreign key to users table)
  team_id: team associated with the file (foreign key to teams table)
*/
CREATE TABLE files (
  file_id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  uploader_username VARCHAR(50) NOT NULL,
  team_id INT ,
  visibility VARCHAR(10) DEFAULT 'self',
  FOREIGN KEY (uploader_username) REFERENCES users(username) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);

/* 
Creating a todo_id for files
  todo_id: unique identifier for each todo
  todo_title: title of the todo
  todo_date: date of the todo
  todo_username: user assigned to todo (foreign key to users table)
  team_id: team associated with the todo (foreign key to teams table)
*/
CREATE TABLE todos (
  todo_id SERIAL PRIMARY KEY,
  todo_title VARCHAR(255) NOT NULL,
  todo_date VARCHAR(50),
  todo_username VARCHAR(50) NOT NULL,
  team_id INT,
  FOREIGN KEY (todo_username) REFERENCES users(username) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE
);