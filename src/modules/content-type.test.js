import { getFileName, getType } from "./content-type"

describe("getFileName", () => {
    it("should return Docare.html", () => {
        expect(getFileName("/")).toBe("Docare.html")
    })

    it("should return style.css", () => {
        expect(getFileName("/folder/STYLE.css")).toBe("folder/style.css")
    })

    it("should handle queryParams", () => {
        expect(getFileName("/fonts/arial.ttf?style=italic")).toBe("fonts/arial.ttf")
    })
})

describe("getType", () => {
    it("should return cssType", () => {
        expect(getType("style.css")).toBe("text/css")
    })

    it("should return jsonType", () => {
        expect(getType("package.json")).toBe("text/json")
    })

    it("should return image", () => {
        expect(getType("image.png")).toBe("image/png")
    })
    it("should handle path", () => {
        expect(getType("src/index.js")).toBe("application/javascript")
    })
    it("should handle dots", () => {
        expect(getType("index.test.js")).toBe("application/javascript")
    })
    it("should return undefined", () => {
        expect(getType("index.xml")).toBe(undefined)
        expect(getType("index.doc")).toBe(undefined)
    })
})
