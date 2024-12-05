INSERT INTO users (username, password, name, email, gender, age)
VALUES
('test1', '$2a$10$0nuiAcxmpycVE73Ilf.dHep/XZvy1/v3/iy6eZFw.xWUChCS1xMZ.', 'name1', 'test1@gmail.com', 'M', 1),
('test2', '$2a$10$iLkX7nwuNYFlaxpleHZ5dOyEdzFFARQEpdfDRjYS8qSwX1EmOPbR.', 'name2', 'test2@gmail.com', 'F', 2);

INSERT INTO teams (team_id, team_name, created_at)
VALUES
(1, 'testTeam', NULL);

INSERT INTO todos (todo_id, todo_title, todo_date, todo_username, team_id)
VALUES
(1, 'Serving Pancakes','12/5/2024', 'test1',1),
(2, 'Sleep', '12/6/2024', 'test1', 1),
(3, 'Go shopping','12/25/2024', 'test2',1);