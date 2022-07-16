import console from 'console'

import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'

const msgList = []

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function onMessage (msg, chatdev) {
  // console.debug(message)
  try {
    log.info('onMessage', msg.toString())
    // console.debug(msg)
    await chatdev.pubMessage(msg)
  } catch (err) {
    console.debug(err)
  }
}

export { onMessage }

export default onMessage
