# table creation
CREATE TABLE customer
	(customer_id 		int NOT NULL AUTO_INCREMENT ,
	name 				varchar(30),
	age	 				int,
	address	 			varchar(30),
	PRIMARY KEY (customer_id));

CREATE TABLE account
	(account_id	 		int NOT NULL AUTO_INCREMENT,
	customer_id		 	int,
	balance		 		NUMERIC	,
	PRIMARY KEY (account_id),
	FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
	ON DELETE CASCADE);

CREATE TABLE transaction
	(transaction_id	 	int NOT NULL AUTO_INCREMENT,
	fromaccount		 	int NOT NULL,
	toaccount		 	int NOT NULL,
	amount			 	NUMERIC,
	time 				DATE, 
	PRIMARY KEY (transaction_id),
	FOREIGN KEY (fromaccount) REFERENCES account(account_id)
	ON DELETE CASCADE,
	FOREIGN KEY (toaccount) REFERENCES account(account_id)
	ON DELETE CASCADE);

# populate table

