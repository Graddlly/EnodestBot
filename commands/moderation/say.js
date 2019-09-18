const { RichEmbed } = require('discord.js');

module.exports = {
    name: "say",
    aliases: ["broadcast", "bc", "сказать", "крикнуть"],
    category: "moderation",
    description: "Быстрое сказание любой фразы",
    usage: "<usage>",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        if (args.length < 1) return message.reply("Вам нечего сказать, или что?").then(m => m.delete(5000));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "embed" || args[0].toLowerCase() === "рамка") {
            const embed = new RichEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setImage(client.user.displayAvatarURL)
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setFooter(client.user.username, client.user.displayAvatarURL);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}