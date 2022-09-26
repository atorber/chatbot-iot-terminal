#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'

import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
} from 'wechaty'

import { v4 } from 'uuid'

import qrcodeTerminal from 'qrcode-terminal'
import WechatyMqttPlugin from '../src/index.js'

// 配置信息，修改配置信息为指定设备，运行 npm run start
const initConfig = {
  mqttConfig: {
    username: process.env['MQTT_USERNAME'] || '', //设备MQTT用户名
    password: process.env['MQTT_PASSWORD'] || '', //设备MQTT密码
    clintId: process.env['BOT_ID'] || v4(), //设备MQTT客户端ID
    endPoint: process.env['MQTT_ENDPOINT'] ||'bddmp.iot.gz.baidubce.com', //设备MQTT接入地址
    port: process.env['MQTT_PORT'] ||1883, //设备MQTT接入端口号
    event: process.env['MQTT_EVENT_TOPIC'] || '', //事件上报topic
    command: process.env['MQTT_COMMAND_TOPIC'] || '', //服务调用topic
    property: process.env['MQTT_PROPERTY_TOPIC'] || '', //属性上报topic
    eventLoggerConfig: [
      'login',
      'logout',
      'reset',
      'ready',
      'dirty',
      'dong',
      'error',
      'heartbeat',
      'friendship',
      'message',
      'post',
      'room-invite',
      'room-join',
      'room-leave',
      'room-topic',
      'scan'
    ], //上报事件列表
  },
  // wechatyConfig: {
  //   name: 'easy-bot',
  //   puppet: String(process.env['WECHATY_PUPPET'] || ''),
  //   puppetOptions: {
  //     token: process.env['WECHATY_TOKEN'] || '',
  //   },
  // }
  wechatyConfig: {
    name: 'easy-bot',
    puppet: 'wechaty-puppet-wechat',
    puppetOptions: {
      uos: true
    }
  }
}

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage(msg: Message) {
  log.info('StarterBot', msg.toString())

  if (msg.text() === 'ding') {
    await msg.say('dong')
  }
}

const bot = WechatyBuilder.build(initConfig.wechatyConfig)

bot.use(
  WechatyMqttPlugin(initConfig.mqttConfig),
)
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch((e: any) => log.error('StarterBot', e))
