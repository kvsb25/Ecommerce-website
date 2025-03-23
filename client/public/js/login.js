console.log("in login.js")
axios.defaults.baseURL = 'http://localhost:3000';
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    // console.log([...formData.entries()]);
    // const json = Object.fromEntries(formData.entries());
    // send json to "/user/login"
    axios.post("/user/login", Object.fromEntries(formData.entries()))
    .then((response)=>{

    })
    console.log(formData.get("username"), formData.get("password"));
    // console.log("Username:", formData.get("username"));
  });