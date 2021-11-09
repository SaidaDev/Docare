import { createRequestFile } from "./routes";
const readFileMine = (fileName) => {
    if (fileName === "docare.html") {
        return "<p>text</p>"
    }
    return ""
}
const requestFile = createRequestFile(readFileMine)


describe("requestFile", () => {
    it("should return index.html", async () => {
        let numSetHeaderCalls = 0
        let numEndCalls = 0
        const req = { url: "/" }
        const res = {
            setHeader: (key, value) => {
                expect(key).toBe("Content-Type")
                expect(value).toBe("text/html")
                ++numSetHeaderCalls
            },
            end: (data) => {
                expect(data).toBe("<p>text</p>")
                ++numEndCalls
            }
        }
        await requestFile(req, res)
        expect(numSetHeaderCalls).toBe(1)
        expect(numEndCalls).toBe(1)
    })
})
