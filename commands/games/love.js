const { RichEmbed } = require("discord.js");
const { getMember } = require("../../functions.js");

module.exports = {
    name: "love",
    aliases: ["affinity", "любовь", "стачки"],
    category: "games",
    description: "Высчитывает вероятность любовных отношений с другим участником канала",
    usage: "[mention | id | username]",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        let person = getMember(message, args[0]);

        if (!person || message.author.id === person.id) {
            person = message.guild.members
                .filter(m => m.id !== message.author.id)
                .random();
        }

        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

        const embed = new RichEmbed()
            .setColor("#ffb6c1")
            .addField(
                `☁ **${person.displayName}** любит **${message.member.displayName}** на:`,
                `💟 ${Math.floor(love)}%\n\n${loveLevel}`
            );

        message.channel.send(embed);
    }
};