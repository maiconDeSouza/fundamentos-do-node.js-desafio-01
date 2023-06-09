import http from "node:http"

import { json } from "./middleware/json"


const server = http.createServer(async(req, res) => {
    await json(req, res)

    const { method, url } = req

    console.log(method, url)
    res.end("ok")
})


server.listen(1992, () => console.log(`Server On...`))