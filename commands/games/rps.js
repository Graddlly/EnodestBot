const { RichEmbed } = require('discord.js');
const { promptMessage } = require('../../functions.js');

const chooseArr = ["🗻", "📰", "✂"];

module.exports = {
    name: "rps",
    aliases: ["parosc", "кнб", "канобу"],
    category: "games",
    description: `Игра: Камень-Ножницы-Бумага`,
    usage: "*rps* (только команда)",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();

        const embed = new RichEmbed()
            .setColor("#ffffff")
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
            .setDescription("Выберите один из вариантов, чтобы начать игру!")
            .setTimestamp();

        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        const result = await getResult(reacted, botChoice);
        await m.clearReactions();

        embed
            .setDescription("")
            .addField(result, `${reacted} vs ${botChoice}`);

        m.edit(embed);

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📰" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📰")) {
                return "Ты победил! УРА! 🎂";
            } else if (me === clientChosen) {
                return "Ничья - тоже игра! Класс! 🎎";
            } else {
                return "Ты проиграл =( Не расстраивайся, в следующий раз повезет! 🎆";
            }
        };
    }
}