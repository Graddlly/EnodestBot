const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
    name: "clear",
    aliases: ["очистка", "стереть"],
    category: "moderation",
    description: "Выполняет удаление нескольких сообщений с текстового канала разом",
    usage: "<number> [line]",
    run: async(client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;
        const channel = message.channel;

        if (message.deletable) message.delete();

        if (!args[0] || isNaN(args[0])) {
            return message.reply("Введите кол-во сообщений для удаления (в виде числа!)...")
                .then(m => m.delete(5000));
        }

        let reason = "";
        if (!args[1]) { reason = "Без причины" } else { reason = `${args.slice(1).join(" ")}` };

        const number = parseInt(args[0]) + parseInt(1);
        if (parseInt(number) > 100) number = 100;
        if (parseInt(number) < 0 || parseInt(number) == 0) {
            return message.reply("А зачем тогда вызывать эту команду вообще?..")
                .then(x => x.delete(5000));
        };

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("❌ У Вас нет прав на удаление сообщений в текстовых каналах. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("❌ У меня нет прав на удаление сообщений в текстовых каналах. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("PURPLE")
            .setThumbnail(message.author.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents `**> Канал, с которого были удалены сообщения:** ${channel} (${channel.id})
            **> Кол-во удаленных сообщений:** ${parseInt(args[0])}
            **> Были удалены модератором:** ${message.author} (${message.author.id})
            **> Причина:** ${reason}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("Это подтверждение будет действительно в течение 30 секунд...")
            .setDescription(`Вы действительно хотите удалить ${parseInt(args[0])} сообщений(-ие)?`);

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                channel.bulkDelete(number)
                    .catch(err => {
                        if (err) {
                            console.error("Error: " + err.message);
                            return message.channel.send(`Так... Что-то пошло не так... Может, ошибка!?`).then(m => m.delete(5000));
                        }
                    });
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply("Процедура удаления сообщений прекращена!")
                    .then(m => m.delete(5000));
            }
        });
    }
}