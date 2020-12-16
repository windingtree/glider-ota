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
    let response;
    let result;
    try {
      response = await fetch(urlWithQueryString, options);
    result = await response.json();
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server");
  }
  if(response.error || !response.ok){
    const message = result.message || result.description || 'Error while fetching data from server';
    throw new ApiFetchException(
      message,
      result
    );
  }
  return result;
}

export async function fetchPost(url,payload){
  let options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload),
  };
  let response;
  let result;
  try {
    response = await fetch(url, options);
    result = await response.json();
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server");
  }
  if(response.error || !response.ok){
    const message = result.message || result.description || 'Error while fetching data from server';
    throw new ApiFetchException(
      message,
      result
    );
  }
  return result;
}

export async function deleteCall(url,payload){
  let options = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload),
  };
  let response;
  let result;
  try {
    response = await fetch(url, options);
    result = await response.json();
  }catch(error){
    throw new ApiFetchException("Failed to retrieve data from server");
  }
  if(response.error || !response.ok){
    const message = result.message || result.description || 'Error while fetching data from server';
    throw new ApiFetchException(
      message,
      result
    );
  }
  return result;
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

/*
export async function retrieveSelectedOffer(){
  return fetchGet('/api/cart/offer',{});
}
*/

export async function storeSelectedAccommodation(selectedOffer){
  return fetchPost('/api/cart/accommodation',{offer:selectedOffer});
}

//server side cart
export async function storeOfferId(offerId, type){
  return fetchPost('/api/cart/cartv2',{type:type,offerId:offerId});
}
export async function retrieveCart(){
  return fetchGet('/api/cart/cartv2');
}
export async function deleteItemInCart(types){
  return deleteCall('/api/cart/cartv2', types);
}



///////////////// SEATMAP //////////////////////
export async function retrieveSeatmap() {
  return fetchGet('/api/seatmap', {});
};

export async function addSeats(selectedSeats){
  return fetchPost('/api/cart/seats', selectedSeats);
}

///////////////// GENERIC CART STORAGE //////////////////////
export async function retrieveItemFromCart(key) {
  let query={
    key:key
  }
  return fetchGet('/api/cart/cart', query);
};

export async function storeItemInCart(key,item){
  let payload = {
    key:key,
    item: item
  }
  return fetchPost('/api/cart/cart',payload );
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

/////// CRYPTO ORDER //////////
export const createCryptoOrder = (confirmedOfferId, transactionHash) => fetchPost(
  '/api/order/crypto',
  {
    confirmedOfferId,
    transactionHash
  }
);


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



///////////////// OFFER DETAILS //////////////////////
//this retrieves basic data about offerID (e.g. passengers object returned with search results)
export async function getOffer(offerId){
  return fetchGet('/api/offer/offer',{offerId:offerId});
}



///////////////// SERVER SIDE CACHE //////////////////////

export async function getCachedSearchResults(type) {
  if (type !== 'flights' && type !== 'hotels') {
    throw new Error('Invalid type');
  }
  return fetchGet('/api/cache/results', {type: type});
}
