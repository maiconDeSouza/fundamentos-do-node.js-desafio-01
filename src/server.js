import http from "node:http"

import { json } from "./middleware/json.js"
import { routes } from "./routes.js"


const server = http.createServer(async(req, res) => {
    await json(req, res)
    const { method, url } = req

    const route = routes.find( route => {
        return route.method === method && route.path.test(url)
     })
 
     
 
     if(route){
        const routeParams = req.url.match(route.path)
        
        req.params = {...routeParams.groups}
       
        return route.handler(req, res)
     }
     res.writeHead(404).end("404")

})


server.listen(1992, () => console.log(`Server On...`))