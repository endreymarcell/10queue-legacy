import knex from "knex"
import type { Knex } from "knex"
import type { SavableState } from "$lib/modules/taskList/logic/state"
import { logger } from "$lib/helpers/logger"
import type { RequestHandler } from "@sveltejs/kit"

const DB_CONFIG = {
    host: process.env["10Q_DB_HOSTNAME"],
    port: process.env["10Q_DB_PORT"],
    user: process.env["10Q_DB_USERNAME"],
    password: process.env["10Q_DB_PASSWORD"],
    database: process.env["10Q_DB_DBNAME"],
}

function getDB(): Knex {
    return knex({
        client: "mysql",
        connection: DB_CONFIG,
        log: { ...logger },
    })
}

async function getSavedState(): Promise<SavableState> {
    logger.debug("Reading saved state from simple DB")
    console.log("connecting to DB")
    const db = getDB()
    console.log("running query")
    const result = await db.select("*").from("simple").limit(1)
    const state = JSON.parse(result[0].state)
    logger.silly("Saved state as read from the DB:", state)
    console.log("closing connection")
    await db.destroy()
    return state
}

export const get: RequestHandler = async () => {
    console.log("tasks::get called")
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
