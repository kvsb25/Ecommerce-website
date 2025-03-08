const axios = require('axios');

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", ()=>{
    test('login - token is being sent if the user is authenticated', async ()=>{
        const res = await axios.post(`${BACKEND_URL}/user/login`, {username:"user4", password:"user1"}, {withCredentials:true});
        expect(res.status).toBe(200)
        expect(res.headers["set-cookie"]).toBeDefined();
        
        authCookie = res.headers["set-cookie"].find(c => c.startsWith("token="));
        const token = authCookie?.split(";")[0].split("=")[1];
        console.log(token);
        expect(authCookie).toBeDefined();
    });

    test('login - no token being sent if the user enters wrong credentials', async ()=>{
        const res = await axios.post(`${BACKEND_URL}/user/login`,
            {username:"wrongUser", password:"user1"}, 
            {withCredentials:true}
        )
        .then(()=>fail("Expected request to fail with status 400"))
        .catch((err)=>{
            expect(err.response.status).toBe(400);
        })
        
        const res2 = await axios.post(`${BACKEND_URL}/user/login`,
            {username:"user4", password:"wrongPass"}, 
            {withCredentials:true}
        )
        .then(()=>fail("Expected request to fail with status 400"))
        .catch((err)=>{
            expect(err.response.status).toBe(403);
        })
    });
});

// test - refresh token routes

// test - if all auth middlewares are running fine