INSERT INTO tournamently.USERS (email, password, verified) VALUES
('user1@example.com', 'password1', true),
('user2@example.com', 'password2', false),
('user3@example.com', 'password3', true);

INSERT INTO tournamently.TOURNAMENTS (name, discipline, time, geo_coordinates, location, max_participants, app_deadline, creator) VALUES
('Tournament 1', 'Discipline 1', '2022-01-01', '40.712776,-74.005974', 'New York', 100, '2021-12-01', 'user1@example.com'),
('Tournament 2', 'Discipline 2', '2022-02-01', '34.052235,-118.243683', 'Los Angeles', 200, '2021-12-15', 'user2@example.com');

INSERT INTO tournamently.TOURNAMENT_PARTICIPANTS (tournament_id, participant) VALUES
(1, 'user2@example.com'),
(1, 'user3@example.com'),
(2, 'user1@example.com');

INSERT INTO tournamently.SPONSORS (name, logo, website) VALUES
('Sponsor 1', 'logo1.png', 'www.sponsor1.com'),
('Sponsor 2', 'logo2.png', 'www.sponsor2.com');

INSERT INTO tournamently.TOURNAMENT_SPONSORS (tournament_id, sponsor_name) VALUES
(1, 'Sponsor 1'),
(2, 'Sponsor 2');

INSERT INTO tournamently.TOURNAMENT_RESULTS (tournament_id, participant1, participant2, score1, score2, verified) VALUES
(1, 'user2@example.com', 'user3@example.com', 3, 2, true),
(2, 'user1@example.com', 'user2@example.com', 2, 3, false);