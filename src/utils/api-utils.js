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
    results = await fetch(urlWithQueryString, options);
    results = await results.json();
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server")
  }
  if(results.error){
    throw new ApiFetchException("Error while fetching data from server",results)
  }
  return results;
}

