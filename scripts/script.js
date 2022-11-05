const mokapiUsersUrl = `https://63651969046eddf1bae51995.mockapi.io/users/`

const resultsList = document.getElementById("results");
const searchInput = document.getElementById("inputGet1Id");
const searchBtn = document.getElementById("btnGet1");

searchInput.addEventListener("input", () => {

    if(searchInput.value < 1){
        searchInput.value = "";
    }

});

searchBtn.addEventListener("click", async () => {

    let users = {};

    let searchInputValue = searchInput.value;

    if(searchInputValue > 0){

        let mokapiUserUrl = `${mokapiUsersUrl}${searchInputValue}`;

        const resultObj = await getJSONData(mokapiUserUrl, 'GET');
        if (resultObj.status === "ok"){
            users = resultObj;
            
            showUsersList(users);
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