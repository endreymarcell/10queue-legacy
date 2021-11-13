import knex, { Knex } from "knex"

const configWithoutDB = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
}
const DB_NAME = "localdb"

function connect(config) {
    console.log("> Attempting to connect to MySQL server:", JSON.stringify(config))
    const db = knex({ client: "mysql", connection: config })
    console.log("OK Successfully connected to MySQL server\n")
    return db
}

function create(db: Knex) {
    console.log(`> Attempting to create new DB called ${DB_NAME}`)
    return db
        .raw(`CREATE DATABASE ${DB_NAME};`)
        .then(() => {
            console.log("OK Successfully created DB\n")
        })
        .catch(err => {
            console.log(`(X) Error while trying to create the DB: ${err}`)
            process.exitCode = 1
        })
}

function drop(db: Knex) {
    console.log(`> Attempting to drop DB called ${DB_NAME}`)
    return db
        .raw(`DROP DATABASE ${DB_NAME};`)
        .then(() => {
            console.log("OK Successfully dropped DB\n")
        })
        .catch(err => {
            console.log(`(X) Error while trying to drop the DB: ${err}`)
            process.exitCode = 1
        })
}

function setup(db: Knex) {
    console.log(`> Attempting to setup DB schema in DB called ${DB_NAME}`)
    return db.schema
        .createTable("simple", table => {
            table.string("appState")
        })
        .then(() => {
            console.log("OK Successfully setup DB schema\n")
        })
        .catch(err => {
            console.log(`(X) Error while trying to setup DB schema: ${err}`)
            process.exitCode = 1
        })
}

async function main(command: string) {
    console.log("\n--------\n")
    if (command === "create") {
        const db = connect(configWithoutDB)
        await create(db)
    } else if (command === "drop") {
        const db = connect(configWithoutDB)
        await drop(db)
    } else if (command === "setup") {
        const config = { ...configWithoutDB, database: DB_NAME }
        const db = connect(config)
        await setup(db)
    } else if (command === "wipe") {
        const db = connect(configWithoutDB)
        await drop(db)
        await create(db)
    } else {
        console.error(`(X) Unknown command: ${command}`)
        process.exitCode = 1
    }

    process.exit(process.exitCode)
}

main(process.argv[2])
