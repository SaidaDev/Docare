const fs = require('fs')
const util = require('./utilites')

let sessions = {}

const saveSessions = () => {
    fs.writeFileSync('sessions.json', JSON.stringify(sessions, null, 2))
}

const loadSessions = () => {
    sessions = JSON.parse(fs.readFileSync('sessions.json'))
}
loadSessions()

const isSessionValid = (sessionId) => {
    return sessions[sessionId] !== undefined
}

const closeSession = (sessionId) => {
    if (isSessionValid(sessionId)) {
        delete sessions[sessionId]
        saveSessions()
    }
}
const getDocId = (sessionId) => {
    const sessionobj = sessions[sessionId]
    const docId = sessionobj.id
    return docId
}


const openSession = (docId) => {
    const randomNum = util.getRandomString()
    sessions[randomNum] = {
        id: docId,
    }

    saveSessions()
    return randomNum
}

exports.isSessionValid = isSessionValid
exports.closeSession = closeSession
exports.getDocId = getDocId
exports.openSession = openSession