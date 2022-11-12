const mokapiUsersUrl = `https://63651969046eddf1bae51995.mockapi.io/users/`

const resultsList = document.getElementById("results");
const searchInput = document.getElementById("inputGet1Id");
const searchBtn = document.getElementById("btnGet1");

const modifyBtn = document.getElementById("btnPut");
const modifyInput = document.getElementById("inputPutId");
const modalInputName = document.getElementById("inputPutNombre");
const modalInputLastname = document.getElementById("inputPutApellido");
const closeModal = document.getElementById("close");
const buttonSave = document.getElementById("btnSendChanges");
const modal = document.getElementById("dataModal");
const modalBtn = document.getElementById("modalBtn");

const Name = document.getElementById('inputPostNombre');
const lastName = document.getElementById('inputPostApellido');
const btnPost = document.getElementById('btnPost');

const inputDelete = document.getElementById("inputDelete");
const btnDelete = document.getElementById("btnDelete");


let modifyTrue = false;
let mokapiUserUrl = "";
let users = {};

const updateUsersList = () => {

  modifyTrue = false;
  searchInput.value = "";
  searchBtn.click();

};

const triggerEnter = (input1, btn, input2) => {

  input1.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

      btn.click();

    }

  });

  if(input2 !== undefined){

    input2.addEventListener("keypress", (e) => {

      if(e.key === "Enter"){
  
        btn.click();
  
      }
  
    });

  }

};

triggerEnter(searchInput, searchBtn);
triggerEnter(Name, btnPost , lastName);
triggerEnter(modifyInput, modifyBtn);
triggerEnter(modalInputName, buttonSave, modalInputLastname);
triggerEnter(inputDelete, btnDelete);

searchInput.addEventListener("input", () => {

  if(searchInput.value < 1){
    searchInput.value = "";
  }

});

searchBtn.addEventListener("click", async () => {

    
  let searchInputValue = searchInput.value;
    
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
        modalInputName.value = name;
        modalInputLastname.value = lastname;
        modalBtn.click();
        
      }else{
        showUsersList(users);
      }       
            
    }else{

      if(modifyTrue){
        modifyInput.value = "";
        modifyBtn.disabled = true;
        modifyTrue = false;
      }

      //showUsersList("clearList");
      
      updateUsersList();
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
};

modifyBtn.addEventListener("click",  async () => {

  modifyTrue = true;
  searchBtn.click();

});

modifyInput.addEventListener("input", () => {

  if(modifyInput.value !== ""){
    modifyBtn.disabled = false;
  }

  if(modifyInput.value <= 0){
    modifyInput.value = "";
    modifyBtn.disabled = true;
  }

});

closeModal.addEventListener("click", () => {

  modifyTrue = false;
  modifyInput.value = "";
  modifyBtn.disabled = true;

});

buttonSave.addEventListener("click", async () => {

  let newUserData = {};

  if (modalInputName.value !== users.name){
    newUserData.name = modalInputName.value;
  }

  if(modalInputLastname.value !== users.lastname){
    newUserData.lastname = modalInputLastname.value;
  }

  const resultObj = await getJSONData(mokapiUserUrl, 'PUT', newUserData);
  if (resultObj.status === "ok"){
    updateUsersList();
    closeModal.click();
    buttonSave.disabled = true;
  }
 
});

modalInputName.addEventListener("input", ()=>{

  if(modalInputName.value !== users.name){
    buttonSave.disabled = false;
  }else{
    buttonSave.disabled = true;
  }

});

modalInputLastname.addEventListener("input", ()=>{

  if(modalInputLastname.value !== users.lastname){
    buttonSave.disabled = false;
  }else{
    buttonSave.disabled = true;
  }

});

/*-----------------------------------------------------------------------*/

lastName.addEventListener('input', ()=>{

  let lastNameValue = lastName.value;
  let nameValue = Name.value;

  if (lastNameValue != "" && nameValue != ""){
    btnPost.disabled = false;
  }else{
    btnPost.disabled = true;
  }

});

Name.addEventListener('input', ()=>{

  let lastNameValue = lastName.value;
  let nameValue = Name.value;

  if (lastNameValue != "" && nameValue != ""){
    btnPost.disabled = false;
  }else{
    btnPost.disabled = true;
  }

});

btnPost.addEventListener('click', async ()=>{
  let NewUser = {};
  let lastNameValue = lastName.value;
  let nameValue = Name.value;

  NewUser.name = nameValue
  NewUser.lastname = lastNameValue

  const resultObj = await getJSONData(mokapiUsersUrl, 'POST', NewUser)
  if (resultObj.status === "ok") {
    Name.value = "";
    lastName.value = "";
    updateUsersList();
    btnPost.disabled = true;
  } else {
    showErrorAlert();
  }

});

/*---------------------------------------------------------------------------*/

inputDelete.addEventListener("input", () =>{

  if (inputDelete.value > 0 ){

    btnDelete.disabled = false;

  }else{

    inputDelete.value = "";
    btnDelete.disabled = true;

  }
})

btnDelete.addEventListener("click", async ()=>{

  mokapiUserUrl = `${mokapiUsersUrl}${inputDelete.value}`;

  const resultObj = await getJSONData(mokapiUserUrl, "DELETE");

  if (resultObj.status === "ok"){

    inputDelete.value = "";
    updateUsersList();
    btnDelete.disabled = true;

  }else{

    showErrorAlert();

  }

});