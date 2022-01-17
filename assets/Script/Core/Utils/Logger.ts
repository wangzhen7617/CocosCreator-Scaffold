import { DEBUG } from "cc/env";


export namespace Logger {


    /** 开始计时 */
    export function start() {
        console.time("Time");
    }

    /** 打印范围内时间消耗 */
    export function end() {
        console.timeEnd("Time");
    }

    /** 打印表格 */
    export function table(msg: any, describe?: string) {
        console.table(msg);
    }

    export function log(...data: any[]) {
        // 标记没有打开，不打印该日志
        // if (!DEBUG) {
        //     return;
        // }
        var backLog = console.log;
        backLog.call(null, "%c%s%s:%o", '', getDateString(), stack(3), data);
    }

    export function warn(...data: any[]) {
        // 标记没有打开，不打印该日志
        // if (!DEBUG) {
        //     return;
        // }

        var backLog = console.warn ;
        backLog.call(null, "%c%s%s:%o", '', getDateString(), stack(3), data);
    }

    export function error(...data: any[]) {
        // 标记没有打开，不打印该日志
        // if (!DEBUG) {
        //     return;
        // }

        var backLog = console.error ;
        backLog.call(null, "%c%s%s:%o", '', getDateString(), stack(3), data);
    }
    function stack(index: number): string {
        var e = new Error();
        var lines = e.stack!.split("\n");
        var result: Array<any> = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            }
            else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });

        var list: string[] = [];
        var splitList: Array<string> = [];
        if (index < result.length - 1) {
            var value: string;
            for (var a in result[index]) {
                var splitList = a.split(".");

                if (splitList.length == 2) {
                    list = splitList.concat();
                }
                else {
                    value = result[index][a];
                    var start = value!.lastIndexOf("/");
                    var end = value!.lastIndexOf(".");
                    if (start > -1 && end > -1) {
                        var r = value!.substring(start + 1, end);
                        list.push(r);
                    }
                    else {
                        list.push(value);
                    }
                }
            }
        }

        if (list.length == 1) {
            return "[" + list[0] + ".ts]";
        }
        else if (list.length == 2) {
            return "[" + list[0] + ".ts->" + list[1] + "]";
        }
        return "";
    }

    function getDateString(): string {
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = "[" + timeStr + "]";
        return timeStr;
    }
}


