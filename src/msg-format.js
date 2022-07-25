/* eslint-disable sort-keys */
import { v4 } from 'uuid'
import moment from 'moment'

import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'

function getCurTime () {
  // timestamp是整数，否则要parseInt转换
  const timestamp = new Date().getTime()
  const timezone = 8 // 目标时区时间，东八区
  const offsetGMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
  const time = timestamp + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000
  // const time = timestamp + offsetGMT * 60 * 1000

  return time
}

async function wechaty2chatdev (message) {
  const curTime = getCurTime()
  const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')

  let msg = {
    reqId: v4(),
    method: 'thing.event.post',
    version: '1.0',
    timestamp: curTime,
    events: {
    },
  }

  const talker = message.talker()

  let text = ''
  let messageType = ''
  let textBox = {}
  let file = ''
  const msgId = message.id

  switch (message.type()) {
    // 文本消息
    case PUPPET.types.Message.Text:
      messageType = 'Text'
      text = message.text()
      break

      // 图片消息
    case PUPPET.types.Message.Image:
      messageType = 'Image'
      file = await message.toImage().artwork()
      break

      // 链接卡片消息
    case PUPPET.types.Message.Url:
      messageType = 'Url'
      textBox = await message.toUrlLink()
      text = JSON.stringify(JSON.parse(JSON.stringify(textBox)).payload)
      break

      // 小程序卡片消息
    case PUPPET.types.Message.MiniProgram:
      messageType = 'MiniProgram'
      textBox = await message.toMiniProgram()
      text = JSON.stringify(JSON.parse(JSON.stringify(textBox)).payload)
      /*
            miniProgram: 小程序卡片数据
            {
              appid: "wx363a...",
              description: "贝壳找房 - 真房源",
              title: "美国白宫，10室8厅9卫，99999刀/月",
              iconUrl: "http://mmbiz.qpic.cn/mmbiz_png/.../640?wx_fmt=png&wxfrom=200",
              pagePath: "pages/home/home.html...",
              shareId: "0_wx363afd5a1384b770_..._1615104758_0",
              thumbKey: "84db921169862291...",
              thumbUrl: "3051020100044a304802010002046296f57502033d14...",
              username: "gh_8a51...@app"
            }
           */
      break

      // 语音消息
    case PUPPET.types.Message.Audio:
      messageType = 'Audio'
      file = await message.toFileBox()
      break

      // 视频消息
    case PUPPET.types.Message.Video:
      messageType = 'Video'
      file = await message.toFileBox()
      break

      // 动图表情消息
    case PUPPET.types.Message.Emoticon:
      messageType = 'Emoticon'
      file = await message.toFileBox()
      break

      // 文件消息
    case PUPPET.types.Message.Attachment:
      messageType = 'Attachment'
      file = await message.toFileBox()
      break

    case PUPPET.types.Message.Contact:
      messageType = 'Contact'
      try {
        textBox = await message.toContact()
      } catch (err) {

      }
      text = '联系人卡片消息'
      break

      // 其他消息
    default:
      messageType = 'Unknown'
      text = '未知的消息类型'
      break
  }

  // log.info('textBox:', textBox)

  const room = message.room()
  const roomInfo = {}
  if (room && room.id) {
    roomInfo.id = room.id
    const topic = await room.topic()
    try {
      const roomAvatar = await room.avatar()
      const name = roomAvatar.name
      await roomAvatar.toFile(`./${name}`, true)
      log.info(`Room: ${topic} with avatar file: ${name}`)

      log.info('群头像room.avatar()============')
      log.info(typeof roomAvatar)
      log.info(JSON.stringify(roomAvatar))
      log.info('END============')

      roomInfo.avatar = JSON.parse(JSON.stringify(roomAvatar)).url
    } catch (err) {
      log.info('群头像捕获了错误============')
      log.info(typeof err)
      log.info(err)
      log.info('END============')
    }
    roomInfo.ownerId = room.owner().id

    try {
      roomInfo.topic = await room.topic()
    } catch (err) {
      roomInfo.topic = room.id
    }
  }

  let memberAlias = ''
  try {
    memberAlias = await room.alias(talker)
  } catch (err) {

  }

  let avatar = ''
  let talkerAvatar = {}
  try {

    try {
      talkerAvatar = await talker.avatar()
      const name = talkerAvatar.name
      await talkerAvatar.toFile(`./folder/${name}`, true)
      log.info(`Contact: ${talker.name()} with avatar file: ${name}`)
    } catch (e) {
      talkerAvatar.url = talker.payload.avatar
    }

    log.info('好友头像talker.avatar()============')
    log.info(JSON.stringify(talkerAvatar))
    avatar = JSON.parse(JSON.stringify(talkerAvatar)).url

  } catch (err) {
    log.info('好友头像捕获了错误============')
    log.info(err)
  }

  const content = {}
  if (file) {
    text = msgId + '.' + file.name.split('.').pop()
  }
  content.messageType = messageType
  content.text = text
  content.raw = textBox.payload || textBox._payload || { name:file.name }

  const _payload = {
    id: msgId,
    talker: {
      id: talker.id,
      gender: talker.gender() || '',
      name: talker.name() || '',
      alias: await talker.alias() || '',
      memberAlias: memberAlias,
      avatar: avatar,
    },
    room: roomInfo,
    content: content,
    text,
    timestamp: curTime,
    timeHms: timeHms,
  }

  msg.events.message = _payload
  msg = JSON.stringify(msg)

  return msg

}

function propertyMessage (name, info) {
  let message = {
    reqId: v4(),
    method: 'thing.property.post',
    version: '1.0',
    timestamp: new Date().getTime(),
    properties: {
    },
  }
  message.properties[name] = info
  message = JSON.stringify(message)
  return message
}

function eventMessage (name, info) {
  let message = {
    reqId: v4(),
    method: 'thing.event.post',
    version: '1.0',
    timestamp: new Date().getTime(),
    events: {
    },
  }
  message.events[name] = info
  message = JSON.stringify(message)
  return message
}

export { wechaty2chatdev, propertyMessage, eventMessage }
export default wechaty2chatdev
