INSERT INTO users (username, password, name, email, gender, age)
VALUES
('test1', '$2a$10$0nuiAcxmpycVE73Ilf.dHep/XZvy1/v3/iy6eZFw.xWUChCS1xMZ.', 'name1', 'test1@gmail.com', 'M', 1),
('test2', '$2a$10$iLkX7nwuNYFlaxpleHZ5dOyEdzFFARQEpdfDRjYS8qSwX1EmOPbR.', 'name2', 'test2@gmail.com', 'F', 2),
('whiteboard', '$2a$10$hq8fT1uhfpm.QBJ/kwjDHu/mSuE8pNJZRKIOzTB6q9BQs1H17C3GK', 'Whiteboard CSCI 3308', 'whiteboard@gmail.com', 'F', 101),
('John', '$2a$10$DPFpcK2d0qL7V58Dh4J4aeYz9b/UMmoobGS5YOOpklYqV0LXmpUWe', 'John Doe', 'JohnDoe@yahoo.com', 'M', 20),
('Jane', '$2a$10$mKU1FafayDBgNZ0G0b9W8uKmKTynui37IPg0nYqqoX5PMYuQKlHku', 'Jane Doe', 'JaneDoe@hotmail.com', 'F', 23),
('Alice', '$2a$10$Zv.1EKBYH8sVvTL1bpPXxOcbGGsKpm2.MVh4.gARcNrPtWq98PlGW', 'Alice Wonderland', 'Alice1@gmail.com', 'F', 32),
('Bob', '$2a$10$.Xd6T0xpYE6YzwZzvmyBK.H1LhfypIx.i/.McWkBSLNaPcjj3bZf6', 'Bobby Boy', 'BobTheBuilder@gmail.com', 'M', 36),
('David', '$2a$10$HR0w3pLzx71DCuC4pWAnUOEtod/P0/CZC8TXL9clKwDZCA2SjIZ46', 'David Bravo', 'DavidDeezNut@gmail.com', 'M', 69);

INSERT INTO teams (team_id, team_name, created_at, team_announcement)
VALUES
(1, 'testTeam', NULL, 'Announcement goes here...');

INSERT INTO todos (todo_id, todo_title, todo_date, todo_username, team_id, todo_completed)
VALUES
(1, 'Serving Pancakes','12/5/2024', 'test1',1, 1),
(2, 'Sleep', '12/6/2024', 'test1', 1, 0),
(3, 'Go shopping','12/25/2024', 'test2',1, 0),
(4, 'Present our project', '12/6/2024', 'whiteboard', 1, 0),
(5, 'Marry Jane', '12/31/2024', 'John', 1, 0),
(6, 'Divorce John', '12/4/2024', 'Jane', 1, 1),
(7, 'Reading', '11/2/2024', 'Alice', 1, 1),
(8, 'Movie Time', '11/1/2024', 'Alice', 1, 1),
(9, 'Building', '10/2/2023', 'Bob', 1, 0),
(10, 'Gaming', '10/1/2023', 'David', 1,1),
(11, 'Interview', '12/6/2077', 'David', 1, 0);