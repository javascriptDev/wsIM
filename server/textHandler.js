/**
 * Created by mtime on 15/6/18.
 */

var util = require('./util').util;
var msgType = require('./msgtype').mt;


var handler = function (data, socket) {

    var text = JSON.parse(util.parse(data).toString());
    var messageType = text.type;
    var sid = text.sid;
    var txt = text.text;
    var did = text.did || '';
    switch (messageType) {
        case msgType.login:
            em.emit(msgType.login, sid, socket);
            break;
        case msgType.msg:
            em.emit(msgType.msg, sid, txt, did);
            break;
        case msgType.initFriend:
            em.emit(msgType.initFriend, data, socket);
            break;
        case msgType.close:
            em.emit(msgType.close,sid);
            break;
        default :;
            break;
    }


}


exports.handle = handler;
