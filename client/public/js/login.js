console.log("in login.js")

axios.defaults.baseURL = 'http://localhost:3000';

document.getElementById("login-form").addEventListener("submit", function (event) {
  
  event.preventDefault();
  let formData = new FormData(event.target);

  console.log(formData.get("username"), formData.get("password"));
  
  axios.post("/user/login", Object.fromEntries(formData.entries()), { withCredentials: true })
    .then((response) => {
      response.status === 200 ? window.location.href = "/" : console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
      console.log(error.response.data);
      //show error message in user interface {error.response.data}
      let showErrorMessage = document.querySelector(".error");
      if (showErrorMessage) {
        showErrorMessage.style.display = "flex";
        // let errorMessage = document.createElement("p");
        // errorMessage.textContent = error.response.data;
        showErrorMessage.innerText = error.response.data;
        // showErrorMessage.appendChild(errorMessage);
      }
    });
});