module.exports = {
    name: "ping",
    aliases: ["пинг"],
    category: "info",
    description: "Возвращает пинг бота и API",
    run: async(client, message, args) => {
        if (message.deletable) message.delete();
        const msg = await message.channel.send(`🏓 Пингуюсь до сервера...`);

        msg.edit(
            `🏓 Понг\nЗадержка до сервера: ${Math.floor(
        msg.createdAt - message.createdAt
      )}мс\nЗадержка API бота: ${Math.round(client.ping)}ms`
        );
    }
};