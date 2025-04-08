const product_component = (product)=>{
    const element = 
      `<div class="cart-product" data-product-id=${product.product._id}> <!-- product component -->
            <div class="cart-product-preview">
                <div class="cart-image"><img src="/images/product_test_image.jpg" alt="prodImg"></div>
                <div class="cart-details">
                    <div class="cart-prod-details">
                        <div>
                            <li id="product-name">${product.product.name}</li>
                            <li id="product-price">${product.product.price}</li>
                            <li id="product-rating">Rating</li>
                        </div>
                        <hr>
                    </div>
                    <div class="cart-quantity">
                        <div class="cart-quantity-select">
                            <div class="quantity-input">
                                <span class="delete-icon" id="delete-icon">🗑</span>
                                <button class="quantity-btn" id="increase-icon">-</button>
                                <input type="text" class="quantity-value" data-qty-id=${product.product._id} value="${product.qty}" readonly>
                                <button class="quantity-btn" id="decrease-icon">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return element;
}

const checkout_component = (total, items) => {
return `<div class="cart-checkout">
            <div class="cart-buy-box">
                <div class="cart-buy-amount">
                    <span class="amount-text1">&#8377;</span>
                    <span class="amount-amount">${total}</span>
                    <span class="amount-text2">Total</span>
                </div>
                <div class="checkout-details">
                    <span class="details-text">${items} items</span>
                </div>
                <div class="show-buy-now cart-buy-interactives">
                    <div>
                        <button id="move-to-checkout" class="buy-now">Check out</button>
                    </div>
                </div>
            </div>
        </div>`;
}

const stringToElement = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

const renderCart = (products) => {
    const cartContainer = document.querySelector('.cart-customer-product');
    cartContainer.innerHTML = '';

    products.forEach(product => {
        const productHTML = product_component(product);
        const productElement = stringToElement(productHTML);
        cartContainer.appendChild(productElement);
        total += product.product.price * product.qty;
    });

    // const total = products.reduce((total, product) => (product.price * product.qty) + total, 0);
    const checkoutHTML = checkout_component(total, products.length);
    const checkoutElement = stringToElement(checkoutHTML);
    document.querySelector('.checkout-container').appendChild(checkoutElement);
}

// class components{
//     constructor(products) {
//         this.products = products;
//         this.total = products.reduce((total,product) => (product.price * product.qty) + total, 0);
//         this.items = products.length;
//     }

//     product_component(product){
//         const element = 
//           `<div class="cart-product" id="${product._id}"> <!-- product component -->
//                 <div class="cart-product-preview">
//                     <div class="cart-image"><img src="/images/product_test_image.jpg" alt="prodImg"></div>
//                     <div class="cart-details">
//                         <div class="cart-prod-details">
//                             <div>
//                                 <li>${product.name}</li>
//                                 <li>${product.price}</li>
//                                 <li>Rating</li>
//                             </div>
//                             <hr>
//                         </div>
//                         <div class="cart-quantity">
//                             <div class="cart-quantity-select">
//                                 <div class="quantity-input">
//                                     <span class="delete-icon">🗑</span>
//                                     <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
//                                     <input type="text" class="quantity-value" id="quantity" value="${product.qty}" readonly>
//                                     <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>`;
//         return element;
//     }

//     checkout_component () {
//         return `<div class="cart-checkout">
//                     <div class="cart-buy-box">
//                         <div class="cart-buy-amount">
//                             <span class="amount-text1">&#8377;</span>
//                             <span class="amount-amount">${this.total}</span>
//                             <span class="amount-text2">Total</span>
//                         </div>
//                         <div class="checkout-details">
//                             <span class="details-text">${this.items} items</span>
//                         </div>
//                         <div class="show-buy-now cart-buy-interactives">
//                             <div>
//                                 <button id="move-to-checkout" class="buy-now">Check out</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>`;
//     }
// }