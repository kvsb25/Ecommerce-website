const axios = require('axios');

const BACKEND_URL = "http://localhost:3000";

// describe("Authentication", ()=>{
//     test('User is able to sign up only once ', async ()=>{
//         const username = "user" + Math.random();
//         const password = "123456";
//         const response = await axios.post(`${BACKEND_URL}/search`, {
//             username,
//             password
//         });

//         expect(response.status).toBe(200)
//         const updatedResponse = await axios.post(`${BACKEND_URL}/signup`, {
//             username,
//             password
//         });

//         expect(updatedResponse.status).toBe(400); // backend should not allow the same user to sign up again
//     })

//     test('signup request fails if the username is empty', async ()=>{
//         const username = "user" + Math.random();
//         const password = "123456";
//         const response = await axios.post(`${BACKEND_URL}/signup`, {
//             password
//         });

//         expect(response.status).toBe(400);
//     })
// })

describe("General Platform", ()=>{
    test("User can hit the home page url", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/`);
        expect(response.status).toBe(200);
    })

    test("User can hit the search page url", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/search`);
        expect(response.status).toBe(200);

        // test if query string passed in url
        const updatedResponse = await axios.get(`${BACKEND_URL}/search?q=search`);
        expect(updatedResponse.status).toBe(200);
    })
});

describe("Customer URLs", ()=>{
    beforeAll(()=>{
        //sign up and/or login the testCustomer here
    });

    
    describe("webpage URLs only customer can hit",()=>{
        test("profile page", async ()=>{
            const response = await axios.get(`${BACKEND_URL}/customer/profile`);
            expect(response.status).toBe(200);
            expect(response.data).toBe("customer profile page");
        })

        test("profile credentials page", async ()=>{
            const response = await axios.get(`${BACKEND_URL}/customer/profile/credentials`);
            expect(response.status).toBe(200);
        })

        test("cart page", async ()=>{
            const response = await axios.get(`${BACKEND_URL}/customer/cart/view`);
            expect(response.status).toBe(200);
        })
        
        test("orders page", async ()=>{
            const response = await axios.get(`${BACKEND_URL}/customer/order`);
            expect(response.status).toBe(200);
        })
    })

    describe("APIs only customer can make request to", ()=>{
        
    })
})