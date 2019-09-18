const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    aliases: ["репорт", "report", "r", "-реп"],
    category: "moderation",
    description: "Отправляет заявку о нарушений правил участником(-ам) администраторам",
    usage: "<mention, id>",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("Не можете найти этого человека? А зачем тогда репорт? xD").then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Нельзя сделать репорт на этого участника").then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("Пожалуйста, укажите причину репорта на данного участника").then(m => m.delete(5000));

        const channel = message.guild.channels.find(c => c.name === "reports")

        if (!channel)
            return message.channel.send("Текстовый канал `#reports` не найден! Отмена операции...").then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Репорт участника", rMember.user.displayAvatarURL)
            .setDescription(stripIndents `**> Участник:** ${rMember} (${rMember.user.id})
            **> Репорт предоставил:** ${message.member}
            **> Репорт предоставил в:** ${message.channel}
            **> Причина:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}