import onMessage from './handlers/on-message.js'
import { log } from 'wechaty-puppet'
import { v4 } from 'uuid'

import ChatDevice from './chat-device.js'

function WechatyMqttPlugin(config) {
  return function (bot) {
    const chatdev = new ChatDevice(config, bot)

    const eventLoggerConfig = config.eventLoggerConfig || []
    log.verbose('WechatyPluginContrib', 'EventLogger installing on %s ...', bot)

    for (const i in eventLoggerConfig) {
      const eventName = eventLoggerConfig[i]
      if (eventName === 'message') {
        bot.on('message', async (msg) => {
          await onMessage(msg, chatdev)
          chatdev.pubEvent(eventName, msg.payload)
        })
      } else if (eventName === 'login') {
        bot.on('login', (user) => {
          const curTime = new Date().getTime()
          const state = {
            "reqId": v4(),
            "method": "thing.property.post",
            "version": "1.0",
            "timestamp": curTime,
            "bindName": "MAIN",
            "properties": {
  
            }
          }
  
          state.properties.lastUpdate = curTime
          state.properties.userSelf = user.payload
          state.properties.contactList = []
          state.properties.roomList = []
          state.properties.login = true
          chatdev.pubProperty(state)
          chatdev.pubEvent(eventName, user.payload)
        })

      } else {
        bot.on(eventName, (...args) => {
          log.info('WechatyPluginContrib', 'EventLoggerPlugin() %s: %s', eventName, JSON.stringify(args))

          if (args.length) {
            chatdev.pubEvent(eventName, args[0].payload || eventName, args[0])
          } else {
            chatdev.pubEvent(eventName, {})

          }
          if (eventName === 'error') {
            console.error(args[0])
          }
        })
      }

    }

  }
}

export { WechatyMqttPlugin }

export default WechatyMqttPlugin
