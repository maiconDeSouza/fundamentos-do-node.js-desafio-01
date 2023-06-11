import fs from 'node:fs';
import { parse } from 'csv-parse'


import { Database } from "./db/database.js"
import { buildRoutePath } from "./utils/build-router-path.js"
import { dataBuild } from "./utils/dataBuild.js"
import { routeFactory } from "./utils/routeFactory.js"
import { taskFactory } from './utils/ taskFactory.js';

const database = new Database()


export const routes = [ 
    routeFactory("POST", buildRoutePath("/tasks"), createTask),
    routeFactory("GET", buildRoutePath("/tasks"), getTasks),
    routeFactory("PUT", buildRoutePath("/tasks/:id"), updateTasks),
    routeFactory("DELETE", buildRoutePath("/tasks/:id"), deleteTasks),
    routeFactory("PATCH", buildRoutePath("/tasks/:id/:done"), done),
    routeFactory("POST", buildRoutePath("/multipart/form-data"), csv)
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

    const task = taskFactory(title, description)

    try {
        database.insert(task)
        res.writeHead(201).end()
    } catch  {
        res.writeHead(500).end()
    }

}

function getTasks(req, res){
    try {
        const tasks = database.get()
        res.end(JSON.stringify(tasks))
    } catch  {
        res.writeHead(500).end()
    }
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

    try {
        database.update(updateTasks)
        res.writeHead(201).end()
    } catch {
        res.writeHead(500).end()
    }
    
}

function deleteTasks(req, res){
    const { id } = req.params
    const tasks = database.get()

    const index = tasks.findIndex(tasks => tasks.id === id)

    if(index < 0)return res.writeHead(404).end(JSON.stringify({message: "Task Não encontrada!!!"}))

    tasks.splice(index, 1)
    
    try {
        database.update(tasks)
        res.writeHead(200).end()
    } catch{
        res.writeHead(500).end()
    }
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



function csv(req, res){
    try {
        const filePath = new URL('./csv/tasks.csv', import.meta.url)
        const readStream = fs.createReadStream(filePath)

        const parser = parse({
            delimiter: ',', 
            columns: true,
        })

        parser.on('readable', () => {
            let task
            while ((task = parser.read())) {
                const newTask = taskFactory(task.title, task.description)
                database.insert(newTask)
            }
        })

        parser.on('error', (err) => {
            console.log(err)
        })

        readStream.pipe(parser)
        res.writeHead(201).end()
    } catch  {
        res.writeHead(500).end()
    }
}

