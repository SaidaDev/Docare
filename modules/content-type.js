const baza = {
    js: 'aplication/javascript',
    json: 'text/json',
    css: 'text/css',
    html: 'text/html',
    ico: 'image/x-icon',
    png: 'image/png',
    jpg: 'image/jpeg',
    eot: 'application/vnd.ms-fontobject',
    ttf: 'application/x-font-ttf',
    woff: 'application/font-woff',
    svg: 'image/svg+xml',
}

const getFileName = (url) => {
    if (url === '/') {
        return 'Docare.html'
    }
    const name = url.split('?')[0].toLowerCase()
    return name.slice(1)
}

const getExt = (fileName) => {
    const fileMass = fileName.split('.')
    return fileMass[fileMass.length - 1]
}

const getType = (fileName) => {
    const ext = getExt(fileName)
    return baza[ext]
}
exports.extensions = baza
exports.getType = getType
exports.getFileName = getFileName