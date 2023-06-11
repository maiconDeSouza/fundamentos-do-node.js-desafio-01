import { randomUUID } from "node:crypto"
import { dataBuild } from "./dataBuild.js"

export function taskFactory(title, description){
    return {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: dataBuild(),
        updated_at: dataBuild()
    }
}


