
CPEG489 Senior Design -
Project: Transaction Processing in the Cloud
Group Name: Elastic 

for University of Delaware CPEG498 senior design class

Amazon ec2 host: 
http://ec2-54-86-74-235.compute-1.amazonaws.com/


Web front end: Javascript (AngularJS framework), HTML, CSS 
Web back end: 
	NodeJS(Express framework)
	Nginx as Reverse Proxy Server
		implementing caching, load balance
Database: MySQL (mysql cluster for distributed database) on Amazon RDS

Useful link:
	aws Auto Scaling: docs.aws.amazon.com/autoscaling/latest/userguide/WhatIsAutoScaling.html
	CAPSTONE: https://sites.google.com/site/udececapstone/
	Artillery(stress test)： https://artillery.io/docs/gettingstarted.html
	PHP vs Node.js： https://www.sitepoint.com/sitepoint-smackdown-php-vs-node-js/
	Kaboom： https://sites.google.com/a/udel.edu/kaboom/home
	5 Performance Tips： https://www.nginx.com/blog/5-performance-tips-for-node-js-applications/


TODO:
	make front end beautiful
	Use Nginx
		Cache Static Files
		load balance
	Auto Scaling

Note:

Node Cluster: To take advantage of multi-core systems

Performance:
	current action(debit/deposit/inquire) take 3-5 ms
Stress test:
	metrix: 
		response time
		data integrity
		failed request
		total request
		concurrent request




Web back end (Web server): NodeJS(Express framework) Socket.io for bi-directional communication channel between a client and a server (what about REST and SOAP) Socket: Stateful REST: HTTP is stateless, caching is big advantage use REST then

REST and SOAP comparison: http://spf13.com/post/soap-vs-rest | why we choose REST over SOAP

- choose angular $http over $ajax
- caching  



Error: listen EADDRINUSE
ps aux | grep node
