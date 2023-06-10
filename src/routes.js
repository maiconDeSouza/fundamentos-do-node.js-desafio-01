import { randomUUID } from "node:crypto"

import { Database } from "./db/database.js"
import { buildRoutePath } from "./utils/build-router-path.js"
import { dataBuild } from "./utils/dataBuild.js"

const database = new Database()


export const routes = [
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: createTask
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: getTasks
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: updateTasks
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: deleteTasks
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/:done"),
        handler: done
    }
]


function createTask(req, res){
    const { title, description } = req.body
    const arrayTask = [title, description]

    arrayTask.forEach(el => {
        if(!el){
            return res.end(JSON.stringify({
                message: "preencha todos os campos!"
            }))
        }
    })

    const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: dataBuild(),
        updated_at: dataBuild()
    }

    try {
        database.insert(task)
        res.writeHead(201).end()
    } catch (error) {
        res.writeHead(500).end()
    }

}

function getTasks(req, res){
    const tasks = database.get()

    res.end(JSON.stringify(tasks))
}

function updateTasks(req, res){
    const { id } = req.params
    const { title, description } = req.body
    const tasks = database.get()
    
    const exist = tasks.some(tasks => tasks.id === id)

    if(!exist)return res.writeHead(404).end(JSON.stringify({message: "Task Não encontrada!!!"}))


    const updateTasks = tasks.map(task => {
        if(task.id === id){
            task.title = title || task.title
            task.description = description || task.description
            task.updated_at = dataBuild()
        }
    })

    database.update(updateTasks)

    res.writeHead(201).end()
    
}

function deleteTasks(req, res){
    const { id } = req.params
    const tasks = database.get()

    const index = tasks.findIndex(tasks => tasks.id === id)

    if(index < 0)return res.writeHead(404).end(JSON.stringify({message: "Task Não encontrada!!!"}))

    tasks.splice(index, 1)
    database.update(tasks)

    res.writeHead(200).end()
}

function done(req, res){
    const { id, done } = req.params
    const tasks = database.get()

    const exist = tasks.some(tasks => tasks.id === id)

    if(!exist)return res.writeHead(404).end(JSON.stringify({message: "Task Não encontrada!!!"}))
    if(done !== "complete")return res.writeHead(400).end(JSON.stringify({message: "Ocorreu um erro!"}))

    const updateTasks = tasks.map(task => {
        if(task.id === id){
            task.completed_at = dataBuild()
        }
    })

    database.update(updateTasks)

    res.writeHead(201).end()

}