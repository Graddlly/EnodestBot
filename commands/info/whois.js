const { getMember, formatDate } = require('../../functions.js');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
    name: "whois",
    aliases: ["userinfo", "user", "who", "кто", "участник"],
    category: "info",
    description: "Возвращает информацию об участнике",
    usage: "[username | id | mention]",
    run: async(client, message, args) => {
        const member = getMember(message, args.join(" "));

        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(", ") || "none";

        const created = formatDate(member.user.createdAt);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)

        .addField("__**Информация об участнике:**__", stripIndents `**> Имя:** ${member.displayName}
            **> Зашел на сервер:** ${joined}
            **> Роли:** ${roles}`, true)

        .addField("__**Информация о пользователе:**__", stripIndents `**> ID:** ${member.user.id}
            **> Имя:** ${member.user.username}
            **> Discord Tag:** ${member.user.tag}
            **> Создан:** ${created}`, true)

        .setTimestamp();

        if (member.user.presence.game) embed.addField("__**Играет:**__", `**> Название:** ${member.user.presence.game.name}`);

        message.delete();
        message.channel.send(embed);
    }
}