const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions.js');

module.exports = {
    name: "kick",
    aliases: ["кик"],
    category: "moderation",
    description: "Выполняет выброс (кик) участника с сервера",
    usage: "<id | mention>",
    run: async(client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("Не можете найти этого человека? А зачем тогда кик? xD")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("Пожалуйста, укажите причину кика данного участника...")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ У Вас нет прав на выгон (кик) участников с сервера. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ У меня нет прав на выгон (кик) участников с сервера. Если Вы полагаете, что это ошибка - обратитесь к администратору.")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toKick) {
            return message.reply("Не могу найти этого человека? Может, его никогда и не существовало... 👻")
                .then(m => m.delete(5000));
        }

        if (message.author.id === toKick.id) {
            return message.reply("Эм... А зачем кикать самого себя!? Вы - мазохист?😰")
                .then(m => m.delete(5000));
        }

        if (!toKick.kickable) {
            return message.reply("Вот, блиииннн... А мой начальник (Discord) запретил его выгонять... Апитки😫")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents `**> Выкинутый (кикнутый) участник:** ${toKick} (${toKick.id})
            **> Был выгнан модератором:** ${message.author} (${message.author.id})
            **> Причина:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("Это подтверждение будет действительно в течение 30 секунд...")
            .setDescription(`Вы действительно хотите выгнать (кикнуть) участника: ${toKick}?`);

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Так... Что-то пошло не так... Может, ошибка!?`);
                    });
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply("Процедура выгона (кика) участника прекращена!")
                    .then(m => m.delete(5000));
            }
        });
    }
}