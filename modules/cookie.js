const parseSessionCookie = (cookie) => {
    return cookie.split('=')[1]
}

const getSessionId = (req) => {
    if (req.headers.cookie !== undefined) {
        return parseSessionCookie(req.headers.cookie)
    }
    return ""

}
const setSessionId = (sessionId, res) => {
    res.setHeader('Set-Cookie', `Session=${sessionId}`)

}

exports.getSessionId = getSessionId
exports.setSessionId = setSessionId