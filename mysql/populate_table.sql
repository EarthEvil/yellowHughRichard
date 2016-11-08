
insert into account(user_id, account_number, balance) values (5,"xyz100", 100);
insert into account(user_id, account_number, balance) values (5,"xyz101", 100);

insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 100,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 300,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'deposit', 100,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(2, 'deposit', 100,NOW());
insert into transaction (account_id,transaction_type, amount, time) values(1, 'debit', 300,NOW());

insert into user(username, hash) values ('user1', 'passowrd1');
insert into user(username, hash) values ('user2', 'passowrd2');
insert into user(username, hash) values ('user3', 'passowrd3');
insert into user(username, hash) values ('test', 'test');



select * from account;
select * from transaction;
select * from user;



join sql

select account_number, balance from account join 
(select user_id from user where username = "tongmingleee") usertable;