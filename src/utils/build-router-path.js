export function buildRoutePath(path){
    const routeParmetersRegex = /:([a-zA-z]+)/g
    const pathWithParams = path.replaceAll(routeParmetersRegex, "(?<$1>[a-z0-9\-_]+)")

    const pathRegex = new RegExp(`^${pathWithParams}`)
    
    return pathRegex
}