// checkRoles.js

import axios from 'axios';
import Cookies from 'js-cookie';

const checkRoles = async () => {
  try {
    // Ambil token dari cookies
    const token = Cookies.get('jwt_token');
    // Lakukan request ke backend untuk verifikasi token
    const response = await axios.post('http://192.168.148.125:5000/auth/validate', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Ambil role dari respons
    const { role } = response.data;
    // Kembalikan role pengguna
    return role;
  } catch (error) {
    // Tangani kesalahan jika terjadi
    throw new Error('Error checking roles');
  }
};

export default checkRoles;
