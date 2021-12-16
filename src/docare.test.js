import puppeteer from "puppeteer"
jest.setTimeout(300000)
describe("docare", () => {
  let page
  let browser
  let context

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1920,
        height: 1024,
        deviceScaleFactor: 1,
      },
      // slowMo: 150,
    })
  })
  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    context = await browser.createIncognitoBrowserContext()
    page = await context.newPage()
  })

  afterEach(async () => {
    await page.close()
    page = null
  })
  const getByText = async (page, selector, text) => {
    const [element] = await page.$x(`//${selector}[contains(text(),"${text}")]`)
    if (element === undefined) {
      throw new Error(`Can't find ${selector} with ["${text}")]`)
    }
    const isVisible = await element.isIntersectingViewport()

    if (!isVisible) {
      throw new Error(`${selector} with "${text}" is not visible`)
    }
    return element
  }
  const goToDocare = (page) => {
    return page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
    })
  }
  const login = async (page, email) => {
    const login = await getByText(page, "a", "Log In")
    await login.click()
    await page.type(".login_container input[data-key='email']", email)
    await page.type(".login_container input[data-key='password']", "1234")
    await page.click("button.save_login")
    await page.waitForNetworkIdle()
  }
  const register = async (page, email) => {
    const register = await getByText(page, "a", "Register")
    await register.click()
    await page.type(".register_container input[data-key='email']", email)
    await page.type(".register_container input[data-key='password']", "1234")
    await page.type(".register_container input[data-key='name']", "Sadko")
    await page.click("button.save_register")
    await page.waitForNetworkIdle()
  }
  it("should Register", async () => {
    await goToDocare(page)
    await register(page, "wand")
    await getByText(page, "a", "Log Out")
  })
  it("should Login", async () => {
    await goToDocare(page)
    await login(page, "wand")
    await getByText(page, "a", "Log Out")
    const page2 = await context.newPage()
    await goToDocare(page2)
    await getByText(page2, "a", "Log Out")
    await page2.close()

    const logout = await getByText(page, "a", "Log Out")
    await logout.click()
    await getByText(page, "a", "Register")
  })
  const addPatient = async (page, name, phone) => {
    await page.click("button.add_btn")
    await page.type(".add_patient input[data-key='name']", name)
    await page.type(".add_patient input[data-key='age']", "45")
    await page.type(".add_patient input[data-key='gender']", "female")
    await page.type(".add_patient input[data-key='disease']", "zob")
    await page.type(".add_patient input[data-key='treatment']", "qolodaniye")
    await page.type(".add_patient input[data-key='address']", "Khatai")
    await page.type(".add_patient input[data-key='phone']", phone)
    await page.click(".add_patient .save")
    await page.waitForNetworkIdle()
  }
  const checkPatient = async (page, name) => {
    const el = await getByText(page, "label", name)
    await el.click()
  }
  const getElementText = (page, selector) => {
    return page.$eval(selector, (element) => {
      return element.textContent
    })
  }
  const getNumPatients = (page) => {
    return page.$eval(".content>.list>table>tbody", (element) => {
      return element.childElementCount - 1
    })
  }
  it("should add patient", async () => {
    await goToDocare(page)
    await register(page, "nuna")
    await addPatient(page, "Sasha", "456")
    await addPatient(page, "Saida", "123")

    // await page.waitForTimeout(300000)
    const numChildren = await getNumPatients(page)
    const nameSaida = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(2)>td.name>label"
    )
    const phoneSaida = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(2)>td.phone"
    )
    const nameSasha = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(3)>td.name>label"
    )
    const phoneSasha = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(3)>td.phone"
    )
    expect(numChildren).toBe(2)
    expect(phoneSaida).toBe("123")
    expect(nameSaida).toBe("Saida")

    expect(phoneSasha).toBe("456")
    expect(nameSasha).toBe("Sasha")
  })
  it("should delete patient", async () => {
    await goToDocare(page)
    await register(page, "sadko")

    await addPatient(page, "Aygun", "789")
    await addPatient(page, "Sabina", "7913")
    await addPatient(page, "Eva", "012")

    await checkPatient(page, "Aygun")
    await checkPatient(page, "Sabina")

    await expect(getByText(page, "label", "Aygun")).resolves.toBeTruthy()

    await page.click(".del_btn")
    await page.waitForNetworkIdle()
    const numChildren = await getNumPatients(page)

    expect(numChildren).toBe(1)
    await expect(getByText(page, "label", "Aygun")).rejects.toThrow()
  })
  it("should filter patient", async () => {
    await goToDocare(page)
    await register(page, "filtermail")

    await addPatient(page, "Aygun", "789")
    await addPatient(page, "Sabina", "7913")
    await addPatient(page, "Eva", "012")

    await page.type(".container .search input", "Sabina")
    await page.keyboard.press("Enter")
    await page.waitForNetworkIdle()
    // await page.waitForTimeout(300000)
    await expect(getByText(page, "label", "Aygun")).rejects.toThrow()
    await expect(getByText(page, "label", "Eva")).rejects.toThrow()
    await expect(getByText(page, "label", "Sabina")).resolves.toBeTruthy()
  })
  it("should sort by name", async () => {
    await goToDocare(page)
    await register(page, "sortmail")

    await addPatient(page, "Aygun", "789")
    await addPatient(page, "Sabina", "7913")
    await addPatient(page, "Eva", "012")

    await page.select(".container .sort select", "name")

    await page.waitForNetworkIdle()
    // await page.waitForTimeout(300000)
    const nameAygun = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(2)>td.name>label"
    )
    const nameEva = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(3)>td.name>label"
    )
    const nameSabina = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(4)>td.name>label"
    )
    expect(nameAygun).toBe("Aygun")
    expect(nameSabina).toBe("Sabina")
    expect(nameEva).toBe("Eva")
  })
  const addPatientForSort = async (page, name, age, treatment) => {
    await page.click("button.add_btn")
    await page.type(".add_patient input[data-key='name']", name)
    await page.type(".add_patient input[data-key='age']", age)
    await page.type(".add_patient input[data-key='gender']", "female")
    await page.type(".add_patient input[data-key='disease']", "zob")
    await page.type(".add_patient input[data-key='treatment']", treatment)
    await page.type(".add_patient input[data-key='address']", "Khatai")
    await page.type(".add_patient input[data-key='phone']", "123")
    await page.click(".add_patient .save")
    await page.waitForNetworkIdle()
  }
  it("should sort by age", async () => {
    await goToDocare(page)
    await register(page, "sortage")

    await addPatientForSort(page, "Aygun", "21", "voda")
    await addPatientForSort(page, "Sabina", "32", "xleb")
    await addPatientForSort(page, "Eva", "26", "saxalin")

    await page.select(".container .sort select", "age")

    await page.waitForNetworkIdle()
    // await page.waitForTimeout(300000)
    const nameAygun = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(2)>td.name>label"
    )
    const nameEva = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(3)>td.name>label"
    )
    const nameSabina = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(4)>td.name>label"
    )
    expect(nameAygun).toBe("Aygun")
    expect(nameSabina).toBe("Sabina")
    expect(nameEva).toBe("Eva")
  })
  it("should sort by treatment", async () => {
    await goToDocare(page)
    await register(page, "sorttreatment")

    await addPatientForSort(page, "Aygun", "21", "80")
    await addPatientForSort(page, "Sabina", "32", "75")
    await addPatientForSort(page, "Eva", "26", "12")

    await page.select(".container .sort select", "treatment")

    await page.waitForNetworkIdle()
    // await page.waitForTimeout(300000)
    const nameAygun = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(4)>td.name>label"
    )
    const nameEva = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(2)>td.name>label"
    )
    const nameSabina = await getElementText(
      page,
      ".content>.list>table>tbody>tr:nth-child(3)>td.name>label"
    )
    expect(nameAygun).toBe("Aygun")
    expect(nameSabina).toBe("Sabina")
    expect(nameEva).toBe("Eva")
  })
  it("should paging", async () => {
    await goToDocare(page)
    await register(page, "paging")

    await addPatient(page, "ghygun", "743589")
    await addPatient(page, "Sabina", "7913")
    await addPatient(page, "feEva", "012")
    await addPatient(page, "rerygun", "43")
    await addPatient(page, "dSabina", "34")
    await addPatient(page, "Eva", "234")
    await addPatient(page, "adygun", "8")
    await addPatient(page, "Sabina", "565")
    await addPatient(page, "uyEva", "012")
    await addPatient(page, "Aygun", "789")
    await addPatient(page, "koSabina", "9")
    await addPatient(page, "Eva", "4012")

    const numChildren = await getNumPatients(page)

    expect(numChildren).toBe(10)
    await page.click(".page_info>button.right")
    await page.waitForNetworkIdle()
    const numChildrenP2 = await getNumPatients(page)
    // await page.waitForTimeout(300000)
    expect(numChildrenP2).toBe(2)
  })
})
