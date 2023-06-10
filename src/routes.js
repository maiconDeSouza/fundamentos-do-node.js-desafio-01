import { randomUUID } from "node:crypto"

// import { Database } from "./db/database.js"
import { buildRoutePath } from "./utils/build-router-path.js"

// const database = new Database()


export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks/:id/:done"),
        handler: (req, res) => {
            const { id, done } = req.params
            console.log(id, done)
            res.end(JSON.stringify({msg: randomUUID()}))
        }
    }
]
