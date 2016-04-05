const request = require('request')
const process = require('process')
const cheerio = require('cheerio')
const player = require('play-sound')({})

/*** CONFIG ***/

// UEFA game id to check tickets
const gameId = '388137968'

// cookie required to be accepted by UEFA server
const token = "p1pkpcontroller1d-cfe8f2cdb96d14c418388033271ff61f6ff105a6c8241fe0a82ab4f466ab9f1d91d0490dcd8e36bdadcdb05dce44d34f4a53733b95e7819f934d0acfb38e76c6"

const account ="3EDCF7191AFAC509CE9AD3E15BB5B570"

// pushOver keys
const groupKey = "yourgroupkey"
const appKey = "yourappkey"

// sounds to play
const soundUrl = '/usr/share/sounds/gnome/default/alerts/bark.ogg'
const soundErrorUrl = '/usr/share/sounds/gnome/default/alerts/glass.ogg'

/**************/


/*** TECHNICAL CONFIG ***/

let errorCount = 0
const interval = 1000
const bigInterval = 2*1000*60

const uefaCookie = `AcpAT-v3-q-euro-resale=${token}`
const messageSuccess = `token=${appKey}&user=${groupKey}&html=1&priority=1&message=tickets&url=https://euro2016-resale.tickets.uefa.com/secured/selection/resale/item?performanceId=388137968&productId=388137748&url_title=tickets`
const messageError = `token=${appKey}&user=${groupKey}&message=`

/************************/

console.log("Hello ! Getting ready to check Italy-Sweden tickets availability...")

let found = false

console.log("Available?")
requestAvailability(token)

function requestAvailability(token){
	const options = {
		url: `https://euro2016-resale.tickets.uefa.com/selection/resale/resaleItemsWithoutSeating.json?lang=fr&performanceId=${gameId}`,
		headers: {
			'Cookie': uefaCookie
		}
	}
	
	request(options, (error, response, body) => {
		if(!error && response.statusCode == 200){
			errorCount = 0
			try{
				const json = JSON.parse(body)
				const tickets = json.resaleItems
				if(tickets.length){
					if(!found){
						playSound(10)
						found = true
						console.log("tickets")
						sendNotifSuccess()
					}
					setTimeout(function(){
						requestAvailability(token)
					}, interval)
				} else {
					found = false
					process.stdout.write(".")
					setTimeout(function(){
						requestAvailability(token)
					}, interval)
				}
			} catch(error){
				playErrorSound(5)
				sendNotifError("disconnected")
				found = false
				// not logged anymore
				console.log("not logged anymore, needs new token")
			}
		} else {
			errorCount++	
			found = false
			console.log("error")
			if(errorCount<5){	
				setTimeout(function(){
					requestAvailability(token)
				}, interval)
			} else {
				sendNotifError("error")
				playErrorSound(5)
			}
		}
	})
}

function sendNotifSuccess(){
	request({
		uri:'https://api.pushover.net/1/messages.json',
		method: "POST",
		body: messageSuccess
	}, (error, response, body) => {
		console.log(body)
	})
}

function sendNotifError(text){	
	request({
		uri:'https://api.pushover.net/1/messages.json',
		method: "POST",
		body: messageError+text
	}, (error, response, body) => {
		console.log(body)
	})
}

function playSound(n){
	if(n==0){
		return
	}
	player.play(soundUrl, err => {
		if(err){
			console.log(err)
			return
		}
		playSound(n-1)
	})
}

function playErrorSound(n){
	if(n==0){
		return
	}
	player.play(soundErrorUrl, err => {
		if(err){
			console.log(err)
			return
		}
		playErrorSound(n-1)
	})
}