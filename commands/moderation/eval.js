const { RichEmbed } = require("discord.js");
const beautify = require("beautify");

module.exports = {
    name: "eval",
    aliases: ["e", "сделать", "выполнить", "run"],
    category: "moderation",
    description: "Компилирует и выполняет код, который вы вписали",
    usage: "<code to eval>",
    run: async(client, message, args) => {
        if (message.author.id !== process.env.OWNERID) {
            return message.channel
                .send("Вы не владелец данного бота! Вы не можете исполнять команды!")
                .then(m => m.delete(5000));
        }

        if (!args[0]) {
            message.channel
                .send("Вам необходимо ввести код, для его компиляции и выполнения!")
                .then(m => m.delete(5000));
        }

        try {
            if (
                args
                .join(" ")
                .toLowerCase()
                .includes("token")
            ) {
                return;
            }

            const toEval = args.join(" ");
            const evaluated = eval(toEval);

            let embed = new RichEmbed()
                .setColor("#00FF00")
                .setTimestamp()
                .setFooter(
                    "Клиент отправки: " + client.user.username,
                    client.user.displayAvatarURL
                )
                .setTitle("Выполнение кода")
                .addField(
                    "Для выполнения: ",
                    `\`\`\`js\n${beautify(args.join(" "), { format: "js" })}\n\`\`\``
                )
                .addField("Код: ", evaluated)
                .addField("Образ объекта кода: ", typeof evaluated);

            if (message.deletable) message.delete();
            message.channel.send(embed).then(m => m.delete(10000));
        } catch (e) {
            let embed = new RichEmbed()
                .setColor("#FF0000")
                .setTitle(":x: Ошибка!")
                .setDescription(e)
                .setFooter(
                    "Клиент отправки: " + client.user.username,
                    client.user.displayAvatarURL
                );

            if (message.deletable) message.delete();
            message.channel.send(embed).then(m => m.delete(10000));
        }
    }
};