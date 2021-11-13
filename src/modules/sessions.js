import fs from 'fs'
import { getRandomString } from "./utilities"
let sessions = {}

const saveSessions = () => {
    fs.writeFileSync('sessions.json', JSON.stringify(sessions, null, 2))
}

export const loadSession = () => {
    sessions = JSON.parse(fs.readFileSync('sessions.json'))
}

export const isSessionValid = (sessionId) => {
    return sessions[sessionId] !== undefined
}

export const closeSession = (sessionId) => {
    if (isSessionValid(sessionId)) {
        delete sessions[sessionId]
        saveSessions()
    }
}

export const getDocId = (sessionId) => {
    const sessionobj = sessions[sessionId]
    const docId = sessionobj.id
    return docId
}

export const createOpenSession = (getRandomString) => (docId) => {
    const randomNum = getRandomString()
    sessions[randomNum] = {
        id: docId,
    }
    saveSessions()
    return randomNum
}
export const openSession = createOpenSession(getRandomString)