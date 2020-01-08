const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    memberJoined: function(membername, memberid, avatar, guildid, createdAt) {
        const embed = new RichEmbed()
            .setTitle("Заход участника на канал")
            .setColor("#00ff00")
            .setThumbnail(avatar)
            .setFooter("ID пользователя: " + memberid)
            .setTimestamp()
            .setDescription(stripIndents `**> Прозвище (nickname) участника:** ${membername.tag} (${memberid})
            **> ID канала:** ${guildid}
            **> Аккаунт создан:** ${createdAt}`);

        return embed;
    },

    memberLeft: function(
        membername,
        memberid,
        avatar,
        guildid,
        joinedAt,
        createdAt
    ) {
        const embed = new RichEmbed()
            .setTitle("Выход участника с канала")
            .setColor("#ffa500")
            .setThumbnail(avatar)
            .setFooter("ID пользователя: " + memberid)
            .setTimestamp()
            .setDescription(stripIndents `**> Прозвище (nickname) участника:** ${membername.tag} (${memberid})
            **> ID канала:** ${guildid}
            **> Аккаунт создан:** ${createdAt}
            **> Заходил на канал:** ${joinedAt}`);

        return embed;
    },

    memberBanned: function(username, id, avatar, reason) {
        const embed = new RichEmbed()
            .setTitle("Бан участника на канале")
            .setColor("#ff0000")
            .setThumbnail(avatar)
            .setFooter("ID пользователя: " + id)
            .setTimestamp()
            .setDescription(stripIndents `**> Выкинутый (забанненый) участник:** ${username.tag} (${id})
            **> Причина бана:** ${reason}`);

        return embed;
    },

    memberUnbanned: function(username, id, avatar) {
        const embed = new RichEmbed()
            .setTitle("Разбан участника на канале")
            .setColor("#015ad6")
            .setThumbnail(avatar)
            .setFooter("ID пользователя: " + id)
            .setTimestamp()
            .setDescription(
                `**> Выкинутый (забанненый) участник:** ${username.tag} (${id})`
            );

        return embed;
    },

    messageEdited: function(oldMessage, newMessage, avatar) {
        const embed = new RichEmbed()
            .setTitle("Изменение сообщения")
            .setColor("#800080")
            .setThumbnail(avatar)
            .setFooter("ID пользователя: " + oldMessage.author.id)
            .setTimestamp()
            .setDescription(stripIndents `**> Автор (+ изменения):** ${oldMessage.author.username} (${oldMessage.author.id})
            **> Старое сообщение:** ${oldMessage}
            **> Новое сообщение:** ${newMessage}
            **> Канал, на котором произведено изменение сообщения:** ${oldMessage.channel} [Перейти к сообщению](${newMessage.url})`);

        return embed;
    },

    messageDeleted: function(message, author, avatar) {
        const embed = new RichEmbed()
            .setTitle("Удаление сообщения")
            .setColor("#ffff00")
            .setThumbnail(avatar)
            .setFooter(`ID пользователя: ${author.id} | ID Сообщения: ${message.id}`)
            .setTimestamp()
            .setDescription(stripIndents `**> Автор (+ удаления):** ${author.tag} (${author.id})
            **> Сообщение:** ${message.content}
            **> Удалено на канале:** ${message.channel} (${message.channel.id})`);

        return embed;
    },

    bulkDelete: function(avatar, guildid, channel) {
        const embed = new RichEmbed()
            .setTitle("Массовое удаление сообщений")
            .setColor("#a10000")
            .setThumbnail(avatar)
            .setFooter(`ID канала: ${guildid}`)
            .setTimestamp()
            .setDescription(
                stripIndents `**> Произведено массовое удаление сообщений на канале:** ${channel} (${channel.id})`
            );

        return embed;
    },

    channelCreated: function(avatar, id, channeltype, channelname, createdAt) {
        const embed = new RichEmbed()
            .setTitle("Создание канала")
            .setColor("#cbff39")
            .setThumbnail(avatar)
            .setFooter(`ID канала: ${id}`)
            .setTimestamp()
            .setDescription(stripIndents `**> Создание канала:** ${channelname} (${id})
            **> Тип созданного канала:** ${channeltype}
            **> Канал создан:** ${createdAt}`);

        return embed;
    },

    channelDeleted: function(avatar, id, channeltype, channelname, createdAt) {
        const embed = new RichEmbed()
            .setTitle("Удаление канала")
            .setColor("#c34d57")
            .setThumbnail(avatar)
            .setFooter(`ID канала: ${id}`)
            .setTimestamp()
            .setDescription(stripIndents `**> Удаление канала:** ${channelname} (${id})
            **> Тип удаленного канала:** ${channeltype}
            **> Канал был создан:** ${createdAt}`);

        return embed;
    },

    roleCreated: function(avatar, id, rolename, roleperm, createdAt) {
        const embed = new RichEmbed()
            .setTitle("Создание роли")
            .setColor("#98fb98")
            .setThumbnail(avatar)
            .setFooter(`ID роли: ${id}`)
            .setTimestamp()
            .setDescription(stripIndents `**> Создание роли:** ${rolename} (${id})
            **> Код привилегии роли:** ${roleperm}
            **> Роль была создана:** ${createdAt}`);

        return embed;
    },

    roleDeleted: function(avatar, id, rolename, roleperm, createdAt) {
        const embed = new RichEmbed()
            .setTitle("Удаление роли")
            .setColor("#ffb02e")
            .setThumbnail(avatar)
            .setFooter(`ID роли: ${id}`)
            .setTimestamp()
            .setDescription(stripIndents `**> Удаление роли:** ${rolename} (${id})
            **> Код привилегий роли:** ${roleperm}
            **> Роль была создана:** ${createdAt}`);

        return embed;
    },

    nickChanged: function(avatar, oldName, newName, id) {
        const embed = new RichEmbed()
            .setTitle("Смена ника участника")
            .setColor("#92a8d1")
            .setThumbnail(avatar)
            .setFooter(`ID пользователя: ${id}`)
            .setTimestamp()
            .setDescription(stripIndents `**> Старый ник участника:** ${oldName}
            **> Новый ник участника:** ${newName}`);

        return embed;
    }
};