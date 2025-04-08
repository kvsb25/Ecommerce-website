axios.defaults.baseURL = 'http://localhost:3000';

let total = 0;

const showErrorMessage = (message, remove=false) => {
    let showErrorMessage = document.querySelector(".error");
    if (showErrorMessage) {
    
        showErrorMessage.style.display = "flex";
        showErrorMessage.innerText = message;

        if(remove){
            setTimeout(()=>{
                showErrorMessage.style.display = "none";
            }, 5000);
        }
    }
}

const showLoading = (element, loading) => {
    element.classList.toggle('loading', loading);
};

const getCart = async () => {
    return axios.get("/customer/cart", { withCredentials: true })
        .then((response)=>{
            if(response.status === 204) return { message: "No products in cart"};
            return response.data;
        })
        .catch((error)=>{
            const errorObj = {
                error : error.response?.data || "An Error occurred while loading the page! Please try again",
                status : error.response?.status || 500,
            }
            
            showErrorMessage(errorObj.error);

            return errorObj;
        })
}

const updateCart = async (productId, quantity) => {
    return axios.post(`/customer/cart?productId=${productId}&quantity=${quantity}`, {}, { withCredentials: true })
        .then((response)=>{
            if(response.status === 204) return {message: "No products in cart"};
            return response.data;
        })
        .catch((error)=>{
            const errorObj = {
                error : error.response?.data || "An Error occurred while updating the cart! Please try again.",
                status : error.response?.status || 500,
            }
            
            showErrorMessage(errorObj.error);

            return errorObj;
        })
}

const deleteCart = async (productId, all = 0) => {
    return axios.delete(`/customer/cart?productId=${productId}&all=${all}`)
        .then((response)=>{
            if(response.status === 204) return {message: "No products in cart"};
            return response.data;
        })
        .catch((error)=>{
            const errorObj = {
                error : error.response?.data || "An Error occurred while updating the cart! Please try again.",
                status : error.response?.status || 500,
            }
            
            showErrorMessage(errorObj.error);

            return errorObj;
        })
}

/* for Eventlistener callback functions */

// add these functions onclick of +,- icon
const updateCartfrontend = async (element, productId, qty, quantityInput) => {
    try {
        element.classList.toggle('loading', true);

        const response = await updateCart(productId, qty);
        // const response = {name: "name"};

        if (!response.error) {
            if (quantityInput) {
                quantityInput.value = parseInt(quantityInput.value) + qty;
            }
        }
    } finally {
        element.classList.toggle('loading', false);
    }
}

const removeCartProduct = (element) => {
    element.classList.add('removing');
    setTimeout(() => {
        element.remove();
    }, 500);
}

// add these functions onclick of 'del' icon
const deleteCartFrontend = async (element, productId, all) => {
    try {
        element.classList.toggle('loading', true);

        const response = await deleteCart(productId, all);

        element.classList.toggle('loading', false);
        if (!response.error) {
            removeCartProduct(element);
        }
    } finally {
    }
}