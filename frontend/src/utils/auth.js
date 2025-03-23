import { API_URL } from '../constants/constants.js'

  export const getAuthUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('No se ha podido obtener el usuario')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
    }
  };