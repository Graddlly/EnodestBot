const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

client.on('warn', console.warn);
client.on('error', console.error);
client.on('disconnect', () => console.log("Я отключился, но надеюсь, что скоро снова заработаю!"));
client.on('reconnecting', () => console.log("Я переподключаюсь... Подождите меня!"));

client.on("ready", () => {
    console.log(`Включение систем работы XeolisBot...`);
    console.log(`Я в сети! Мое имя ${client.user.username}`);

    let statuses = [
        "Xeolis Project | Живем, чтобы играть!",
        "только для вас!",
        "Как управлять людьми и не спалиться..."
    ];

    setInterval(function() {
        client.user.setPresence({
            status: "online",
            game: {
                name: statuses[randomInteger(0, 2)],
                type: "STREAMING",
                url: "https://www.twitch.tv/graddllyma"
            }
        })
    }, 10000);
});

client.on("message", async message => {
    const prefix = ">";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) command.run(client, message, args);
});

client.login(process.env.TOKEN);