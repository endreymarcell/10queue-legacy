import knex from "knex"
import type { SavableState } from "$lib/modules/taskList/logic/state"

const DB_CONFIG = {
    host: process.env["10Q_DB_HOSTNAME"],
    port: process.env["10Q_DB_PORT"],
    user: process.env["10Q_DB_USERNAME"],
    password: process.env["10Q_DB_PASSWORD"],
    database: process.env["10Q_DB_DBNAME"],
}

async function getSavedState(): Promise<SavableState> {
    const db = knex({ client: "mysql", connection: DB_CONFIG })
    const result = await db.select("*").from("simple").limit(1)
    const state = JSON.parse(result[0].state)
    await db.destroy()
    return state
}

export async function get() {
    const savedState = await getSavedState()
    return {
        body: { savedState },
    }
}
