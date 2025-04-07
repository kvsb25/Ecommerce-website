const cart = require("../../../../server/models/cart");

document.addEventListener("DOMContentLoaded",async (event)=>{
    // const cart = await getCart();
    const cart = {
        products:[
            {
                product: "nf9q83ufy",
                qty: 1,
            },
            {
                product: "nf9q83u23",
                qty: 1,
            },
            {
                product: "nf9q83uf1",
                qty: 1,
            },
            {
                product: "nf9q83uhe",
                qty: 1,
            },
        ]
    }
    
    if(cart.error) return console.log(cart.error);
    if(cart.message) return document.querySelector(".cart-container").innerHTML = `<p>${cart.message}</p>`;

    // if(cart && cart.products.length > 0 ){
    //     const cartContainer = document.querySelector(".cart-container");
    //     const cartProducts = cart.products.map((product)=>{
    //         return `<div class="cart-product" id="${product._id}"> <!-- product component -->
    //             <div class="cart-product-preview">
    //                 <div class="cart-image"><img src="/images/product_test_image.jpg" alt="prodImg"></div>
    //                 <div class="cart-details">
    //                     <div class="cart-prod-details">
    //                         <div>
    //                             <li>${product.name}</li>
    //                             <li>${product.price}</li>
    //                             <li>Rating</li>
    //                         </div>
    //                         <hr>
    //                     </div>
    //                     <div class="cart-quantity">
    //                         <div class="cart-quantity-select">
    //                             <div class="quantity-input">
    //                                 <span class="delete-icon">🗑</span>
    //                                 <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
    //                                 <input type="text" class="quantity-value" id="quantity" value="${product.qty}" readonly>
    //                                 <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>`
    //     }).join("");
    //     cartContainer.innerHTML = cartProducts;
    // }

    if(cart && cart.products?.length > 0 ){
        renderCart(cart.products);
    }
    
    let products = document.querySelectorAll('.cart-product');
    products.forEach((product)=>{
        product.addEventListener("click", async (event)=>{
            const productId = event.currentTarget.getAttribute('data-product-id');
            const quantityInput = document.querySelector(`[data-qty-id="${productId}"]`);
            // delete product from db
            if(event.target.id == "delete-icon"){
                // show product preview loading
                // const response = await deleteProduct(productId);
                // update the .cart-product html tag
                // remove loading
            }
            // increase product qty by 1 in db
            if(event.target.id == "increase-icon"){
                updateCartfrontend(event, productId, 1, quantityInput);
            }
            // decrease product qty by 1 in db
            if(event.target.id == "decrease-icon"){
                if((parseInt(quantityInput.value) - 1) === 0) {
                    deleteCartFrontend(event, productId);
                } else {
                    updateCartfrontend(event, productId, -1, quantityInput);
                }
            }
        })
    })
});

// let removeBtns = document.querySelectorAll(".delete-icon");
// removeBtns.forEach((btn)=>{
//     btn.addEventListener("click", cb);
// })
