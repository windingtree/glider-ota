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
  let urlWithQueryString = url;
  if(queryString.length>0)
    urlWithQueryString+='?'+queryString;
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

export async function fetchPost(url,payload){
  let options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload),
  };
  let results;
  try {
    results = await fetch(url, options);
    results = await results.json();
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server");
  }
  if(results.error){
    throw new ApiFetchException("Error while fetching data from server",results);
  }
  return results;
}

///////////////// PASSENGERS //////////////////////

export async function storePassengerDetails(passengers){
  return fetchPost('/api/cart/passengers',{passengers:passengers});
}

export async function retrievePassengerDetails(){
  return fetchGet('/api/cart/passengers',{});
}

///////////////// SHOPPING CART //////////////////////
export async function storeSelectedOffer(selectedOffer){
  return fetchPost('/api/cart/offer',{offer:selectedOffer});
}

export async function retrieveSelectedOffer(){
  return fetchGet('/api/cart/offer',{});
}

export async function storeSelectedAccommodation(selectedOffer){
  return fetchPost('/api/cart/accommodation',{offer:selectedOffer});
}

///////////////// SEATMAP //////////////////////
export async function retrieveSeatmap() {
  return fetchGet('/api/seatmap', {});
};

export async function addSeats(selectedSeats){
  return fetchPost('/api/cart/seats', selectedSeats);
}

///////////////// REPRICE //////////////////////

export async function repriceShoppingCartContents(){
  return fetchPost('/api/cart/reprice',{});
}

///////////////// CHECKOUT //////////////////////
export async function createPaymentIntent(confirmedOfferId,type){
  return fetchPost('/api/order/checkout',{type:type,confirmedOfferId:confirmedOfferId});
}

export async function getStripePublicKey() {
  return fetchPost('/api/order/key', {});
}


///////////////// ORDER CONFIRMATION //////////////////////
export async function getOrderStatus(confirmedOfferId){
  return fetchPost('/api/order/status',{offerId:confirmedOfferId});
}



export function executionTimeCheck(taskName, callback) {
  let start = Date.now();
  try {
    callback()
  } finally {
    let end = Date.now();
    console.log(`Task:${taskName}, Execution time:${end - start}ms`);
  }
}
