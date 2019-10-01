const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    aliases: ["h", "помощь"],
    category: "info",
    description: "Возвращает все команды бота, или информацию по определенной команде",
    usage: "[command | alias]",
    run: async(client, message, args) => {
        if (args[0]) {
            if (message.deletable) message.delete();
            return getCMD(client, message, args[0]);
        } else {
            if (message.deletable) message.delete();
            return getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const embed = new RichEmbed()
        .setColor("RANDOM")

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n");
    }

    const info = client.categories
        .map(cat => stripIndents `**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}

function getCMD(client, message, input) {
    const embed = new RichEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `Нет информации про команду **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    if (cmd.name) info = `**Название команды**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Алиасы (синонимы)**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Описание**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Использование**: ${cmd.usage}`;
        embed.setFooter(`Синтаксис: <> = обязательное, [] = опциональное`);
    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}