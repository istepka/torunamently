# Tournament organizer web application

## Description
A web application that allows users to create tournaments, join tournaments, track tournament progress, and view tournament results.


## Tech Stack
- Node.js
- Express
- MySQL
- React

## Application schema
This is just a draft that was created to get a better understanding of the application structure.
![Application schema](images/app_scheme.png)


## Installation
1. Clone the repository
```
git clone ...
```
2. Install dependencies
```
npm install
```
3. Change the dummy variables in `passkeys.key` file in the root directory and add your connection details to your local MySQL database.
```
USER, PASSWORD, tournamently
```


## Install and run MySQL
1. Install MySQL
```
sudo apt install mysql-server
```
2. Check MySQL status. It should be active and running.
```
sudo service mysql status
```
3. Check the network status
```
sudo ss -tap | grep mysql
```
4. If MySQL is not running, correctly, restart it.
```
sudo service mysql restart
```
5. If you make changes to the MySQL configuration file, restart MySQL with the following command:
```
sudo systemctl restart mysql.service
```

## License
MIT License
