export const handleError = (error) => {
    const response = error.response;
    if (!response) return 'Network Error';

    console.error(`API Error: ${response.status} - ${response.data.message}`);

    return response.data.message || 'Something went wrong';
};

export const handleRegistrationError = (error) => {
    if (error.response?.data?.message?.includes("Duplicate entry")) {
        return "Email already exists";
    }
    return handleError(error);
};
