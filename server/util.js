/**
 * Created by a2014 on 14-7-16.
 */

var isFunction = function (a) {
    return a && Object.prototype.toString.call(a) == '[object Array]';
}

var isObject = function (a) {
    return a && Object.prototype.toString.call(a) == '[object Object]';
}

var buildSendMsg = function (str_msg, mask) {
    str_msg = str_msg || "";
    mask = mask || false;

    var msg_len = Buffer.byteLength(str_msg, "utf-8"), packed_data;
    if (msg_len <= 0) {
        return null;
    }
    if (msg_len < 126) {//默认全是数据
        packed_data = new Buffer(2 + msg_len);
        packed_data[0] = 0x81; // 1000(fin RSV1 RSV2 RSV3)   0001(opcode 1 text)
        packed_data[1] = msg_len;  //
        packed_data.write(str_msg, 2);
    } else if (msg_len <= 0xFFFF) {//用16位表示数据长度 1111 1111 1111 1111
        packed_data = new Buffer(4 + msg_len); // 4= 2 位头 2位长度
        packed_data[0] = 0x81;    //1000 0001 代表text
        packed_data[1] = 126;
        packed_data.writeUInt16BE(msg_len, 2); //从第二位开始写
        packed_data.write(str_msg, 4); //2位头 2位 length
    }
    return packed_data;
}
var parseMsg = function (data) {
    var payloadLen = data[1] & 0x7f; // 0111 1111 取第二个字节的后7位

    var mask;
    var payLoadData;
    //payloadlen 7bytes 7+16bits(126)2bytes 7+64bits(127)

    if (payloadLen < 126) {
        mask = data.slice(2, 6);
        payLoadData = data.slice(6);
    } else if (payloadLen == 126) {
        //126 的时候 payloadlength 延长至 7+16bits。所以masking
        mask = data.slice(4, 8); //(4=2+2 )
        payLoadData = data.slice(8);
        payloadLen = data.readUInt16BE(2);
    } else if (payloadLen == 127) {
        mask = data.slice(10, 12);// (10=2+8)
        payLoadData = data.slice(12);
        payloadLen = data.readUinit64BE(2);
    }


    //解除屏蔽
    //真正数据 第一个字符和第一个掩码异或。。以此类推

    for (var i = 0; i < payloadLen; i++) {
        payLoadData[i] = payLoadData[i] ^ mask[i % 4];
    }
    return payLoadData;
}


exports.util = {
    isFunc: isFunction,
    isObj: isObject,
    build: buildSendMsg,
    parse: parseMsg
}