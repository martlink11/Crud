const mokapiUrl = `https://63651969046eddf1bae51995.mockapi.io/users`
let users = {};

const  getJSONData = async (url) => {
    let result = {};
    try{
      
      const response = await fetch(url);
  
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

document.addEventListener("DOMContentLoaded", async () => {

    const resultObj = await getJSONData(mokapiUrl)
    if (resultObj.status === "ok"){
        users = resultObj;
        console.log(users);  
    }

});

 