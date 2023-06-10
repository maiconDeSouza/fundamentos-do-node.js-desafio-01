import { randomUUID } from "node:crypto"

import { database } from "./db/database.js"
import { buildRoutePath } from "./utils/build-router-path.js"

const funcsDataBase = database()
console.log(funcsDataBase)

export const routes = [
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: createTask
    }
]


function createTask(req, res){
    const { title, description } = req.body
    const arrayTask = [title, description]

    arrayTask.forEach(el => {
        if(!el){
            return res.writeHead(404).end(JSON.stringify({
                message: "preencha todos os campos!"
            }))
        }
    })

}