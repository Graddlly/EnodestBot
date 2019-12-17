if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required.');

try {
    var { Client, Collection } = require('discord.js');
    var { config } = require('dotenv');
    var { randomInteger, formatDate } = require("./functions.js");
    var fs = require('fs');
    var mes = require("./mes_events.js");
} catch (e) {
    console.log(e.stack);
    console.log(process.version);
    console.log("Please run npm install and ensure it passes with no errors!");
    process.exit();
};

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

client.on("ready", () => {
    console.log(`Включение систем работы XeolisBot...\nЯ в сети! Мое имя ${client.user.username}\nВерсия Node: ${process.version}`);

    let statuses = [
        "Xeolis Project | Живем, чтобы играть!",
        "только для вас!",
        "Как управлять людьми и не спалиться...",
        "Просто играем и наслаждаемся музыкой!"
    ];

    setInterval(function() {
        client.user.setPresence({
            status: "online",
            game: {
                name: statuses[randomInteger(0, 3)],
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

//Event Handlers (Basic System)
client.on('warn', console.warn);
client.on('error', console.error);
client.on('disconnect', () => console.log("Я отключился, но надеюсь, что скоро снова заработаю!"));
client.on('reconnecting', () => console.log("Я переподключаюсь... Подождите меня!"));

//Event Handlers (Log System)
client.on('guildMemberAdd', async member => {
    var channel = member.guild.channels.find(x => x.name === `${process.env.LOGS}`);
    if (!channel) return;
    channel.send(mes.memberJoined(member.user, member.user.id, member.user.displayAvatarURL, member.guild.id, formatDate(member.user.createdAt)));
});

client.on('guildBanAdd', async(guild, user) => {
    var channel = guild.channels.find(x => x.name === `${process.env.LOGS}`);
    if (!channel) return;
    guild.fetchBan(user).then(({ reason }) =>
        channel.send(mes.memberBanned(user, user.id, user.displayAvatarURL, reason))
    );
});

client.on('guildMemberRemove', async member => {
    var channel = member.guild.channels.find(x => x.name === `${process.env.LOGS}`);
    if (!channel) return;
    channel.send(mes.memberLeft(member.user, member.user.id, member.user.displayAvatarURL, member.guild.id, formatDate(member.joinedAt), formatDate(member.user.createdAt)));
});

client.on('guildBanRemove', async(guild, user) => {
    var channel = guild.channels.find(x => x.name === `${process.env.LOGS}`);
    if (!channel) return;
    channel.send(mes.memberUnbanned(user, user.id, user.displayAvatarURL));
});

client.on('messageUpdate', async(oldMessage, newMessage) => {
    var channel = oldMessage.guild.channels.find(x => x.name === `${process.env.LOGS}`);
    if (!channel) return;
    if (oldMessage.content === newMessage.content) return;
    if (newMessage.author.bot) return;
    channel.send(mes.messageEdited(oldMessage, newMessage, newMessage.author.displayAvatarURL));
});

client.on('messageDelete', async message => {
    var channel = message.guild.channels.find(x => x.name === `${process.env.LOGS}`);
    if (!channel) return;
    if (message.author.bot) return;
    channel.send(mes.messageDeleted(message, message.author, message.author.displayAvatarURL));
});

client.on('messageDeleteBulk', async messages => {
    var channel = messages.first().guild.channels.find(x => x.name === `${process.env.LOGS}`);
    if (!channel) return;
    channel.send(mes.bulkDelete(messages.first().guild.iconURL, messages.first().guild.id, messages.first().channel));
});

client.on('channelCreate', async channel => {
    var addchan = channel.client.guilds.find(ch => ch.channels.find(x => x.id === `${channel.id}`));
    var channellog = channel.guild.channels.find(ch => ch.name === `${process.env.LOGS}`);
    if (!channellog) return;
    channellog.send(mes.channelCreated(addchan.iconURL, channel.id, channel.type, channel.name, formatDate(channel.createdAt)));
});

client.on('channelDelete', async channel => {
    var channellog = channel.guild.channels.find(ch => ch.name === `${process.env.LOGS}`);
    var addchan = channellog.client.guilds.find(ch => ch.channels.find(x => x.id === `${channellog.id}`));
    if (!channellog) return;
    channellog.send(mes.channelDeleted(addchan.iconURL, channel.id, channel.type, channel.name, formatDate(channel.createdAt)));
});

client.on('roleCreate', async role => {
    var addchan = role.client.guilds.find(ch => ch.roles.find(x => x.id === `${role.id}`));
    var channellog = role.guild.channels.find(ch => ch.name === `${process.env.LOGS}`);
    if (!channellog) return;
    channellog.send(mes.roleCreated(addchan.iconURL, role.id, role.name, role.permissions, formatDate(role.createdAt)));
});

client.on('roleDelete', async role => {
    var addchan = role.client.guilds.find(ch => ch.roles.find(x => x.id === `${role.id}`));
    var channellog = role.guild.channels.find(ch => ch.name === `${process.env.LOGS}`);
    if (!channellog) return;
    channellog.send(mes.roleDeleted(addchan.iconURL, role.id, role.name, role.permissions, formatDate(role.createdAt)));
});

client.on('guildMemberUpdate', async(oldMember, newMember) => {
    var channellog = newMember.guild.channels.find(ch => ch.name === `{${process.env.LOGS}}`);
    if (!channellog) return;
    if (oldMember.displayName !== newMember.displayName) channellog.send(mes.nickChanged(oldMember.user.displayAvatarURL, oldMember.user.tag, newMember.user.tag, newMember.user.id));
});

process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(1);
});


client.login(process.env.TOKEN);