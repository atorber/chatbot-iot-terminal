# chatbot-IoT-terminal

> 聊天机器人物联网设备终端插件

## 简介

将聊天机器人作为一个IoT终端，使用数字孪生语义聊天机器人机器人进行描述，使用MQTT与云平台进行连接和通讯

事件：对应wechaty定义的一系列event

服务：控制聊天机器人

属性：机器人的状态

## 数据交互协议

### 事件同步

thing/chatbot/{botid}/event/post

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.event.post",
    "version":"1.0",
    "timestamp":1610430718000,
    "events":{
        "error":{

        },
        "login":{

        },
        "logout":{

        },
        "heartbeat":{

        },
        "friendship":{

        },
        "message":{

        },
        "ready":{

        },
        "room-join":{

        },
        "room-topic":{

        },
        "room-leave":{

        },
        "room-invite":{

        },
        "scan":{

        }
    }
}
```

### 属性同步

thing/chatbot/{botid}/property/post

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.property.post",
    "version":"1.0",
    "timestamp":1610430718000,
    "properties":{
        "online":true,
        "login":true,
        "lastUpdate":1610430718000,
        "timeHms":'2021-9-10 10:00:00',
        "userSelf":{

        },
        "roomList":[

        ],
        "contactList":[

        ]
    }
}
```

### 远程控制

thing/chatbot/{botid}/command/invoke

#### 机器人操作

- 启动机器人

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"start",
    "params":{

    }
}
```

- 停止机器人

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"stop",
    "params":{

    }
}
```

- 退出登录

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"logout",
    "params":{

    }
}
```

- 获取登陆状态

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"logonoff",
    "params":{

    }
}
```

- 获取机器人信息

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"userSelf",
    "params":{

    }
}
```

- 向机器人发信息

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"say",
    "params":{
        "messageType":"Text",
        "messagePayload":"welcome to wechaty!"  
    }
}
```

#### 发送消息

- 发送文本

```
{
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
}
```

- 发送联系人名片

```
{
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
        "messagePayload":"contactId"
    }
}
```

- 发送文件

```
{
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
}
```

- 发送图片

```
{
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
}
```

- 发送网址消息

```
{
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
}
```

- 发送小程序

```
{
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
            "description":"群管理秘书",
            "title":"高效群管理工具",
            "pagePath":"pages/start/relatedlist/index.html",
            "thumbKey":"",
            "thumbUrl":"http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0",
            "username":"gh_6c52e2baeb2d@app"
        }
    }
}
```

- 发送at消息

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"sendAt",
    "params":{
        "room":"5550027590@chatroom",
        "toContacts":[
            "tyutluyc"
        ],
        "messagePayload":"welcome to wechaty!"
    }
}
```

- 获取备注名称

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"aliasGet",
    "params":{
        "contact":"tyutluyc"
    }
}
```

- 修改备注名称

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"aliasSet",
    "params":{
        "contact":"tyutluyc",
        "name":"超哥"
    }
}
```

#### 群管理

- 创建群聊

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomCreate",
    "params":{
        "contactList":[
            "tyutluyc",
            "ledongmao"
        ],
        "topic":"onlyu"
    }
}
```

- 添加好友到群

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomAdd",
    "params":{
        "room":"5550027590@chatroom",
        "contact":"tyutluyc"
    }
}
```

- 删除群成员

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomDel",
    "params":{
        "room":"5550027590@chatroom",
        "contact":"tyutluyc"
    }
}
```

- 获取群公告

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomAnnounceGet",
    "params":{
        "room":"5550027590@chatroom"
    }
}
```

- 设置群公告

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomAnnounceSet",
    "params":{
        "room":"5550027590@chatroom",
        "message":"一周cp-xxx"
    }
}
```

- 退出群聊

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomQuit",
    "params":{
        "room":"5550027590@chatroom"
    }
}
```

- 获取群名称

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomTopicGet",
    "params":{
        "room":"5550027590@chatroom"
    }
}
```

- 设置群名称

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomTopicSet",
    "params":{
        "room":"5550027590@chatroom",
        "messagePayload":"一周cp-xxx"
    }
}
```

- 获取群二维码

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"roomQrcodeGet",
    "params":{
        "room":"5550027590@chatroom"
    }
}
```

- 获取群成员列表

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"memberAllGet",
    "params":{
        "room":"5550027590@chatroom"
    }
}
```

#### 好友管理

- 添加好友

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"contactAdd",
    "params":{
        "contact":"tyutluyc",
        "hello":"nice to meet you"
    }
}
```

- 修改备注

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"contactAliasSet",
    "params":{
        "contact":"tyutluyc",
        "messagePayload":"超哥"
    }
}
```

- 获取好友列表

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"contactFindAll",
    "params":{

    }
}
```

- 获取好友详情

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"contactFind",
    "params":{
        "byType":"name",
        "message":"超哥"
    }
}
```

#### 下发配置

- 更新转发规则

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"forward",
    "params":{
        "from":"ledongmao",
        "toList":[
            "tyutluyc",
            "5550027590@chatroom"
        ]
    }
}
```

- 服务配置

```
{
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"config",
    "params":{
        "key1":{},
        "key2":[
            "tyutluyc",
            "5550027590@chatroom"
        ]
    }
}
```
