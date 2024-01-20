CREATE DATABASE IF NOT EXISTS tournamently;

CREATE TABLE tournamently.USERS (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255)
);

CREATE TABLE tournamently.TOURNAMENTS (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    discipline VARCHAR(255) NOT NULL,
    time DATE NOT NULL,
    geo_coordinates VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    max_participants INT NOT NULL,
    app_deadline DATE NOT NULL,
    creator VARCHAR(255) NOT NULL,
    FOREIGN KEY (creator) REFERENCES tournamently.USERS(email)
);

CREATE TABLE tournamently.TOURNAMENT_PARTICIPANTS (
    tournament_id INT NOT NULL,
    participant VARCHAR(255) NOT NULL,
    PRIMARY KEY (tournament_id, participant),
    FOREIGN KEY (tournament_id) REFERENCES tournamently.TOURNAMENTS(id),
    FOREIGN KEY (participant) REFERENCES tournamently.USERS(email)
);

CREATE TABLE tournamently.SPONSORS (
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    logo VARCHAR(255),
    website VARCHAR(255)
);

CREATE TABLE tournamently.TOURNAMENT_SPONSORS (
    tournament_id INT NOT NULL,
    sponsor_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (tournament_id, sponsor_name),
    FOREIGN KEY (tournament_id) REFERENCES tournamently.TOURNAMENTS(id),
    FOREIGN KEY (sponsor_name) REFERENCES tournamently.SPONSORS(name)
);

CREATE TABLE tournamently.TOURNAMENT_RESULTS (
    tournament_id INT NOT NULL,
    participant1 VARCHAR(255) NOT NULL,
    participant2 VARCHAR(255) NOT NULL,
    score1 INT NOT NULL,
    score2 INT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (tournament_id, participant1, participant2),
    FOREIGN KEY (tournament_id) REFERENCES tournamently.TOURNAMENTS(id),
    FOREIGN KEY (participant1) REFERENCES tournamently.USERS(email),
    FOREIGN KEY (participant2) REFERENCES tournamently.USERS(email)
);