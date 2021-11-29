export const extensions = {
    js: 'application/javascript',
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

export const getFileName = (url) => {
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

export const getType = (fileName) => {
    const ext = getExt(fileName)
    return extensions[ext]
}