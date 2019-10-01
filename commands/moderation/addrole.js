const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
    name: "addrole",
    aliases: ["дроль", "добавитьроль", "arole"],
    category: "moderation",
    description: "Добавляет роль участнику сервера",
    usage: "<id | mention> <role>",
    run: async(client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Не можете найти этого человека? А зачем тогда добавлять ему роль? xD")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("Пожалуйста, укажите роль, которую хотите добавить этому участнику...")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("MANAGE_ROLES")) {
            return message.reply("❌ У Вас нет прав на изменение ролей участников с сервера. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            return message.reply("❌ У меня нет прав на изменение ролей участников с сервера. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        const toRole = message.mentions.members.first() || message.guild.members.get(args[0]);
        const role = message.mentions.roles.first() || message.guild.roles.find("name", args[1]);

        if (!toRole) {
            return message.reply("Не могу найти этого человека? Может, его никогда и не существовало... 👻")
                .then(m => m.delete(5000));
        }

        if (!role) {
            return message.reply("Не могу найти эту роль? Может, ошибка моего босса? Товарищ Discord... 🙇‍")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("ORANGE")
            .setThumbnail(toRole.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents `**> Участник, которому добавили роль:** ${toRole} (${toRole.id})
            **> Была выдана модератором:** ${message.author} (${message.author.id})
            **> Роль:** ${role}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("Это подтверждение будет действительно в течение 30 секунд...")
            .setDescription(`Вы действительно хотите выдать участнику ${toRole} роль ${role}?`);

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toRole.addRole(role)
                    .catch(err => {
                        if (err) return message.channel.send(`Так... Что-то пошло не так... Может, ошибка!?`);
                    });
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply("Процедура выдачи роли участнику прекращена!")
                    .then(m => m.delete(5000));
            }
        });
    }
}