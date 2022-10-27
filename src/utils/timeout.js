module.exports = {
  deleteMessage: function(message, time) {
    setTimeout(() => {
      message.delete().catch(() => {})
    }, time)
  },
  exitCall: function(player, time) {
    setTimeout(() => {
      if(!player.queue.current)
        player.destroy()
    }, time)
  }
}