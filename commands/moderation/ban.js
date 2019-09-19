const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
    name: "ban",
    aliases: ["бан"],
    category: "moderation",
    description: "Выполняет выброс (бан) участника с сервера",
    usage: "<id | mention>",
    run: async(client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Не можете найти этого человека? А зачем тогда бан? xD")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("Пожалуйста, укажите причину бана данного участника...")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ У Вас нет прав на выгон (бан) участников с сервера. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ У меня нет прав на выгон (бан) участников с сервера. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toBan) {
            return message.reply("Не могу найти этого человека? Может, его никогда и не существовало... 👻")
                .then(m => m.delete(5000));
        }

        if (message.author.id === toBan.id) {
            return message.reply("Эм... А зачем банить самого себя!? Вы - мазохист?😰")
                .then(m => m.delete(5000));
        }

        if (!toBan.kickable) {
            return message.reply("Вот, блиииннн... А мой начальник (Discord) запретил его банить... Апитки😫")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents `**> Выкинутый (забанненый) участник:** ${toBan} (${toBan.id})
            **> Был забанен модератором:** ${message.author} (${message.author.id})
            **> Причина:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("Это подтверждение будет действительно в течение 30 секунд...")
            .setDescription(`Вы действительно хотите выгнать (забанить) участника: ${toBan}?`);

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toKick.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Так... Что-то пошло не так... Может, ошибка!?`);
                    });
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply("Процедура выгона (бана) участника прекращена!")
                    .then(m => m.delete(5000));
            }
        });
    }
}