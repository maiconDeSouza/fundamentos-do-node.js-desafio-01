import fs from "node:fs/promises"

const dataBasePath = new URL('db.json', import.meta.url)

export class Database{
    #database = []

    constructor(){
        fs.readFile(dataBasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#parsist()
        })
    }

    #parsist(){
        fs.writeFile(dataBasePath, JSON.stringify(this.#database, null, 2))
    }

    insert(task){
        this.#database.push(task)
        this.#parsist()
    }

    get(){
        return this.#database
    }

    update(tasks){
        fs.writeFile(dataBasePath, JSON.stringify(tasks, null, 2))
    }
}