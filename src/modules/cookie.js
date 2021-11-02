const parseSessionCookie = (cookie) => {
    return cookie.split('=')[1]
}

export const getSessionId = (req) => {
    if (req.headers.cookie !== undefined) {
        return parseSessionCookie(req.headers.cookie)
    }
    return ""

}
export const setSessionId = (sessionId, res) => {
    res.setHeader('Set-Cookie', `Session=${sessionId}`)
}

