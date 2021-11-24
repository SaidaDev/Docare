import fs from 'fs'
import qs from "querystring"
import { isSessionValid, closeSession, getDocId, openSession } from './sessions'
import { getDocById, addDoctor, findDoc } from './doctors'
import { getSessionId, setSessionId } from './cookie'
import { addPatient, deletePatient, getNumPatients, getPatients } from './patients'
import { extensions, getFileName, getType } from './content-type'

const getQueryParams = (url) => {
    return url.split('?')[1]
}
const getRequestBody = (req) => new Promise((resolve, reject) => {
    let content = ''
    req
        .on('data', (chunk) => {
            content += chunk
        })
        .on('end', () => {
            resolve(JSON.parse(content))
        })
        .on('error', (error) => {
            reject(error)
        })
})
const readFile = (fileName) => new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
        if (err !== null) {
            reject(err)
            console.log(err)
            return
        }
        resolve(data)
    })
})
export const requestFile = async (req, res) => {
    const fileName = getFileName(req.url)
    const type = getType(fileName)
    const data = await readFile(fileName)
    res.setHeader('Content-Type', type)
    res.end(data)
}
export const getLogin = (req, res) => {
    const sessionId = getSessionId(req)
    if (isSessionValid(sessionId)) {
        const docId = getDocId(sessionId)
        const docInf = getDocById(docId)
        if (docInf !== null) {
            res.setHeader('Content-Type', extensions.json)
            res.end(JSON.stringify({
                id: docInf.id,
                name: docInf.name,
                image: docInf.image
            }))
            return
        }

        closeSession(sessionId)
    }
    res.setHeader('Content-Type', extensions.json)
    res.end(JSON.stringify({}))
}

export const login = async (req, res) => {
    const reqJsonObj = await getRequestBody(req)
    const doc = findDoc(reqJsonObj.email, reqJsonObj.password)
    if (doc !== null) {
        const sessionId = openSession(doc.id)
        setSessionId(sessionId, res)
        res.setHeader('Content-Type', extensions.json)

        res.end(JSON.stringify(doc))
        return
    }
    res.setHeader('Content-Type', extensions.json)
    res.end(JSON.stringify({
        error: 'Email or Password not correct'
    }))
}
export const register = async (req, res) => {
    const reqJsonObj = await getRequestBody(req)
    const newdoc = addDoctor(reqJsonObj.email, reqJsonObj.password, reqJsonObj.name)
    if (newdoc !== null) {
        const sessionId = openSession(newdoc.id)
        setSessionId(sessionId, res)
        res.setHeader('Content-Type', extensions.json)
        res.end(JSON.stringify(newdoc))
        return
    }
    res.setHeader('Content-Type', extensions.json)
    res.end(JSON.stringify({
        error: 'Email already register'
    }))
}
export const logout = (req, res) => {
    closeSession(getSessionId(req))
    res.end()
}
export const requestGetNumPatients = (req, res) => {
    const sessionId = getSessionId(req)
    if (isSessionValid(sessionId)) {
        const docId = getDocId(sessionId)
        const numPatient = getNumPatients(docId)
        res.setHeader('Content-Type', extensions.json)
        res.end(JSON.stringify({ numPatient: numPatient }))
        return
    }
    res.setHeader('Content-Type', extensions.json)
    res.end(JSON.stringify({ numPatient: 0 }))
}
export const getPeople = (req, res) => {
    const sessionId = getSessionId(req)
    if (isSessionValid(sessionId)) {
        const params = getQueryParams(req.url)
        const paramObj = qs.parse(params)

        const from = Number(paramObj.from)
        const to = Number(paramObj.to)
        const search = decodeURI(paramObj.search)
        const sortBy = decodeURI(paramObj.sort)
        const sortByOrder = decodeURI(paramObj.order)
        const docId = getDocId(sessionId)

        const result = getPatients(docId, search, sortBy, sortByOrder, from, to)

        res.setHeader('Content-Type', extensions.json)
        res.end(JSON.stringify(result))
        return
    }
    res.setHeader('Content-Type', extensions.json)
    res.end(JSON.stringify([]))
}
export const requestAddPatient = async (req, res) => {
    const sessionId = getSessionId(req)
    if (isSessionValid(sessionId)) {
        const reqJsonObj = await getRequestBody(req)
        const docId = getDocId(sessionId)
        addPatient(docId, reqJsonObj)
        res.end()
        return
    }
    res.statusCode = 401
    res.end()
}
export const deletePatients = async (req, res) => {
    const sessionId = getSessionId(req)
    if (isSessionValid(sessionId)) {
        const ids = await getRequestBody(req)
        const doctorId = getDocId(sessionId)
        deletePatient(doctorId, ids)
        res.end()
        return
    }
    res.statusCode = 401
    res.end()
}
