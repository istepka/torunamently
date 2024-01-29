INSERT INTO tournamently.USERS (email, password, verified) VALUES
('chess_master@example.com', 'password1', true),
('hoopstar@example.com', 'password2', true),
('soccer_fanatic@example.com', 'password3', true),
('pingpong_pro@example.com', 'password4', true),
('golf_enthusiast@example.com', 'password5', true),
('shuttle_king@example.com', 'password6', true),
('tennis_champion@example.com', 'password7', true),
('swim_master@example.com', 'password8', true),
('dart_sharpshooter@example.com', 'password9', true),
('volley_pro@example.com', 'password10', true),
('martial_artist@example.com', 'password11', true),
('cycle_enthusiast@example.com', 'password12', true),
('track_and_field@example.com', 'password13', true),
('snooker_pro@example.com', 'password14', true),
('gymnast_champion@example.com', 'password15', true),
('surfing_pro@example.com', 'password16', true),
('equestrian_lover@example.com', 'password17', true),
('archery_expert@example.com', 'password18', true),
('hockey_pro@example.com', 'password19', true),
('frisbee_champion@example.com', 'password20', true),
('wrestling_star@example.com', 'password21', true),
('rugby_warrior@example.com', 'password22', true),
('fencing_maestro@example.com', 'password23', true),
('golf_pro@example.com', 'password24', true);



INSERT INTO tournamently.TOURNAMENTS (name, discipline, time, geo_coordinates, location, max_participants, app_deadline, creator) VALUES
('Chess Championship', 'Chess', '2022-03-15', '40.712776,-74.005974', 'New York', 8, '2022-02-28', 'chess_master@example.com'),
('Basketball Showdown', 'Basketball', '2022-04-02', '34.052235,-118.243683', 'Los Angeles', 8, '2022-03-15', 'hoopstar@example.com'),
('Soccer Spectacle', 'Soccer', '2022-05-10', '51.509865,-0.118092', 'London', 4, '2022-04-25', 'soccer_fanatic@example.com'),
('Table Tennis Challenge', 'Table Tennis', '2022-06-20', '35.689487,139.691711', 'Tokyo', 16, '2022-06-05', 'pingpong_pro@example.com'),
('Golf Tournament', 'Golf', '2022-07-05', '33.749001,-84.387978', 'Atlanta', 32, '2022-06-20', 'golf_enthusiast@example.com'),
('Badminton Battle', 'Badminton', '2022-08-18', '1.352083,103.819836', 'Singapore', 16, '2022-08-01', 'shuttle_king@example.com'),
('Tennis Open', 'Tennis', '2022-09-12', '48.856613,2.352222', 'Paris', 16, '2022-08-27', 'tennis_champion@example.com'),
('Swimming Challenge', 'Swimming', '2022-10-25', '40.712776,-74.005974', 'New York', 16, '2022-10-10', 'swim_master@example.com'),
('Darts Extravaganza', 'Darts', '2022-11-08', '51.509865,-0.118092', 'London', 16, '2022-10-23', 'dart_sharpshooter@example.com'),
('Volleyball Clash', 'Volleyball', '2022-12-03', '34.052235,-118.243683', 'Los Angeles', 16, '2022-11-18', 'volley_pro@example.com'),
('Martial Arts Showdown', 'Martial Arts', '2023-01-20', '35.689487,139.691711', 'Tokyo', 16, '2023-01-05', 'martial_artist@example.com'),
('Cycling Challenge', 'Cycling', '2023-02-15', '48.856613,2.352222', 'Paris', 16, '2023-01-30', 'cycle_enthusiast@example.com'),
('Athletics Championship', 'Athletics', '2023-03-10', '33.749001,-84.387978', 'Atlanta', 16, '2023-02-22', 'track_and_field@example.com'),
('Snooker Invitational', 'Snooker', '2023-04-18', '1.352083,103.819836', 'Singapore', 16, '2023-04-01', 'snooker_pro@example.com'),
('Gymnastics Gala', 'Gymnastics', '2023-05-22', '40.712776,-74.005974', 'New York', 16, '2023-05-07', 'gymnast_champion@example.com'),
('Surfing Showdown', 'Surfing', '2023-06-30', '-33.868820,151.209296', 'Sydney', 16, '2023-06-15', 'surfing_pro@example.com'),
('Equestrian Elegance', 'Equestrian', '2023-07-15', '51.509865,-0.118092', 'London', 32, '2023-06-30', 'equestrian_lover@example.com'),
('Archery Championship', 'Archery', '2023-08-10', '34.052235,-118.243683', 'Los Angeles', 32, '2023-07-25', 'archery_expert@example.com'),
('Ice Hockey Classic', 'Ice Hockey', '2023-09-25', '55.755825,37.617298', 'Moscow', 32, '2023-09-10', 'hockey_pro@example.com'),
('Ultimate Frisbee Fest', 'Ultimate Frisbee', '2023-10-12', '37.774929,-122.419416', 'San Francisco', 32, '2023-09-27', 'frisbee_champion@example.com'),
('Wrestling Showdown', 'Wrestling', '2023-11-05', '35.689487,139.691711', 'Tokyo', 32, '2023-10-20', 'wrestling_star@example.com'),
('Rugby Rumble', 'Rugby', '2023-12-20', '-36.848461,174.763336', 'Auckland', 32, '2023-12-05', 'rugby_warrior@example.com'),
('Fencing Frenzy', 'Fencing', '2024-01-15', '48.856613,2.352222', 'Paris', 32, '2023-12-30', 'fencing_maestro@example.com'),
('Golf Masters', 'Golf', '2024-02-08', '33.749001,-84.387978', 'Atlanta', 32, '2024-01-24', 'golf_pro@example.com');


INSERT INTO tournamently.TOURNAMENT_PARTICIPANTS (tournament_id, participant) VALUES
(1, 'hoopstar@example.com'),
(1, 'soccer_fanatic@example.com'),
(1, 'archery_expert@example.com'),
(1, 'tennis_champion@example.com'),
(1, 'fencing_maestro@example.com'),
(1, 'golf_pro@example.com'),
(1, 'rugby_warrior@example.com'),

(2, 'chess_master@example.com'),
(2, 'surfing_pro@example.com'),
(2, 'golf_enthusiast@example.com'),
(2, 'volley_pro@example.com'),
(2, 'archery_expert@example.com'),
(2, 'tennis_champion@example.com'),

(3, 'track_and_field@example.com'),
(3, 'snooker_pro@example.com'),
(3, 'martial_artist@example.com'),
(3, 'fencing_maestro@example.com'),

(4, 'cycle_enthusiast@example.com'),
(4, 'swim_master@example.com'),
(4, 'equestrian_lover@example.com');


INSERT INTO tournamently.SPONSORS (name, logo, website) VALUES
('Coca cola', 'https://i.ytimg.com/vi/UDYCc4dbSJU/maxresdefault.jpg', 'www.coke.com'),
('SEJM RP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sejm_RP_logo_and_wordmark.svg/1200px-Sejm_RP_logo_and_wordmark.svg.png', 'www.sejm.gov.pl'),
('Sprite', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Sprite_2022.svg/640px-Sprite_2022.svg.png', 'www.sprite.com'),
('Tiktok', 'https://sf-static.tiktokcdn.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png', 'www.tiktok.com'),
('Politechnika Poznańska', 'https://informator.put.poznan.pl/scripts/build/3c76a04891137e2ee206f95827b93766.svg', 'www.put.poznan.pl'),
('OpenAI', 'https://obs.line-scdn.net/0heetH6pzYOkpJMSjIRldFHXFnNjt6VyBDawclKjxkYHtjHSkVJV5pKWhjbWY0VX4ZaV8iL2VlYX03Vi0cIg/w644', 'www.openai.com'),
('Carnegie Mellon University', 'https://www.cmu.edu/brand/brand-guidelines/images/seal-4c-600x600-min.jpg', 'www.cmu.edu');

INSERT INTO tournamently.TOURNAMENT_SPONSORS (tournament_id, sponsor_name) VALUES
(1, 'Sprite'),
(1, 'Coca cola'),
(1, 'Politechnika Poznańska'),
(2, 'OpenAI'),
(2, 'Carnegie Mellon University'),
(2, 'SEJM RP'),
(2, 'Tiktok'),
(3, 'Tiktok'),
(3, 'Coca cola'),
(3, 'SEJM RP'),
(4, 'Coca cola'),
(4, 'Politechnika Poznańska'),
(4, 'Sprite');


INSERT INTO tournamently.TOURNAMENT_RESULTS (tournament_id, participant1, participant2, score1, score2, verified) VALUES
(1, 'hoopstar@example.com', 'soccer_fanatic@example.com', 1, 1, true),
(1, 'archery_expert@example.com', 'tennis_champion@example.com', 0, 0, true),
(1, 'fencing_maestro@example.com', 'golf_pro@example.com', 1, 0, false),

(2, 'chess_master@example.com', 'surfing_pro@example.com', 1, 1, true),
(2, 'golf_enthusiast@example.com', 'volley_pro@example.com', 1, 1, true),
(2, 'archery_expert@example.com', 'tennis_champion@example.com', 1, 1, true), 

(3, 'track_and_field@example.com', 'snooker_pro@example.com', 1, 1, true),
(3, 'martial_artist@example.com', 'fencing_maestro@example.com', 1, 1, true),
(3, 'snooker_pro@example.com', 'fencing_maestro@example.com', 1, 1, true);

