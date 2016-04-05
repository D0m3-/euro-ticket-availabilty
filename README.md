# euro-ticket-availabilty
This program was used to help get tickets on the UEFA Euro 2016 resell portal

The idea is use the webservice indicating if tickets are available for a given game, and play a sound and send a notification on phones.

# Configure pushover
[Pushover](https://pushover.net) allows you to send notifications on mobile devices through a simple API
Register to the website and enter your group key and application key in the source code

# Configure your sound files
If you want the program to play sounds (in case you're close to your computer), you can configure the source files

# Configure the cookie
This webservice requires a cookie who might expire after a while. So you first need to manually enter the resell portal and copy the cookie value in the source code (value of "AcpAT-v3-q-euro-resale"). Experience showed that the cookie never expires as long as you use it.
If the program stops, you will probably have to get a fresh one.