import axios from "axios";
const viaCep = axios.create({
    baseURL: "https://viacep.com.br/ws/",
    timeout: 1000,
    headers: { "Content-Type": "application/json" }
})

export default viaCep;