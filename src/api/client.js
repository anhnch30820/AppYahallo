import axios from "axios";

export default axios.create({
    baseURL: 'http://192.168.6.104:8000/api/v1'
})