if (process.version.slice(1).split(".")[0] < 8)
    throw new Error("Node 8.0.0 or higher is required.");

try {
    var { randomInteger, formatDate } = require("./functions.js");
    var { CommandoClient } = require("discord.js-commando");
    var { Structures } = require("discord.js");
    var conf = require("./config.json");
    var path = require("path");
} catch (e) {
    console.log(e.stack);
    console.log(process.version);
    console.log("Please run npm install and ensure it passes with no errors!");
    process.exit();
}

const client = new CommandoClient({
    unknownCommandResponse: false,
    commandPrefix: conf.prefix,
    disableEveryone: true,
    owner: conf.ownerid
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["other", "random types of command group"],
        ["moderation", "Moderation Command Group"],
        ["games", "Games Command Group"],
        ["music", "Music Command Group"],
        ["gifs", "Gif Command Group"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, "commands"));

Structures.extend("Guild", Guild => {
    class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                songDispatcher: null
            };
            this.triviaData = {
                isTriviaRunning: false,
                wasTriviaEndCalled: false,
                triviaQueue: [],
                triviaScore: new Map()
            };
        }
    }
    return MusicGuild;
});

client.on("ready", () => {
    console.log(
        `Включение систем работы XeolisBot...\nЯ в сети! Мое имя ${client.user.username}`
    );

    let statuses = [
        "Xeolis Project | Живем, чтобы играть!",
        "только для вас!",
        "Как управлять людьми и не спалиться...",
        "Просто играем и наслаждаемся музыкой!"
    ];

    setInterval(function() {
        client.user.setActivity(
            statuses[randomInteger(0, parseInt(statuses.length))], {
                type: "STREAMING",
                url: "https://www.twitch.tv/graddllyma"
            }
        );
    }, 10000);
});

//Event Handlers (Basic System)
client.on("warn", console.warn);
client.on("error", console.error);
client.on("disconnect", () =>
    console.log("Я отключился, но надеюсь, что скоро снова заработаю!")
);
client.on("reconnecting", () =>
    console.log("Я переподключаюсь... Подождите меня!")
);

process.on("unhandledRejection", reason => {
    console.error(reason);
    process.exit(1);
});

client.login(conf.token).catch(e => console.log(e));