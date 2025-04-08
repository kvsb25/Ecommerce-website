// const cart = require("../../../../server/models/cart");

document.addEventListener("DOMContentLoaded",async (event)=>{
    // const cart = await getCart();
    const cart = {
        products:[
            {
                product: {
                    _id : "nf9q83ufy",
                    name: "product",
                    price: 999,
                },
                qty: 1,
            },
            {
                product: {
                    _id : "nf9q83ufy",
                    name: "product",
                    price: 999,
                },
                qty: 1,
            },
            {
                product: {
                    _id : "nf9q83ufy",
                    name: "product",
                    price: 999,
                },
                qty: 1,
            },
            {
                product: {
                    _id : "nf9q83ufy",
                    name: "product",
                    price: 999,
                },
                qty: 1,
            },
        ]
    }
    
    if(cart.error) return console.log(cart.error);
    if(cart.message) return document.querySelector(".cart-container").innerHTML = `<p>${cart.message}</p>`;

    if(cart && cart.products?.length > 0 ){
        renderCart(cart.products);
    }
    
    let products = document.querySelectorAll('.cart-product');
    products.forEach((product)=>{
        product.addEventListener("click", async (event)=>{
            const productId = event.currentTarget.getAttribute('data-product-id');
            console.log(`productId: ${productId}`);
            let productDiv = event.currentTarget;
            console.log(`productDiv: ${productDiv}`);
            let eventTarget = event.target;
            console.log(`eventTarget: ${eventTarget}; id: ${eventTarget.id}`);
            const quantityInput = document.querySelector(`[data-qty-id="${productId}"]`);
            console.log(`quantityInput: ${quantityInput}; ${quantityInput.value}`);
            // delete product from db
            if(eventTarget.id == "delete-icon"){
                console.log("delete");
                deleteCartFrontend(productDiv, productId, 1);
            }
            // increase product qty by 1 in db
            if(eventTarget.id == "increase-icon"){
                console.log("increase");
                updateCartfrontend(productDiv, productId, 1, quantityInput);
            }
            // decrease product qty by 1 in db
            if(eventTarget.id == "decrease-icon"){
                console.log("decrease");
                if((parseInt(quantityInput.value) - 1) === 0) {
                    deleteCartFrontend(productDiv, productId);
                } else {
                    updateCartfrontend(productDiv, productId, -1, quantityInput);
                }
            }
        })
    })

    /* TEST */
    // products.forEach((product)=>{
    //     product.addEventListener("click", async (event)=>{
    //         // event.currentTarget.classList.toggle("loading", true);
    //         let productId = event.currentTarget.getAttribute('data-product-id');
    //         let prodDiv = event.currentTarget;
    //         console.log(productId);
    //         prodDiv.classList.toggle("loading", true);
    //         await delay(1000);
    //         prodDiv.classList.toggle("loading", false);
    //         prodDiv.remove();
    //         removeCartProduct(prodDiv);
    //         console.log("removed");
    //     })
    // })
});

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// let removeBtns = document.querySelectorAll(".delete-icon");
// removeBtns.forEach((btn)=>{
//     btn.addEventListener("click", cb);
// })
