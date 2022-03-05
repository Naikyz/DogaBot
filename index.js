// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const TOKEN = process.env.TOKEN;
const axios = require("axios");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
i = 0;

async function getInfo() {
	const response = await axios({
		url: 'https://data.objkt.com/v2/graphql',
		method: 'post',
		data: {
		  query: `
		  	query {
				fa(where: {path: {_eq: "dogami"}}) {
					floor_price
				}
			}`
		}
	  })
	  return (response.data.data.fa[0].floor_price.toString());
}
client.on('ready', () => {
	console.log("READY")
	getInfo().then(function infos (result) {
		client.user.setActivity("Floor Price: " + result.slice(0, 3) + "," + result.slice(3, 5) + "ꜩ");
	});
	setInterval(() => {
		getInfo().then(function infos (result) {
			client.user.setActivity("Floor Price: " + result.slice(0, 3) + "," + result.slice(3, 5) + "ꜩ");
		});
	}, 120000);
})

client.login(TOKEN);