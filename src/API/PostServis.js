import axios from 'axios'
import { message } from 'antd';

export default class Api {
  static async getAll(name) {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/${name}`);
      return response.data
    } catch (error) {
      message.error(`Error status: ${error.response.status}, something went wrong`);
    }
  }
  static async getUsers() {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users`)
      return response.data
    } catch (error) {
      message.error(`Error status: ${error.response.status}, something went wrong`);
    }
  }
  static async getObjTypes(objType, id) {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/${objType}/${id}`)
      return response.data
    } catch (error) {
      if(error.response.status === 404) {
        message.error(`Error status: ${error.response.status}, enter from 1-100`);
      }
      else {
        message.error(`Error status: ${error.response.status}, something went wrong`);
      }

    }
  }
}
