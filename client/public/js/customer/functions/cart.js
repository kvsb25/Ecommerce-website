axios.defaults.baseURL = 'http://localhost:3000';

const getCart = async () => {
    return axios.get("/customer/cart", { withCredentials: true })
        .then((response)=>{
            if(response.status === 204) return { message: "No products in cart"};
            return response.data;
        })
        .catch((error)=>{
            return error.response?.data || { message: "Unknown error occurred" };
        })
}

const updateCart = async (productId, quantity) => {
    return axios.post(`/customer/cart?productId=${productId}&quantity=${quantity}`, {}, { withCredentials: true })
        .then((response)=>{
            if(response.status === 204) return { message: "No products in cart"};
            return response.data;
        })
        .catch((error)=>{
            return error.response?.data || { message: "Unknown error occurred" };
        })
}

// const addProductToCart = async (productId, quantity) => {
//     return axios.post(`/customer/cart?productId=${productId}&quantity=${quantity}`, {}, { withCredentials: true })
//         .then((response)=>{
//             if(response.status === 204) return { message: "No products in cart"};
//             return response.data;
//         })
//         .catch((error)=>{
//             return error.response?.data || { message: "Unknown error occurred" };
//         })
// }