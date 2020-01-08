const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Таблица загрузки");
table.setHeading("Команда", "Статус загрузки");

module.exports = client => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file =>
            file.endsWith(".js")
        );

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, "✅");
            } else {
                table.addRow(file, "❌ -> может, что-то забыли??");
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    console.log(table.toString());
};