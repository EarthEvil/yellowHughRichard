# table creation

CREATE TABLE user
	(user_id int NOT NULL AUTO_INCREMENT,
	username varchar(30) ,
	salt varchar(20),
	hash varchar(64),
	first_name varchar(30),
	last_name varchar(30),
	phone_number varchar(20),
	email varchar(40),
	gender varchar(6),   #ISO/IEC 5218 0= unknow, 1 = male 2 = female .....
	income int,
	date_of_birth date,
	address varchar(30),
	UNIQUE(username),
	INDEX (username),
	PRIMARY KEY (user_id));


CREATE TABLE account
	(account_id int NOT NULL AUTO_INCREMENT,
	user_id int,
	account_number varchar(10) ,
	balance NUMERIC,
	UNIQUE(account_number),
	PRIMARY KEY (account_id),
	FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE);


CREATE TABLE transaction
	(transaction_id  int NOT NULL AUTO_INCREMENT,
	account_id int NOT NULL,
	transaction_type varchar(8) NOT NULL,
	amount NUMERIC,
	time DATETIME, 
	PRIMARY KEY (transaction_id),
	FOREIGN KEY (account_id) REFERENCES account(account_id)	ON DELETE CASCADE);

CREATE TABLE user_activation
	(user_activation_id  int NOT NULL AUTO_INCREMENT,
	user_id int NOT NULL,
	username varchar(30) NOT NULL,
	email varchar(30) NOT NULL,
	activate boolean,
	PRIMARY KEY (user_activation_id),
	FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE);


CREATE TABLE login_history
	(id  int NOT NULL AUTO_INCREMENT,
	user_id int NOT NULL,
	ip_address varchar(20) NOT NULL,
	time DATETIME  NOT NULL,
	location varchar(20),
	INDEX (user_id),
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES user(user_id)	ON DELETE CASCADE);