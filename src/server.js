import http from 'http'
import fs from 'fs'
import qs from 'querystring'
import { extensions, getFileName, getType } from './modules/content-type'
import { getSessionId, setSessionId } from './modules/cookie'
import { isSessionValid, closeSession, getDocId, openSession } from './modules/sessions'
import { getDocById, addDoctor, findDoc } from './modules/doctors'
import { getNumPatients, getPatients, addPatient, deletePatient } from './modules/patients'

const getQueryParams = (url) => {
    return url.split('?')[1]
}

const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
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
}

const server = http.createServer((req, res) => {
    if (req.url === '/getlogin') {
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

            console.log('Cant find doctor')
            closeSession(sessionId)
        }
        res.end(JSON.stringify({}))
        return
    }
    if (req.url === '/login') { //find doc
        getRequestBody(req).then((reqJsonObj) => {

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
        })
        return
    }
    if (req.url === '/register') {
        getRequestBody(req).then((reqJsonObj) => {

            const newdoc = addDoctor(reqJsonObj.email)
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

        })
        return
    }
    if (req.url === '/logout') {
        closeSession(getSessionId(req))
        res.end()
        return
    }


    if (req.url === '/num') {
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
        return
    }
    if (req.url.startsWith('/getpeople')) {
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
        return
    }


    if (req.url === '/addpatient') {
        const sessionId = getSessionId(req)
        if (isSessionValid(sessionId)) {


            getRequestBody(req).then((reqJsonObj) => {

                const docId = getDocId(sessionId)
                addPatient(docId, reqJsonObj)
                res.end()
            })

            return
        }
        res.statusCode = 401
        res.end()
        return
    }
    if (req.url === '/delete') {
        const sessionId = getSessionId(req)
        if (isSessionValid(sessionId)) {

            getRequestBody(req).then((ids) => {

                const doctorId = getDocId(sessionId)
                deletePatient(doctorId, ids)
                res.end()
            })
            return
        }
        res.statusCode = 401
        res.end()
        return
    }

    console.log(req.url)
    const fileName = getFileName(req.url)
    const type = getType(fileName)
    const readFile = (fileName) => new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err !== null) {
                reject(err)
                console.log(err)
                return
            }
            resolve(data)
        })
    })
    readFile(fileName).then((data) => {
        res.setHeader('Content-Type', type)
        res.end(data)
    })
})
server.listen(3000)