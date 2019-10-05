const { RichEmbed } = require('discord.js');
const { randomInteger } = require('../../functions.js');
const superagent = require('superagent');

module.exports = {
    name: "meme",
    aliases: ["mem", "mm", "мем", "мемы"],
    category: "games",
    description: `Быстрая выдача любого "мема"`,
    usage: "[line]",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        if (args[0] === 'secgus') {
            let memesec = new RichEmbed()
                .setColor("RED")
                .setTitle("Как ты это нашёл?..")
                .setImage("https://imgur.com/a/PALt2ks");

            return message.channel.send(memesec);
        } else {
            let { body } = await superagent
                .get(`https://api.imgflip.com/get_memes`);

            let memeEmbed = new RichEmbed()
                .setColor("ORANGE")
                .setTitle("🆗 Мемы 🆗")
                .setImage(body.data.memes[parseInt(randomInteger(0, 99))].url);

            return message.channel.send(memeEmbed);
        }
    }
}