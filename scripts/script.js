const mokapiUsersUrl = `https://63651969046eddf1bae51995.mockapi.io/users/`

const resultsList = document.getElementById("results");
const searchInput = document.getElementById("inputGet1Id");
const searchBtn = document.getElementById("btnGet1");
const modifyBtn = document.getElementById("btnPut");
const modifyInput = document.getElementById("inputPutId");
const inputName = document.getElementById("inputPutNombre");
const inputLastname = document.getElementById("inputPutApellido");
let modifyTrue = false;
const buttonSave = document.getElementById("btnSendChanges");
let mokapiUserUrl = "";
let users = {};
const closeModal = document.getElementById("close");


searchInput.addEventListener("input", () => {

    if(searchInput.value < 1){
        searchInput.value = "";
    }

});

searchBtn.addEventListener("click", async () => {

    
    let searchInputValue = searchInput.value;
    //console.log(modifyTrue)
    if(searchInputValue > 0 || modifyTrue){
      if (modifyTrue){
       
        mokapiUserUrl = `${mokapiUsersUrl}${modifyInput.value}`;
      }else{
        mokapiUserUrl = `${mokapiUsersUrl}${searchInputValue}`;
      }
        const resultObj = await getJSONData(mokapiUserUrl, 'GET');
        if (resultObj.status === "ok"){
          users = resultObj;
          if(modifyTrue){
            let {name, lastname} = users;
            inputName.value = name;
            inputLastname.value = lastname;
          }else{
            showUsersList(users);
          }
              
            
        }else{
            showUsersList("clearList");
            showErrorAlert();
        }
      

    }else{
        const resultObj = await getJSONData(mokapiUsersUrl, 'GET');
        if (resultObj.status === "ok"){
            users = resultObj;
            showUsersList(users);  
        }else{
            showErrorAlert();
        }
    }
    
});

/*------------------------------------------------------------------------------------*/ 

const showErrorAlert = () => {
    document.getElementById("alert-error").classList.add("show");
    setTimeout(()=>{
        document.getElementById("alert-error").classList.remove("show");  
    }, 2500);
}

const showUsersList = (arrayObj) =>{

    let usersContent = "";
    
    if(arrayObj != "clearList"){

        if(arrayObj.length === undefined){
    
            let {id, name, lastname} = arrayObj;
    
            usersContent += `
                <li class="bg-dark text-white list-group-item">ID: ${id} <br> NAME: ${name} <br> LASTNAME: ${lastname}</li> 
            `;
    
        }else{
    
            for(let i=0; i < arrayObj.length; i++){
    
                let user = arrayObj[i];
                let {id, name, lastname} = user;
        
                usersContent += `
                    <li class="bg-dark text-white list-group-item">ID: ${id} <br> NAME: ${name} <br> LASTNAME: ${lastname}</li>
                `;
        
            }
    
        }

    }else if(arrayObj === "clearList"){
        searchInput.value = "";
    }

    resultsList.innerHTML = usersContent;
};


const  getJSONData = async (url, method = "", data = {}) => {
    let result = {};

    let config = {};

    if(method === "GET" || method === "DELETE"){
        config = {

            method: method,
            headers: {
                'Content-Type': 'application/json'    
            }

        }
    }else if(method === "POST" || method === "PUT"){
        
        config = {

            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'    
            }

        }

    }

    try{
      
      const response = await fetch(url, config);
  
      if (response.ok) {
        result = await response.json();
        result.status = "ok";
        result.response = response;
      }else{
        throw Error(response.statusText);
      }
     
    }catch(error){
      result.status = 'error';
      result.response = error;
    }
    return result;
}

modifyBtn.addEventListener("click",  async () => {
  modifyTrue = true;
  searchBtn.click();

})

modifyInput.addEventListener("input", () => {

  if(modifyInput.value !== ""){
      modifyBtn.disabled = false;
  } 
  if(modifyInput.value <= 0){
    modifyInput.value = "";
    modifyBtn.disabled = true;
  }

});




buttonSave.addEventListener("click", async () => {

  if (inputName.value !== users.name){
    users.name = inputName.value;
  }
  if(inputLastname.value !== users.lastname){
    users.lastname = inputLastname.value;
  }
  const resultObj = await getJSONData(mokapiUserUrl, 'PUT', users);
  if (resultObj.status === "ok"){
    modifyTrue = false;
    searchInput.value ="";
    searchBtn.click();
    closeModal.click();
    buttonSave.disabled = true;
  }
 
});

inputName.addEventListener("input", ()=>{
  if (inputName.value !== users.name){
    buttonSave.disabled = false;
  } else {
    buttonSave.disabled = true;
  }
});

inputLastname.addEventListener("input", ()=>{
  if(inputLastname.value !== users.lastname){
    buttonSave.disabled = false;
  }else {
    buttonSave.disabled = true;
  }
});