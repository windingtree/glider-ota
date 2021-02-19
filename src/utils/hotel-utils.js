
export const getLeadingHotelImageUrl = (hotel) => {
  const {media: images} = hotel;
  if(images && Array.isArray(images) && images.length > 0){
    return images[0].url;
  }
  return null;
}