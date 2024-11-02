const apiURl = import.meta.env.VITE_API_URL;

export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${apiURl}/${endpoint}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};