import fs from 'fs'
import { getRandomString } from "./utilities"
let sessions = {}

const createSaveSessions = (fs) => () => {
    fs.writeFileSync('sessions.json', JSON.stringify(sessions, null, 2))
}

export const createLoadSession = (fs) => () => {
    sessions = JSON.parse(fs.readFileSync('sessions.json'))
}

export const loadSession = createLoadSession(fs)

export const isSessionValid = (sessionId) => {
    return sessions[sessionId] !== undefined
}

export const createCloseSession = (fs) => (sessionId) => {
    if (isSessionValid(sessionId)) {
        delete sessions[sessionId]
        createSaveSessions(fs)()
    }
}
export const closeSession = createCloseSession(fs)

export const getDocId = (sessionId) => {
    const sessionobj = sessions[sessionId]
    const docId = sessionobj.id
    return docId
}

export const createOpenSession = (save, getRandomString) => (docId) => {
    const randomNum = getRandomString()
    sessions[randomNum] = {
        id: docId,
    }
    save()
    return randomNum
}
export const openSession = createOpenSession(createSaveSessions(fs), getRandomString)