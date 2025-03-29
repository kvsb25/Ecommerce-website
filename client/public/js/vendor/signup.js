axios.defaults.baseURL="http://localhost:3000";
document.getElementById("signup-form").addEventListener("submit", function(event){
    event.preventDefault();
    let formData = new FormData(event.target);
    // console.log(formData.get("username"), formData.get("password"));
    console.log({...Object.fromEntries(formData.entries()), "role": "vendor"});
    // axios.post("/user/signup", Object.fromEntries(formData.entries()), {withCredentials: true})
    // .then((response) => {
    //     response.status === 200 ? window.location.href = "/" : console.log(response.data);
    // })
    // .catch((error) => {
    //     console.error(error);
    //     console.log(error.response.data);
    //     let showErrorMessage = document.querySelector(".error");
    //     if (showErrorMessage) {
    //         showErrorMessage.style.display = "flex";
    //         showErrorMessage.innerText = error.response.data;
    //     }
    // });
})