const addBtn = document.querySelector(".add_btn")
const container = document.querySelector(".patient_container")
const fon = document.querySelector(".patient_container .fon")
const save = document.querySelector(".save")
const saveloginbtn = document.querySelector(".save_login")
const login = document.querySelector(".login")
const logcontainer = document.querySelector(".login_container")
const loginfon = document.querySelector(".login_container .fon")
const contactinfo = document.querySelector(".contact_info")
const username = document.querySelector(".logged_in span")
const logout = document.querySelector(".logout")
const register = document.querySelector(".register")
const regcontainer = document.querySelector(".register_container")
const regfon = document.querySelector(".register_container .fon")
const savereg = document.querySelector(".save_register")

const searchInput = document.querySelector(".container input")

const sortBy = document.querySelector(".sort select")
const sortName = document.querySelector(".name_btn")
const sortAge = document.querySelector(".age_btn")
const sortByTreatment = document.querySelector(".treatment_btn")

const delPatient = document.querySelector(".del_btn")

const createTableRow = (item) => {
  var template = document.querySelector("#table_template")
  var tableFragment = template.content.cloneNode(true)
  const check = tableFragment.querySelector(".check input")
  const id = tableFragment.querySelector(".id")
  const name = tableFragment.querySelector(".name label")

  const age = tableFragment.querySelector(".age")
  const gender = tableFragment.querySelector(".gender")
  const disease = tableFragment.querySelector(".disease")
  const treatment = tableFragment.querySelector(".treatment")
  const phone = tableFragment.querySelector(".phone")
  const address = tableFragment.querySelector(".address")
  const image = tableFragment.querySelector(".contact_photo img")
  if (item.image !== undefined) {
    image.src = item.image
  }
  check.setAttribute("id", item.id)
  name.setAttribute("for", item.id)
  id.innerText = item.id
  name.innerText = item.name
  age.innerText = item.age
  gender.innerText = item.gender
  disease.innerText = item.disease
  treatment.innerText = item.treatment + "%"
  phone.innerText = item.phone
  address.innerText = item.address

  return tableFragment
}

const renderTable = (people) => {
  const table = document.querySelector(".table tbody")
  clearTable()
  for (var i = 0; i < people.length; i++) {
    const item = people[i]
    const fragment = createTableRow(item)
    table.appendChild(fragment)
  }
  // console.log(table.children)
}

const clearTable = () => {
  const table = document.querySelector(".table tbody")
  while (table.children[1] !== undefined) {
    table.removeChild(table.lastElementChild)
  }
}
let currentpage = 0
let numPages = 0
let sortByValue = ""
let sortByOrder = "a"
let patients = []

const left = document.querySelector(".left")
const right = document.querySelector(".right")
const cur_page = document.querySelector(".cur_page")

left.addEventListener("click", () => {
  if (currentpage === 0) {
    return
  }
  currentpage = currentpage - 1
  goToPage(currentpage)
  cur_page.innerHTML = currentpage + 1
})

right.addEventListener("click", () => {
  if (currentpage === numPages - 1) {
    return
  }
  currentpage = currentpage + 1
  goToPage(currentpage)
  cur_page.innerHTML = currentpage + 1
})
const getNumpeople = async () => {
  const res = await fetch("num")
  const obj = await res.json()

  const quantity = document.querySelector(".quantity span")
  const pages = document.querySelector(".of_pages span")
  quantity.innerHTML = obj.numPatient
  numPages = Math.ceil(obj.numPatient / 10)
  pages.innerHTML = numPages
}
const goToPage = async (pageIndex) => {
  const from = pageIndex * 10
  const to = from + 10

  const res = await fetch(
    `/getpeople?from=${from}&to=${to}&search=${encodeURI(
      searchInput.value
    )}&sort=${encodeURI(sortByValue)}&order=${sortByOrder}`
  )
  const people = await res.json()
  patients = people
  renderTable(people)
}
const getloginstatus = async () => {
  const res = await fetch("/getlogin")
  const login = await res.json()
  if (login.id !== undefined) {
    contactinfo.classList.add("isloggedin")
    username.innerHTML = login.name
  }
}
;(async () => {
  await getloginstatus()
  await getNumpeople()
  await goToPage(currentpage)
})()

logout.addEventListener("click", async () => {
  await fetch("logout")
  patients = []

  contactinfo.classList.remove("isloggedin")
  await getNumpeople()
  await goToPage(currentpage)
})

login.addEventListener("click", () => {
  logcontainer.classList.add("active")
})
register.addEventListener("click", () => {
  regcontainer.classList.add("active")
})
delPatient.addEventListener("click", async () => {
  const checkBoxes = document.querySelectorAll('.check input[type="checkbox"]')
  patientIds = []
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      patientIds.push(patients[i].id)
    }
  }
  if (patientIds.length === 0) {
    return
  }
  await fetch("delete", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "Post",
    body: JSON.stringify(patientIds),
  })
  await getNumpeople()
  await goToPage(currentpage)
})

addBtn.addEventListener("click", () => {
  container.classList.add("active")
})

loginfon.addEventListener("click", () => {
  logcontainer.classList.remove("active")
})

regfon.addEventListener("click", () => {
  regcontainer.classList.remove("active")
})

fon.addEventListener("click", () => {
  container.classList.remove("active")
})
searchInput.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    goToPage(currentpage)
  }
})
sortBy.addEventListener("change", () => {
  sortByValue = sortBy.value
  goToPage(currentpage)
})
sortName.addEventListener("click", () => {
  if (sortByValue !== "name") {
    sortByOrder = "a"
  } else {
    sortByOrder = sortByOrder === "a" ? "b" : "a"
  }

  sortByValue = "name"
  goToPage(currentpage)
})
sortAge.addEventListener("click", () => {
  if (sortByValue !== "age") {
    sortByOrder = "a"
  } else {
    sortByOrder = sortByOrder === "a" ? "b" : "a"
  }

  sortByValue = "age"
  goToPage(currentpage)
})
sortByTreatment.addEventListener("click", () => {
  if (sortByValue !== "treatment") {
    sortByOrder = "a"
  } else {
    sortByOrder = sortByOrder === "a" ? "b" : "a"
  }

  sortByValue = "treatment"
  goToPage(currentpage)
})
saveloginbtn.addEventListener("click", async () => {
  const mailInput = document.querySelector(
    '.log_doctor input[data-key="email"]'
  )
  const passinput = document.querySelector(
    '.log_doctor input[data-key="password"]'
  )
  const obj = {
    email: mailInput.value,
    password: passinput.value,
  }
  const res = await fetch("login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  })
  const result = await res.json()

  const er = document.querySelector(".login_container .error")
  if (result.error !== undefined) {
    er.classList.add("active")
    er.innerText = result.error
    return
  }
  logcontainer.classList.remove("active")
  contactinfo.classList.add("isloggedin")

  username.innerHTML = result.name
  mailInput.value = ""
  passinput.value = ""
  er.classList.remove("active")

  await getNumpeople()
  await goToPage(currentpage)
})
savereg.addEventListener("click", async () => {
  const mailInput = document.querySelector(
    '.reg_doctor input[data-key="email"]'
  )
  const passinput = document.querySelector(
    '.reg_doctor input[data-key="password"]'
  )
  const nameinput = document.querySelector('.reg_doctor input[data-key="name"]')

  const obj = {
    email: mailInput.value,
    password: passinput.value,
    name: nameinput.value,
  }
  const res = await fetch("register", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  })
  const result = await res.json()

  const er = document.querySelector(".register_container .error")

  if (result.error !== undefined) {
    er.classList.add("active")
    er.innerText = result.error
    return
  }
  regcontainer.classList.remove("active")
  contactinfo.classList.add("isloggedin")
  username.innerHTML = result.name
  mailInput.value = ""
  passinput.value = ""
  nameinput.value = ""
  er.classList.remove("active")
})

save.addEventListener("click", async () => {
  container.classList.remove("active")
  const inputs = Array.from(document.querySelectorAll(".add_patient input"))
  console.log(inputs)
  const obj = inputs.reduce((obj, input) => {
    const key = input.getAttribute("data-key")

    obj[key] = input.value
    return obj
  }, {})

  inputs.forEach((item) => {
    item.value = ""
  })

  await fetch("addpatient", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  })
  await getNumpeople()
  await goToPage(currentpage)
})
