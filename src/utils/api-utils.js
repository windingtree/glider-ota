import  {stringify}  from 'query-string';


function ApiFetchException(message,response) {
  const error = new Error(message);
  error.response=response;
  return error;
}

ApiFetchException.prototype = Object.create(Error.prototype);

export async function fetchGet(url,params){
  let queryString = stringify(params);
  let options = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  }
  let urlWithQueryString = url+'?'+queryString;
  let results;
  try {
    console.log("FETCH - before")
    results = await fetch(urlWithQueryString, options);
    console.log("FETCH - after results, before JSON - OK=", results.ok)
    results = await results.json();
    console.log("FETCH - after results, after JSON - OK=", results.ok)
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server")
  }
  console.log("FETCH - response processed OK=", results.ok)
  if(results.error){
    throw new ApiFetchException("Error while fetching data from server",results)
  }
  return results;
}

export async function fetchPost(url,payload){
  let options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
  let results;
  try {
    console.log("FETCH - before")

    results = await fetch(url, options);
    console.log("FETCH - after results, before JSON - OK=", results.ok)
    results = await results.json();
    console.log("FETCH - after results, after JSON - OK=", results.ok)
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server")
  }
  console.log("FETCH - response processed OK=", results.ok)
  if(results.error){
    throw new ApiFetchException("Error while fetching data from server",results)
  }
  return results;
}


export async function storePassengerDetails(passengers){
  return fetchPost('/api/cart/passengers',{passengers:passengers})
}

export async function retrievePassengerDetails(){
  return fetchGet('/api/cart/passengers',{})
}
