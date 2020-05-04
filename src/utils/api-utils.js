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
  console.debug('fetchGet#1 - request, URL:',url,' queryString:',queryString,' complete URL:',urlWithQueryString);
  let results;
  try {
    results = await fetch(urlWithQueryString, options);
    console.debug('fetchGet#2 - received response');
    results = await results.json();
    console.debug('fetchGet#3 - converted to JSON');
  }catch(error){
    console.error('fetchGet#3 - failure, error message:',error.message, "error code:", error.code)
    throw new ApiFetchException("Failed to retrieve data from server")
  }
  if(results.error){
    //results = {"http_status":400,"error":"INVALID_INPUT","description":"Invalid request parameter, searchquery=undefined","payload":{}}
    console.error('fetchGet#4 - error from API call', results);
    throw new ApiFetchException("Error while fetching data from server",results)
  }
  return results;
}

