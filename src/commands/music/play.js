const { MessageEmbed } = require("discord.js");

const Command = require("../../structures/Command");

const { convertTime } = require("../../utils/convert.js");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      description: "Toque uma música!",
      options: [
        {
          name: "música",
          description: "Música que você deseja ouvir",
          type: "STRING",
          required: true,
        },
      ],
    });
  }
  run = async (interaction) => {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: `Você precisa estar em um canal de voz para usar esse comando!`,
        ephemeral: true,
      });
    if (
      interaction.guild.me.voice.channel &&
      interaction.guild.me.voice.channel.id !==
        interaction.member.voice.channel.id
    )
      return interaction.reply({
        content: `Você precisa estar no mesmo canal de voz que eu para utilizar este comando!`,
        ephemeral: true,
      });

    const search = interaction.options.getString("música");

    const player = this.client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: true
    });

    if (player.state === "DISCONNECTED") player.connect();

    let res
    
    try {
      res = await this.client.manager.search(search, interaction.user);

      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return interaction.reply({
        content: `Aconteceu um erro ao tentar buscar a música: ${err.message}`,
        ephemeral: true,
      });
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(this.client.embedColor)
              .setTimestamp()
              .setDescription("Nenhum resultado encontrado!"),
          ],
          ephemeral: true,
        });
      case "TRACK_LOADED":
        player.queue.add(res.tracks[0], interaction.user);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();

        const trackLoad = new MessageEmbed()
          .setColor(this.client.embedColor)
          .setTimestamp()
          .setDescription(
            `[${res.tracks[0].title}](${res.tracks[0].uri}) - \`[${convertTime(
              res.tracks[0].duration
            )}]\` adicionado à fila.`
          );
        return await interaction.reply({ embeds: [trackLoad] });
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        if (!player.playing && !player.paused)
          await player.play();

        const PlaylistLoad = new MessageEmbed()
          .setColor(this.client.embedColor)
          .setTimestamp()
          .setDescription(
            `[${res.playlist.name}](${search}) - \`[${convertTime(
              res.playlist.duration
            )}]\` \n playlist adicionada`
          );
        return await interaction.reply({ embeds: [PlaylistLoad] });
      case "SEARCH_RESULT":
        const track = res.tracks[0];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.length) {
          const searchResult = new MessageEmbed()
            .setColor(this.client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setDescription(
              `[${track.title}](${track.uri}) - \`[${convertTime(
                track.duration
              )}]\` \n Adicionada à fila`
            );

          player.play();
          return await interaction.reply({ embeds: [searchResult] });
        } else {
          const thing = new MessageEmbed()
            .setColor(this.client.embedColor)
            .setTimestamp()
            .setThumbnail(track.displayThumbnail("3"))
            .setDescription(
              `[${track.title}](${track.uri}) - \`[${convertTime(
                track.duration
              )}]\` \n Adicionada à fila`
            );
          return await interaction.reply({ embeds: [thing] });
        }
    }

    if (!res?.tracks?.[0])
      return interaction.reply({
        content: `Música não encontrada!`,
        ephemeral: true,
      });

    player.queue.add(res.tracks[0]);

    if (!player.playing && !player.paused) player.play();

    return interaction.reply({
      content: `\`${res.tracks[0].title}\` adicionada à fila.`,
    });
  };
};
