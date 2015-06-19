/**
 * Created by mtime on 15/6/18.
 */

var cache = require('./cache').cache;
var msgType = require('./msgtype').mt;



var initFriend = function (data,sockets) {
    sockets.forEach(function (sock) {
        if(!sock) return;
        em.emit('send',sock,{data:data,type:msgType.initFriend});
    })
}

var login = function (id, socket) {
    cache.addUser(id, socket);
    em.emit(msgType.loginSuccess,socket,{success:1,uid:id});
    em.emit(msgType.initFriend,cache.getUsersExcept(id),cache.getSocketsExcept(id));
}


var msg = function (from, txt, to) {
    cache.getSocket(to).forEach(function(sock){
        em.emit('send',sock,{from:from,msg:txt,type:msgType.msg});
    })
}

var logout = function (id) {
    var sock = cache.getSocket(id);
    sock[0] && sock[0].end();
    cache.deleteSocket(id);
}

var loginSucccess = function (socket,msg) {
    msg.type = msgType.loginSuccess;
    em.emit('send',socket,msg);
}

exports.handler = {
    initFriend: initFriend,
    login: login,
    msg: msg,
    logout: logout,
    loginSucccess:loginSucccess
}