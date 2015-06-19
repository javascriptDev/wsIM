/**
 * Created by a2014 on 14-7-15.
 */
var http = require('http');
var util = require('./util').util;

var crypto = require('crypto'),
    md5 = crypto.createHash('md5'),
    EventM = new  require('events').EventEmitter;
em = new EventM();
var cache = require('./cache');

var textHandler = require('./textHandler').handle;
var msgType = require('./msgtype').mt;
var msgHandler = require('./msgHandler').handler;


Math.uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// Create an HTTP server
var so = [];
var ids = [];

em.on('text',textHandler);
em.on(msgType.initFriend,msgHandler.initFriend);
em.on(msgType.login,msgHandler.login);
em.on(msgType.msg,msgHandler.msg);
em.on(msgType.loginSuccess,msgHandler.loginSucccess);
em.on(msgType.logOut,msgHandler.logout)

em.on('send',function(so,msg){
    console.log(msg);
    so.write(util.build(typeof msg == 'object' ? JSON.stringify(msg) : msg ));
})


var websocket = http.createServer(function (req, res) {});

websocket.on('upgrade', function (req, socket, head) {

    var key = req.headers['sec-websocket-key'].replace(/(^\s+)|(\s+$)/g, '');
    var shasum = crypto.createHash('sha1');
    shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
    key = shasum.digest('base64');

    var headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
            'Sec-WebSocket-Accept:' + key
    ];
    var s = headers.concat('', '').join('\r\n');
    socket.write(s);


    socket.on('end', function () {
        console.log('disconnect');
    });
    var targetSocket = [];


    socket.on('data', function (data) {
        targetSocket.length = 0;
//            0                   1                   2                   3
//            0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
//            +-+-+-+-+-------+-+-------------+-------------------------------+
//            |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
//            |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
//            |N|V|V|V|       |S|             |   (if payload len==126/127)   |
//            | |1|2|3|       |K|             |                               |
//            +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
//            |     Extended payload length continued, if payload len == 127  |
//            + - - - - - - - - - - - - - - - +-------------------------------+
//            |                               |Masking-key, if MASK set to 1  |
//            +-------------------------------+-------------------------------+
//            | Masking-key (continued)       |          Payload Data         |
//            +-------------------------------- - - - - - - - - - - - - - - - +
//            :                     Payload Data continued ...                :
//            + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
//            |                     Payload Data continued ...                |
//            +---------------------------------------------------------------+

        var opCode = data[0] & 0xf; //取后四位 1111 按位与
        if (opCode == 1) {//文字
            em.emit('text',data,socket);
        }
    });

    socket.on('error', function (error) {
        console.log('******* ERROR ' + error + ' *******');

        // close connection
        socket.end();
    });

});
websocket.listen(1338, function () {
    console.log('web socket server begin');
})