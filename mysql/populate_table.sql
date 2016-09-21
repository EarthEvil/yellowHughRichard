insert into customer ( name, age, address) values('tongming', 22, '13 withams');
insert into customer ( name, age, address) values( 'li', 15, '13 withams');

insert into account(customer_id, balance) values (1, 100);
insert into account(customer_id, balance) values (1, 500);
insert into account(customer_id, balance) values (2, 100);

insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 100,CURDATE());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 300,CURDATE());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 100,CURDATE());
insert into transaction (account_id,transaction_type, amount, time) values(2, 'deposit', 100,CURDATE());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'debit', 300,CURDATE());
insert into transaction (account_id,transaction_type, amount, time) values(2, 'debit', 100,CURDATE());


