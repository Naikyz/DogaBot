const { Client, Intents, Permissions } = require('discord.js');
const Requests = require("./requests.js")
const TOKEN = process.env.TOKEN;
const axios = require("axios");
var mysql = require('mysql');

DATABASE = {}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

async function getUpdateData(client) {
    const channelsToFollow = ["📦 Alpha 1:", "📦 Alpha 2:", "🐕 Alpha 1:", "🐕 Alpha 2:", "📊 Volume:", "👕 GAP:"]
    client.guilds.cache.forEach((guild, key, map) => { // For each Guild
        if (!DATABASE[guild.id])
            DATABASE[guild.id] = {}

        channelsToFollow.forEach(async (channelToFollow) => { // For each channel to follow, get if exist or create new
            DATABASE[guild.id][channelToFollow] = null
            guild.channels.cache.forEach((value, key) => { // Search for the channel 
                if (value.name.startsWith(channelToFollow))
                    DATABASE[guild.id][channelToFollow] = value.id
            })
            if (!DATABASE[guild.id][channelToFollow]) { // Create channel if it didnt find it
                channel = await guild.channels.create(channelToFollow, {
                    type: 'GUILD_VOICE',
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [Permissions.FLAGS.CONNECT],
                        },
                    ],
                })
                DATABASE[guild.id][channelToFollow] = channel.id
            }
        })
    })
}

async function createDogamiInfoChannels(client) {
    await getUpdateData(client)
    let boxAlphaOneFloor = await Requests.getBoxAlphaOneFloor()
    let boxAlphaTwoFloor = await Requests.getBoxAlphaTwoFloor()
    let dogAlphaOneFloor = await Requests.getDogAlphaOneFloor()
    let dogAlphaTwoFloor = await Requests.getDogAlphaTwoFloor()
    let volume = await Requests.getTodaysVolume()
    let gapFloor = await Requests.getDogamiGapFloorPrice()
    const channelsToFollow = ["📦 Alpha 1:", "📦 Alpha 2:", "🐕 Alpha 1:", "🐕 Alpha 2:", "📊 Volume:", "👕 GAP:"]
    const channelsToFollowNames = [
        "📦 Alpha 1: " + (Math.round(boxAlphaOneFloor * 100) / 100).toFixed(2) + "ꜩ",
        "📦 Alpha 2: " + (Math.round(boxAlphaTwoFloor * 100) / 100).toFixed(2) + "ꜩ",
        "🐕 Alpha 1: " + (Math.round(dogAlphaOneFloor * 100) / 100).toFixed(2) + "ꜩ",
        "🐕 Alpha 2: " + (Math.round(dogAlphaTwoFloor * 100) / 100).toFixed(2) + "ꜩ",
        "📊 Volume: " + volume,
        "👕 GAP: " + (Math.round(gapFloor * 100) / 100).toFixed(2) + "ꜩ"
    ]
    client.guilds.cache.forEach((guild) => {
        channelsToFollow.forEach(async (value, key) => {
            let channel = await client.channels.fetch(DATABASE[guild.id][value])
            if (channel)
                channel.setName(channelsToFollowNames[key])
        })
    })
}

client.on('ready', async () => {
    console.log("Ready")
    Requests.getDogamiFloorPrice().then(function infos(result) {
        client.user.setActivity("Floor Price: " + result.slice(0, 3) + "," + result.slice(3, 5) + "ꜩ");
    });
    setInterval(() => {
        Requests.getDogamiFloorPrice().then(function infos(result) {
            client.user.setActivity("Floor Price: " + result.slice(0, 3) + "," + result.slice(3, 5) + "ꜩ");
        });
    }, 120000);

    createDogamiInfoChannels(client)
    setInterval(() => {
        createDogamiInfoChannels(client)
    }, 310000);
})

client.login(TOKEN);