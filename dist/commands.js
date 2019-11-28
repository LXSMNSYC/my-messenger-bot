"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
exports.default = (function (client) {
    client.addCommand('/greet <greet>')
        .description('greet with the given message')
        .action(function (greeting) {
        console.log(client.current);
        if (client.current) {
            client.sendMessage(client.current.threadId, "Alexis greets: " + greeting);
        }
    });
    client.addCommand('/numbers [number]')
        .option('-r, --random', 'uses a random number as a basis')
        .option('-t, --trivia', 'uses a trivia')
        .action(function (number, cmdObj) {
        var request = 'http://numbersapi.com';
        if (cmdObj.random) {
            request = request + "/random";
        }
        else {
            request = request + "/" + number;
        }
        if (cmdObj.trivia) {
            request = request + "/trivia";
        }
        if (client.current) {
            var thread_1 = client.current.threadId;
            axios_1.default.get(request).then(function (_a) {
                var data = _a.data;
                client.sendMessage(thread_1, data);
            });
        }
    });
    client.addCommand('/roll [min] [max]')
        .action(function (min, max) {
        if (min === void 0) { min = 100; }
        if (client.current) {
            var thread = client.current.threadId;
            if (max) {
                client.sendMessage(thread, "You rolled " + ((Math.random() * (max - min)) | 0));
            }
            else {
                client.sendMessage(thread, "You rolled " + ((Math.random() * min) | 0));
            }
        }
    });
    client.addCommand('/toss')
        .action(function () {
        if (client.current) {
            var flip = Math.random() < 0.5 ? 'Tails' : 'Heads';
            client.sendMessage(client.current.threadId, "You flipped " + flip + ".");
        }
    });
});
