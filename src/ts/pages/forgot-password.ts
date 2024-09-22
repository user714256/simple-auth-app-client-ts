import { api, showAlert, redirectToPage, verifyToken } from "../utils/utils"
import { validateEmail, validateInput, addFieldError, removeFieldsError } from "../utils/form-validation"

const form = document.querySelector(".form") as HTMLFormElement

verifyToken("my-account")

const handleFormSubmit = (e: Event) => {
  e.preventDefault()

  const labels = document.querySelectorAll<HTMLInputElement>(".label") as NodeList
  const inputs = document.querySelectorAll<HTMLInputElement>(".input") as NodeList
  const alertMessage = document.querySelector(".alert-message") as HTMLElement
  const emailInput = document.querySelector("#email-input") as HTMLInputElement
  const emailLabel = document.querySelector("#email-label") as HTMLInputElement
  const errorMessages = document.querySelectorAll(".error-message") as NodeList

  const emailValue = emailInput.value.trim()
  const emailError = errorMessages[0] as HTMLElement
  const globalError = errorMessages[1] as HTMLElement

  removeFieldsError(errorMessages, inputs, labels, globalError)

  if (validateInput(emailValue, emailError, emailInput, emailLabel)) return

  if (validateEmail(emailValue, globalError, emailInput, emailLabel)) return

  const dataFetching = async () => {
    const submitButton = document.querySelector(".submit-button") as HTMLButtonElement

    submitButton.classList.add("loading")

    const formData = JSON.stringify({ email: emailValue })

    try {
      const res = await api.post("/api/auth/forgot-password", formData)

      submitButton.classList.remove("loading")

      showAlert(alertMessage, res.data.message)

      emailInput.value = ""

      redirectToPage("login")
    } catch (e) {
      console.error(e.response.data)

      const message: string = e.response.data.message

      submitButton.classList.remove("loading")

      addFieldError(globalError, emailInput, message, true, emailLabel, true)
    }
  }

  dataFetching()
}

form.addEventListener("submit", handleFormSubmit)
