export function routeFactory(method, path, handler){
   
    return {
        method,
        path,
        handler
    }
}


