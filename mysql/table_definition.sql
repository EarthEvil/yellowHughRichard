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
	ON DELETE CASCADE);w

CREATE TABLE transaction
	(transaction_id	 	int NOT NULL AUTO_INCREMENT,
	account_id		 	int NOT NULL,
	transaction_type 	varchar(8) NOT NULL,
	amount			 	NUMERIC,
	time 				DATE, 
	PRIMARY KEY (transaction_id),
	FOREIGN KEY (account_id) REFERENCES account(account_id)
	ON DELETE CASCADE);

# populate table


customer:

select * from customer where customer_id = 1;

Inquire:

select * from transaction where fromaccount = 1 or toaccount = 1;