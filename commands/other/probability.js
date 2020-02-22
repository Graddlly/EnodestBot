const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage, randomInteger } = require("../../functions.js");

module.exports = {
    name: "probability",
    aliases: ["100", "prob", "вероятность", "информ"],
    category: "games",
    description: "Выдает случайную процентную вероятность",
    usage: "<line>",
    run: async(client, message, args) => {
        if (!args[0]) {
            return message
                .reply("Не можете придумать, что проверять? А зачем тогда играть? xD")
                .then(m => m.delete(5000));
        } else {
            if (message.deletable) message.delete();

            const embed = new RichEmbed()
                .setColor("PURPLE")
                .setThumbnail(message.author.displayAvatarURL)
                .setFooter(message.member.displayName, message.author.displayAvatarURL)
                .setTimestamp()
                .setDescription(stripIndents `**> Запрашивающий игрок:** ${
        message.author.username
      } (${message.author.id})
            **> Запрос:** ${args.slice(0).join(" ")}
            **> Вероятность:** ${randomInteger(0, 100)} %`);

            const promptEmbed = new RichEmbed()
                .setColor("GREEN")
                .setAuthor(
                    "Это подтверждение будет действительно в течение 30 секунд..."
                )
                .setDescription(
                    `Вы действительно хотите узнать о(-б): ${args.slice(0).join(" ")}?`
                );

            message.channel.send(promptEmbed).then(async msg => {
                const emoji = await promptMessage(msg, message.author, 30, [
                    "✅",
                    "❌"
                ]);

                if (emoji === "✅") {
                    msg.delete();

                    message.channel.send(embed).catch(err => {
                        if (err)
                            return message.channel.send(
                                `Так... Что-то пошло не так... Может, ошибка!?`
                            );
                    });
                } else if (emoji === "❌") {
                    msg.delete();

                    message
                        .reply(`Процедура игры "Вероятности" прекращена!`)
                        .then(m => m.delete(5000));
                }
            });
        }
    }
};