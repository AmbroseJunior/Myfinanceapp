import { api } from '../services/api';



const fetchUsers = async () => {
    try {
      const response = await api.get('/user.php');
      console.log('Users:', response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    }
  };
  
  fetchUsers();
  