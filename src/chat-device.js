/* eslint-disable sort-keys */
import mqtt from 'mqtt'
import { v4 } from 'uuid'
import { FileBox } from 'file-box'
// import {
//   Contact, log, Message, ScanStatus, Wechaty, UrlLink, MiniProgram,
// } from 'wechaty'
import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'

import { wechaty2chatdev, propertyMessage, eventMessage } from './msg-format.js'

class ChatDevice {

  constructor (config, bot) {
    this.bot = bot
    this.mqttclient = mqtt.connect(`mqtt://${config.endPoint}:${config.port}`, {
      clientId: config.clintId,
      password: config.password,
      username: config.username,
    })
    this.isConnected = ''
    this.eventApi = config.event
    this.commandApi = config.command
    this.propertyApi = config.property

    const onMessage = async (topic, message) => {
      const content = message.toString()
      log.info(content)
      message = JSON.parse(message)
      const name = message.name
      const params = message.params

      if (name === 'start') {
        log.info(name)
      }
      if (name === 'stop') {
        log.info(name)

      }
      if (name === 'logout') {
        log.info(name)

      }
      if (name === 'logonoff') {
        log.info(name)

      }
      if (name === 'userSelf') {
        log.info(name)

      }
      if (name === 'say') {
        log.info(name)

      }
      if (name === 'send') {
        await this.send(params, this.bot)
      }
      if (name === 'sendAt') {
        await this.sendAt(params, this.bot)
      }

      if (name === 'aliasGet') {
        log.info(name)

      }
      if (name === 'aliasSet') {
        log.info(name)

      }
      if (name === 'roomCreate') {
        await this.createRoom(params, this.bot)
      }
      if (name === 'roomAdd') {
        log.info(name)

      }
      if (name === 'roomDel') {
        log.info(name)

      }
      if (name === 'roomAnnounceGet') {
        log.info(name)

      }
      if (name === 'roomAnnounceSet') {
        log.info(name)

      }
      if (name === 'roomQuit') {
        log.info(name)

      }
      if (name === 'roomTopicGet') {
        log.info(name)

      }
      if (name === 'roomTopicSet') {
        log.info(name)

      }
      if (name === 'roomQrcodeGet') {
        await this.getQrcod(params, this.bot)

      }
      if (name === 'memberAllGet') {
        log.info(name)

      }
      if (name === 'contactAdd') {
        log.info(name)

      }
      if (name === 'contactAliasSet') {
        log.info(name)

      }
      if (name === 'contactFindAll') {
        await this.getAllContact(this.bot)
      }
      if (name === 'contactFind') {
        log.info(name)

      }
      if (name === 'roomFindAll') {
        await this.getAllRoom(this.bot)
      }
      if (name === 'roomFind') {
        log.info(name)

      }
      if (name === 'config') {
        log.info(name)

      }

    }

    this.mqttclient.on('connect', function () {
      this.isConnected = true
      log.info('connect to Wechaty mqtt success ----------')
    })
    this.mqttclient.on('reconnect', function (e) {
      log.info('subscriber on reconnect ----------')
    })
    this.mqttclient.on('disconnect', function (e) {
      log.info('disconnect--------', e)
      this.isConnected = false
    })
    this.mqttclient.on('error', function (e) {
      log.info('error----------', e)
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.mqttclient.on('message', onMessage)
    this.subCommand()
  }

  subCommand () {
    this.mqttclient.subscribe(this.commandApi, function (err) {
      log.info(err)
    })
  }

  pubProperty (msg) {
    this.mqttclient.publish(this.propertyApi, JSON.stringify(msg))
  }

  pubEvent (name, msg) {
    const payload = {
      reqId: v4(),
      method: 'thing.event.post',
      version: '1.0',
      timestamp: new Date().getTime(),
      events: {
      },
    }
    payload.events[name] = msg
    this.mqttclient.publish(this.eventApi, JSON.stringify(payload))
    console.debug('pubEvent success...')
  }

  async pubMessage (msg) {
    console.debug('pubMessage start...')

    try {
      const eventPayload = await wechaty2chatdev(msg)
      const payload = await propertyMessage('latestMessage',JSON.parse(eventPayload).events.message)
      this.mqttclient.publish(this.propertyApi, payload)
      console.debug('pubMessage success...')
    } catch (err) {
      console.error(err)
    }

  }

  static getBot () {
    return this.bot
  }

  async getAllContact () {
    const contactList = await this.bot.Contact.findAll()
    let friends = []
    for (const i in contactList) {
      const contact = contactList[i]
      let avatar = ''
      try {
        avatar = JSON.parse(JSON.stringify(await contact.avatar())).url
      } catch (err) {

      }
      const contactInfo = {
        alias: await contact.alias() || '',
        avatar: avatar,
        gender: contact.gender() || '',
        id: contact.id,
        name: contact.name() || '',
      }
      friends.push(contactInfo)

      if (friends.length === 100) {
        const msg = propertyMessage('contactList', friends)
        this.pubProperty(msg)
        friends = []
      }
    }
    const msg = propertyMessage('contactList', friends)
    this.pubProperty(msg)

  }

  async getAllRoom () {
    const roomList = await this.bot.Room.findAll()
    for (const i in roomList) {
      const room = roomList[i]
      const roomInfo = {}
      roomInfo.id = room.id

      const avatar = await room.avatar()
      roomInfo.avatar = JSON.parse(JSON.stringify(avatar)).url

      roomInfo.ownerId = room.owner().id
      try {
        roomInfo.topic = await room.topic()
      } catch (err) {
        roomInfo.topic = room.id
      }

      roomList[i] = roomInfo
    }
    const msg = propertyMessage('roomList', roomList)
    this.pubProperty(msg)
  }

  async send (params) {
    log.info(params)

    let msg = ''
    if (params.messageType === 'Text') {
      /* {
        "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
        "method":"thing.command.invoke",
        "version":"1.0",
        "timestamp":1610430718000,
        "name":"send",
        "params":{
            "toContacts":[
                "tyutluyc",
                "5550027590@chatroom"
            ],
            "messageType":"Text",
            "messagePayload":"welcome to wechaty!"
        }
      } */
      msg = params.messagePayload

    } else if (params.messageType === 'Contact') {
      /* {
            "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
            "method":"thing.command.invoke",
            "version":"1.0",
            "timestamp":1610430718000,
            "name":"send",
            "params":{
                "toContacts":[
                    "tyutluyc",
                    "5550027590@chatroom"
                ],
                "messageType":"Contact",
                "messagePayload":"tyutluyc"
            }
        } */
      const contactCard = await this.bot.Contact.find({ id: params.messagePayload })
      if (!contactCard) {
        log.info('not found')
        return {
          msg: '无此联系人',
        }
      } else {
        msg = contactCard
      }

    } else if (params.messageType === 'Attachment') {
      /* {
          "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
          "method":"thing.command.invoke",
          "version":"1.0",
          "timestamp":1610430718000,
          "name":"send",
          "params":{
              "toContacts":[
                  "tyutluyc",
                  "5550027590@chatroom"
              ],
              "messageType":"Attachment",
              "messagePayload":"/tmp/text.txt"
          }
      } */
      if (params.messagePayload.indexOf('http') !== -1 || params.messagePayload.indexOf('https') !== -1) {
        msg = FileBox.fromUrl(params.messagePayload)
      } else {
        msg = FileBox.fromFile(params.messagePayload)
      }

    } else if (params.messageType === 'Image') {
      /* {
          "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
          "method":"thing.command.invoke",
          "version":"1.0",
          "timestamp":1610430718000,
          "name":"send",
          "params":{
              "toContacts":[
                  "tyutluyc",
                  "5550027590@chatroom"
              ],
              "messageType":"Image",
              "messagePayload":"https://wechaty.github.io/wechaty/images/bot-qr-code.png"
          }
      } */
      // msg = FileBox.fromUrl(params.messagePayload)
      if (params.messagePayload.indexOf('http') !== -1 || params.messagePayload.indexOf('https') !== -1) {
        log.info('图片http地址：' + params.messagePayload)
        msg = FileBox.fromUrl(params.messagePayload)
      } else {
        log.info('图片本地地址：' + params.messagePayload)
        msg = FileBox.fromFile(params.messagePayload)
      }

    } else if (params.messageType === 'Url') {
      /* {
          "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
          "method":"thing.command.invoke",
          "version":"1.0",
          "timestamp":1610430718000,
          "name":"send",
          "params":{
              "toContacts":[
                  "tyutluyc",
                  "5550027590@chatroom"
              ],
              "messageType":"Url",
              "messagePayload":{
                  "description":"WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love",
                  "thumbnailUrl":"https://avatars0.githubusercontent.com/u/25162437?s=200&v=4",
                  "title":"Welcome to Wechaty",
                  "url":"https://github.com/wechaty/wechaty"
              }
          }
      } */
      msg = new PUPPET.payloads.UrlLink(params.messagePayload)

    } else if (params.messageType === 'MiniProgram') {
      /* {
          "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
          "method":"thing.command.invoke",
          "version":"1.0",
          "timestamp":1610430718000,
          "name":"send",
          "params":{
              "toContacts":[
                  "tyutluyc",
                  "5550027590@chatroom"
              ],
              "messageType":"MiniProgram",
              "messagePayload":{
                  "appid":"wx36027ed8c62f675e",
                  "description":"群组大师群管理工具",
                  "title":"群组大师",
                  "pagePath":"pages/start/relatedlist/index.html",
                  "thumbKey":"",
                  "thumbUrl":"http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0",
                  "username":"gh_6c52e2baeb2d@app"
              }
          }
      } */
      msg = new PUPPET.payloads.MiniProgram(params.messagePayload)

    } else {
      return {
        msg: '不支持的消息类型',
      }
    }

    log.info(msg)

    const toContacts = params.toContacts

    for (let i = 0; i < toContacts.length; i++) {
      try {
        if (toContacts[i].split('@').length === 2 || toContacts[i].split(':').length === 2) {
          log.info(`向群${toContacts[i]}发消息`)
          const room = await this.bot.Room.find({ id: toContacts[i] })
          if (room) {
            try {
              await room.say(msg)
            } catch (err) {
              console.error(err)
            }
          }
        } else {
          log.info(`好友${toContacts[i]}发消息`)
          // log.info(bot)
          const contact = await this.bot.Contact.find({ id: toContacts[i] })
          if (contact) {
            try {
              await contact.say(msg)
            } catch (err) {
              console.error(err)
            }
          }
        }
      } catch (e) {
        log.error(e)
      }

    }

  }

  async sendAt (params) {
    const atUserIdList = params.toContacts
    const room = await this.bot.Room.find({ id: params.room })
    const atUserList = []
    for (const userId of atUserIdList) {
      const curContact = await this.bot.Contact.load(userId)
      atUserList.push(curContact)
    }
    await room.say(params.messagePayload, ...atUserList)
  }

  async createRoom (params) {
    const contactList = []
    for (const i in params.contactList) {
      const c = await this.bot.Contact.find({ name: params.contactList[i] })
      contactList.push(c)
    }

    const room = await this.bot.Room.create(contactList, params.topic)
    // log.info('Bot', 'createDingRoom() new ding room created: %s', room)
    // await room.topic(params.topic)
    await room.say('你的专属群创建完成')
  }

  async getQrcod (params) {
    const roomId = params.roomId
    const room = await this.bot.Room.find({ id: roomId })
    const qr = await room.qrcode()
    const msg = eventMessage('qrcode', qr)
    this.pubEvent(msg)
  }

}

export { ChatDevice }
export default ChatDevice
