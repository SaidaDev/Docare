const http = require('http')
const fs = require('fs')
const qs = require('querystring')
const ext = require('./modules/content-type')
const sessions = require('./modules/sessions')
const doctors = require('./modules/doctors')
const patients = require('./modules/patients')
const cookies = require('./modules/cookie')

const getQueryParams = (url) => {
    return url.split('?')[1]
}

const getRequestBody = (req, cb) => {
    let content = ''
    req
        .on('data', (chunk) => {
            content += chunk
        })
        .on('end', () => cb(JSON.parse(content)))
}

const server = http.createServer((req, res) => {
    if (req.url === '/getlogin') {
        const sessionId = cookies.getSessionId(req)

        if (sessions.isSessionValid(sessionId)) {
            const docId = sessions.getDocId(sessionId)
            const docInf = doctors.getDocById(docId)
            if (docInf !== null) {
                res.setHeader('Content-Type', ext.extensions.json)

                res.end(JSON.stringify({
                    id: docInf.id,
                    name: docInf.name,
                    image: docInf.image
                }))
                return
            }

            console.log('Cant find doctor')
            sessions.closeSession(sessionId)
        }
        res.end(JSON.stringify({}))
        return
    }
    if (req.url === '/login') { //find doc
        getRequestBody(req, (reqJsonObj) => {

            const doc = doctors.findDoc(reqJsonObj.email, reqJsonObj.password)
            if (doc !== null) {
                const sessionId = sessions.openSession(doc.id)
                cookies.setSessionId(sessionId, res)
                res.setHeader('Content-Type', ext.extensions.json)

                res.end(JSON.stringify(doc))
                return
            }
            res.setHeader('Content-Type', ext.extensions.json)
            res.end(JSON.stringify({
                error: 'Email or Password not correct'
            }))
        })
        return
    }
    if (req.url === '/register') {
        getRequestBody(req, (reqJsonObj) => {

            const newdoc = doctors.addDoctor(reqJsonObj.email)
            if (newdoc !== null) {

                const sessionId = sessions.openSession(newdoc.id)
                cookies.setSessionId(sessionId, res)

                res.setHeader('Content-Type', ext.extensions.json)
                res.end(JSON.stringify(newdoc))

                return
            }

            res.setHeader('Content-Type', ext.extensions.json)
            res.end(JSON.stringify({
                error: 'Email already register'
            }))

        })
        return
    }
    if (req.url === '/logout') {
        sessions.closeSession(cookies.getSessionId(req))
        res.end()
        return
    }


    if (req.url === '/num') {
        const sessionId = cookies.getSessionId(req)

        if (sessions.isSessionValid(sessionId)) {
            const docId = sessions.getDocId(sessionId)
            const numPatient = patients.getNumPatiens(docId)

            res.setHeader('Content-Type', ext.extensions.json)
            res.end(JSON.stringify({ numPatient: numPatient }))
            return
        }
        res.setHeader('Content-Type', ext.extensions.json)
        res.end(JSON.stringify({ numPatient: 0 }))
        return
    }
    if (req.url.startsWith('/getpeople')) {
        const sessionId = cookies.getSessionId(req)
        if (sessions.isSessionValid(sessionId)) {
            const params = getQueryParams(req.url)
            const paramObj = qs.parse(params)

            const from = Number(paramObj.from)
            const to = Number(paramObj.to)
            const search = decodeURI(paramObj.search)
            const sortBy = decodeURI(paramObj.sort)
            const sortByOrder = decodeURI(paramObj.order)
            const docId = sessions.getDocId(sessionId)

            const result = patients.getPatients(docId, search, sortBy, sortByOrder, from, to)

            res.setHeader('Content-Type', ext.extensions.json)
            res.end(JSON.stringify(result))
            return
        }
        res.setHeader('Content-Type', ext.extensions.json)
        res.end(JSON.stringify([]))
        return
    }


    if (req.url === '/addpatient') {
        const sessionId = cookies.getSessionId(req)
        if (sessions.isSessionValid(sessionId)) {


            getRequestBody(req, (reqJsonObj) => {

                const docId = sessions.getDocId(sessionId)
                patients.addPatient(docId, reqJsonObj)
                res.end()
            })

            return
        }
        res.statusCode = 401
        res.end()
        return
    }
    if (req.url === '/delete') {
        const sessionId = cookies.getSessionId(req)
        if (sessions.isSessionValid(sessionId)) {

            getRequestBody(req, (ids) => {

                const doctorId = sessions.getDocId(sessionId)
                patients.deletePatient(doctorId, ids)

                res.end()

            })
            return
        }
        res.statusCode = 401
        res.end()
        return
    }

    console.log(req.url)
    const fileName = ext.getFileName(req.url)
    const type = ext.getType(fileName)
    fs.readFile(fileName, (err, data) => {
        if (err !== null) {
            console.log(err)
            return
        }
        res.setHeader('Content-Type', type)
        res.end(data)
    })
})
server.listen(3000)