# table creation

CREATE TABLE user
	(user_id int NOT NULL AUTO_INCREMENT,
	username varchar(30) UNIQUE,
	salt varchar(20),
	hash varchar(64),
	first_name varchar(30),
	last_name varchar(30),
	phone_number varchar(20),
	email varchar(40),
	gender varchar(6),   #ISO/IEC 5218 0= unknow, 1 = male 2 = female .....
	age int,
	income int,
	date_of_birth date,
	address varchar(30),
	INDEX (username),
	PRIMARY KEY (user_id));


CREATE TABLE account
	(account_id int NOT NULL AUTO_INCREMENT,
	user_id int,
	account_number varchar(10),
	balance NUMERIC,
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
