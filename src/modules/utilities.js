export const createGetRandomString = (getRandomValue) => () => {
    return Math.floor(getRandomValue() * 100000).toString()
}
export const getRandomString = createGetRandomString(Math.random)