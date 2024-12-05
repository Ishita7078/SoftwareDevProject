INSERT INTO users (username, password, name, email, gender, age)
VALUES
('test1', 'password1', 'name1', 'test1@gmail.com', 'M', 1),
('test2', 'password2', 'name2', 'test2@gmail.com', 'F', 2);

INSERT INTO teams (team_id, team_name, created_at)
VALUES
(1, testTeam, NULL);

INSERT INTO todos (todo_id, todo_title, todo_date, todo_username, team_id)
VALUES
(1, 'Serving Pancakes','12/5/2024', 'Bob Ross'1),
(2, 'Sleep', '12/6/2024', 'Mario', 1);