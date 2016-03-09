var request = require('request')
var process = require('process')
var cheerio = require('cheerio')

var gameId = "66,127"
var interval = 2000

console.log("Hello ! Watching Italy-Sweden tickets availability...")
requestAvailability()

function requestAvailability(){
	request('http://www.uefa.com/uefaeuro/ticketing/matchlist/index.html', function(error, response, body){
		if(!error && response.statusCode == 200){
			$ = cheerio.load(body)
			// data-teams="66,127" && class="tickets-match_row"
			// if no class "tickets-not-avail", then tickets available
			if($('[data-teams="'+gameId+'"]').hasClass("tickets-not-avail")){
				// no ticket, retry
				process.stdout.write(".")
				setTimeout(requestAvailability, interval)
			} else {
				// tickets !!!
				console.log("tickets!!")
			}
		}
	})
}