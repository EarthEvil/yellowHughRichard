insert into customer ( name, age, address) values('tongming', 22, '13 withams');
insert into customer ( name, age, address) values( 'li', 15, '13 withams');

insert into account(customer_id, balance) values (1, 100);
insert into account(customer_id, balance) values (1, 100);
insert into account(customer_id, balance) values (1, 500);

insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 100,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 300,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 100,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(2, 'deposit', 100,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'debit', 300,NOW());

insert into user(username, hash) values ('user1', 'passowrd1');
insert into user(username, hash) values ('user2', 'passowrd2');
insert into user(username, hash) values ('user3', 'passowrd3');
insert into user(username, hash) values ('test', 'test');



select * from customer;
select * from account;
select * from transaction;
select * from user;
