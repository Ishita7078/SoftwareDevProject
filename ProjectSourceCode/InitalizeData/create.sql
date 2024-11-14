DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password CHAR(60) NOT NULL,
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
  team_id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 
Creating a table for the many-to-many relationship from users to teams
  team_id: from teams table
  username: from users table
  role: is either "member" or "admin", but will default to "member" if none is specified
  joined_at: time of user joining team
*/
CREATE TABLE team_members (
  team_id INT NOT NULL,
  username VARCHAR(50) NOT NULL,
  role ENUM('member', 'admin') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, username),
  FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);