const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    aliases: ["insta", "инста", "инстаграм"],
    category: "info",
    description: "Возвращает всю статистику Инстаграм аккаунта",
    usage: "<name>",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        const name = args.join(" ");
        if (!name) {
            return message
                .reply("Может Вы напишите ник для нахождения человека, а?..")
                .then(m => m.delete(5000));
        }

        const url = `https://instagram.com/${name}/?__a=1`;
        const res = await fetch(url).then(url => url.json());

        if (!res.graphql.user.username) {
            return message
                .reply(
                    "Я не могу найти такой аккаунт... Посмотрите, может ошиблись в написании?"
                )
                .then(m => m.delete(5000));
        }

        const account = res.graphql.user;
        const embed = new RichEmbed()
            .setColor("#bc2a8d")
            .setTitle(`Instagram: ${account.username}`)
            .setURL(account.external_url_linkshimmed)
            .setThumbnail(account.profile_pic_url_hd)
            .addField(
                "Информация об аккаунте",
                stripIndents `**- Ник:** ${account.username}
            **- Полное имя:** ${account.full_name}
            **- Биография(описание):** ${
              account.biography.length == 0 ? "Пусто" : account.biography
            }
            **- Постов:** ${account.edge_owner_to_timeline_media.count}
            **- Кол-во подписчиков:** ${account.edge_followed_by.count}
            **- Кол-во подписок:** ${account.edge_follow.count}
            **- Приватность аккаунта:** ${
              account.is_private ? "Да 🔐" : "Нет 🔓"
            }`
            );

        message.channel.send(embed);
    }
};