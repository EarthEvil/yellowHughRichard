# table creation
CREATE TABLE customer
	(customer_id int NOT NULL AUTO_INCREMENT,
	name varchar(30),
	age int,
	address varchar(30),
	PRIMARY KEY (customer_id));

CREATE TABLE user
	(user_id int NOT NULL AUTO_INCREMENT,
	username varchar(30),
	salt varchar(20),
	hash varchar(64),
	INDEX (username),
	PRIMARY KEY (user_id));


CREATE TABLE account
	(account_id int NOT NULL AUTO_INCREMENT,
	customer_id int,
	balance NUMERIC,
	PRIMARY KEY (account_id),
	FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
	ON DELETE CASCADE);

CREATE TABLE transaction
	(transaction_id  int NOT NULL AUTO_INCREMENT,
	account_id int NOT NULL,
	transaction_type varchar(8) NOT NULL,
	amount NUMERIC,
	time DATETIME, 
	PRIMARY KEY (transaction_id),
	FOREIGN KEY (account_id) REFERENCES account(account_id)
	ON DELETE CASCADE);
