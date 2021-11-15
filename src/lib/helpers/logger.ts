import { browser as isRunningInBrowser } from "$app/env"

/* eslint-disable no-console */
enum LogLevel {
    SILENT = 5,
    ERROR = 4,
    WARNING = 3,
    INFO = 2,
    DEBUG = 1,
    SILLY = 0,
}

let logLevelThreshold: LogLevel = LogLevel.SILENT

export function setLevel(level: LogLevel) {
    logLevelThreshold = level
}

function log(level: LogLevel, messageParts: Array<unknown>) {
    if (level >= logLevelThreshold) {
        consoleLog(level, messageParts)
    }
}

function consoleLog(level: LogLevel, messageParts: Array<unknown>) {
    if (level === LogLevel.ERROR) {
        console.error(...messageParts)
    } else if (level === LogLevel.WARNING) {
        console.warn(...messageParts)
    } else if (level === LogLevel.INFO) {
        console.log(...messageParts)
    } else {
        console.log(...messageParts)
    }
}

function detectLevel() {
    let requestedLevel
    if (isRunningInBrowser) {
        const urlParams = new URLSearchParams(window.location.search)
        requestedLevel = urlParams.get("loglevel")
    } else {
        requestedLevel = import.meta.env.VITE_10Q_LOG_LEVEL
    }
    switch (requestedLevel) {
        case "silent":
            return LogLevel.SILENT
        case "error":
            return LogLevel.ERROR
        case "warning":
            return LogLevel.WARNING
        case "info":
            return LogLevel.INFO
        case "debug":
            return LogLevel.DEBUG
        case "silly":
            return LogLevel.SILLY
        default:
            return LogLevel.INFO
    }
}

export const logger = {
    setLevel: (level: LogLevel) => (logLevelThreshold = level),
    autoSetLevel: () => (logLevelThreshold = detectLevel()),
    error: (...messageParts: Array<unknown>) => log(LogLevel.ERROR, messageParts),
    warn: (...messageParts: Array<unknown>) => log(LogLevel.WARNING, messageParts),
    info: (...messageParts: Array<unknown>) => log(LogLevel.INFO, messageParts),
    debug: (...messageParts: Array<unknown>) => log(LogLevel.DEBUG, messageParts),
    silly: (...messageParts: Array<unknown>) => log(LogLevel.SILLY, messageParts),
}
