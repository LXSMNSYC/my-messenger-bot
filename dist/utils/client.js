"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var libfb_1 = require("libfb");
var commander_1 = __importDefault(require("commander"));
var string_argv_1 = __importDefault(require("string-argv"));
commander_1.default.exitOverride(function (err) {
    throw err;
});
var MessengerClient = (function () {
    function MessengerClient(email, password, threads, options) {
        console.log(email, password);
        this.client = new libfb_1.Client(options);
        this.email = email;
        this.password = password;
        this.threads = threads;
    }
    MessengerClient.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, this.client.login(this.email, this.password).then(function () {
                        console.log('Up and running..');
                        _this.client.on('message', function (message) {
                            console.log('Received:', message);
                            if (_this.threads.includes(message.threadId)) {
                                _this.currentMessage = message;
                                _this.parse(message.message);
                                _this.currentMessage = null;
                            }
                        });
                    })];
            });
        });
    };
    MessengerClient.prototype.getUserInfo = function (userId) {
        return this.client.getUserInfo(userId);
    };
    MessengerClient.prototype.parse = function (message) {
        var _this = this;
        try {
            commander_1.default.parse(string_argv_1.default(message, 'node', 'test'));
        }
        catch (err) {
            console.error(err);
            if (this.currentMessage) {
                var author_1 = this.currentMessage.authorId;
                var thread_1 = this.currentMessage.threadId;
                this.getUserInfo(author_1).then(function (user) {
                    var length = user.name.length + 1;
                    var mentions = [
                        { offset: 3, id: author_1, length: length },
                    ];
                    var msg = "Hi @" + user.name + ",\n\nThere seems to be a problem processing your command '" + message + "'.\n\nPlease try again ;)";
                    _this.sendMessage(thread_1, msg, {
                        mentions: mentions,
                    });
                });
            }
        }
    };
    MessengerClient.prototype.addCommand = function (pattern) {
        return commander_1.default.command(pattern);
    };
    Object.defineProperty(MessengerClient.prototype, "current", {
        get: function () {
            return this.currentMessage;
        },
        enumerable: true,
        configurable: true
    });
    MessengerClient.prototype.sendMessage = function (threadId, message, options) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.sendTypingState(threadId, true)];
                    case 1:
                        _a.sent();
                        parsed = message + "\n          \n(I am a bot \uD83E\uDD16, beep boop)";
                        return [4, this.client.sendMessage(threadId, parsed, options)];
                    case 2:
                        _a.sent();
                        return [4, this.client.sendTypingState(threadId, false)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return MessengerClient;
}());
exports.default = MessengerClient;
