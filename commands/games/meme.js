const { RichEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
    name: "meme",
    aliases: ["mem", "mm", "мем", "мемы"],
    category: "games",
    description: `Быстрая выдача любого "мема"`,
    usage: "[line]",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        if (args[0] === "secgus") {
            let memesec = new RichEmbed()
                .setColor("RED")
                .setTitle("Как ты это нашёл?..")
                .setImage("https://imgur.com/a/PALt2ks");

            return message.channel.send(memesec);
        } else {
            const subReddits = ["dankmeme", "meme", "me_irl"];
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];

            const img = await randomPuppy(random);
            const memeEmbed = new RichEmbed()
                .setColor("ORANGE")
                .setTitle("🆗 Мемы 🆗")
                .setFooter(`Взято с /r/${random}`)
                .setImage(img)
                .setURL(`https://reddit.com/r/${random}`);

            message.channel.send(memeEmbed);
        }
    }
};