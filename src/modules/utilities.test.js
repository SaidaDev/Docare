
import { getRandomString } from "./utilities";

describe("getRandomString", () => {
    let random
    beforeAll(() => {
        random = jest.spyOn(global.Math, 'random')
    });

    afterAll(() => {
        random.mockRestore();
    })
    it("should return randomString", () => {
        random.mockReturnValue(0.123456789);
        expect(getRandomString()).toBe("12345")
        expect(random).toHaveBeenCalledTimes(1)
    })
})