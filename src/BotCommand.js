import { Buffer } from 'buffer';

const CMD_MOVE_FORWARD = 0x00
const CMD_MOVE_BACKWARD = 0x30
const CMD_ROTATE_LEFT = 0x10
const CMD_ROTATE_RIGH = 0x20
const CMD_STOP = 0x50
const CMD_REVERT = 0x60
const CMD_SKILL = 0x70
const CMD_WHEEL = 0x80
const CMD_WHEEL_LEFT = 0x00
const CMD_WHEEL_RIGHT = 0x10
const CMD_WHEEL_FWD = 0x20
const CMD_WHEEL_BWD = 0x00
const CMD_AUTO_ROTATE_ON_DISCONNECT = 0x40

export default class BotCommnad {

    constructor() {

    }
    static encode(data) {
        let buf = new Buffer(1);
        buf.writeUInt8(data);
        console.log(buf, data)
        return buf.toString('base64')
    }
    static move_forward(speed) {
        return BotCommnad.encode(CMD_MOVE_FORWARD + speed);
    }
    static move_backward(speed) {
        return BotCommnad.encode(CMD_MOVE_BACKWARD + speed);
    }
    static turn_left(speed) {
        return BotCommnad.encode(CMD_ROTATE_LEFT + speed);
    }
    static turn_right(speed) {
        return BotCommnad.encode(CMD_ROTATE_RIGH + speed);
    }
    static turn_off() {
        return BotCommnad.encode(CMD_STOP);
    }
    static skill(type) {
        return BotCommnad.encode(CMD_SKILL + type);
    }
    static revert(on) {
        return BotCommnad.encode(CMD_REVERT + on);
    }
    static auto_on_disconnect(on) {
        return BotCommnad.encode(CMD_AUTO_ROTATE_ON_DISCONNECT + on);
    }
    static left(fw, speed) {
        let cmd_fw = CMD_WHEEL_BWD
        if (fw)
            cmd_fw = CMD_WHEEL_FWD
        return BotCommnad.encode(CMD_WHEEL + CMD_WHEEL_LEFT + cmd_fw + speed);
    }
    static right(fw, speed) {
        let cmd_fw = CMD_WHEEL_BWD
        if (fw)
            cmd_fw = CMD_WHEEL_FWD
        return BotCommnad.encode(CMD_WHEEL + CMD_WHEEL_RIGHT + cmd_fw + speed);
    }
    static skill_from_str(str) {
        if (str == 'Q') {
            return BotCommnad.skill(0)
        } else if (str == 'W') {
            return BotCommnad.skill(1)
        } else if (str == 'E') {
            return BotCommnad.skill(2)
        } else if (str == 'R') {
            return BotCommnad.skill(3)
        } else if (str == 'ON') {
            return BotCommnad.revert(1)
        } else if (str == 'OFF') {
            return BotCommnad.revert(0)
        } else if (str == 'RELOAD') {
            return BotCommnad.auto_on_disconnect(0)
        }
    }
}