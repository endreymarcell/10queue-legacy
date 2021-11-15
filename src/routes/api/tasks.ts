import knex from "knex"
import type { Knex } from "knex"
import type { SavableState } from "$lib/modules/taskList/logic/state"
import { logger } from "$lib/helpers/logger"
import type { RequestHandler } from "@sveltejs/kit"

const DB_CONFIG = {
    // The production build only has access to the env vars
    // if they are read by Vite during the build process.
    // https://vitejs.dev/guide/env-and-mode.html
    host: import.meta.env.VITE_10Q_DB_HOSTNAME,
    port: import.meta.env.VITE_10Q_DB_PORT,
    user: import.meta.env.VITE_10Q_DB_USERNAME,
    password: import.meta.env.VITE_10Q_DB_PASSWORD,
    database: import.meta.env.VITE_10Q_DB_DBNAME,
} as Knex.StaticConnectionConfig

function getDB(): Knex {
    return knex({
        client: "mysql",
        connection: DB_CONFIG,
        log: { ...logger },
    })
}

async function getSavedState(): Promise<SavableState> {
    logger.debug("Reading saved state from simple DB")
    const db = getDB()
    const result = await db.select("*").from("simple").limit(1)
    const state = JSON.parse(result[0].state)
    logger.silly("Saved state as read from the DB:", state)
    await db.destroy()
    return state
}

export const get: RequestHandler = async () => {
    const savedState = await getSavedState()
    return {
        body: { savedState },
    }
}

export const post: RequestHandler = async payload => {
    logger.debug("Saving state to simple DB")
    const db = getDB()
    const value = payload.body as string
    await db("simple").update("state", value)
    await db.destroy()
    return {
        status: 200,
    }
}
