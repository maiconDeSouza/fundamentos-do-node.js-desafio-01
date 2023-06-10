import fs from "node:fs/promises"

const dataBasePath = new URL('db.json', import.meta.url)
let dbm = {}
async function db(){
     dbm = await readDB()
}
db()

export function database(){
    return{
        createTasks
    }
}


async function createTasks(id, title, description){
    const task = {
        id,
        title,
        description
    }

    db.push(task)

    await fs.writeFile(dataBasePath, JSON.stringify(db, null, 2))
}


async function readDB(){
    const db = JSON.parse(await fs.readFile(dataBasePath, 'utf8'))

    if(!db){
        fs.writeFile(dataBasePath, JSON.stringify([], null, 2))
    }

}