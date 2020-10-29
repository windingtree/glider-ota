const {getAirportByIataCode} = require('./dictionary-data-cache');
const {createLogger} = require('./logger');
const {SENDGRID_CONFIG} = require('./config');
const logger = createLogger('email-confirmations');
const _ = require('lodash');
const parseJSON = require('date-fns/parseJSON');
const format = require('date-fns/format');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_CONFIG.SENDGRID_API_KEY);


/**
 * Send email confirmation to every passenger from the booking (use contact details from order confirmation response)
 * @param confirmation Response from /createWithOffer
 */
const sendBookingConfirmations =  async (confirmation) => {
    //generate input data for email templates (for all passengers from booking confirmation)
    logger.info('Sending email confirmations');
    let emailTemplateInputs = prepareEmailTemplateInput(confirmation);
    //send email to every passenger
    for (const data of emailTemplateInputs) {
        let {recipientEmail,recipientName} = data;
        logger.debug(`Send email confirmation to ${recipientEmail} (${recipientName}`);
        const msg = {
            to:recipientEmail,
            from: SENDGRID_CONFIG.FROM_EMAIL_ADDR,
            subject:'Booking confirmation',
            templateId: SENDGRID_CONFIG.TEMPLATE_ID,
            dynamicTemplateData: data,
            text:'Booking confirmation',
            html:'Booking confirmation'
        }
        // let msg2={"to":"tomasz.kurek@gmail.com","from":"noreply@em5199.glider.travel","subject":"Booking confirmation","templateId":"d-199fb2f410334d1296b0176e0435c4a7","dynamicTemplateData":{"recipientEmail":"tomasz.kurek@gmail.com","recipientName":" John Doe","price":{"currency":"EUR","public":"118.00","commission":0,"taxes":"0.00"},"passengers":[{"name":" John Doe","birthdate":"1999-12-12","email":"tomasz.kurek@gmail.com","contactInformation":["tomasz.kurek@gmail.com","48609111222"]}],"segments":[{"flightNumber":"LO3908","origin":"John Paul II - Balice(KRK)","destination":"Frederic Chopin(WAW)","departureDate":"5 Nov","departureTime":"13:15","arrivalDate":"5 Nov","arrivalTime":"14:10"},{"flightNumber":"LO0521","origin":"Frederic Chopin(WAW)","destination":"Ruzyne(PRG)","departureDate":"5 Nov","departureTime":"16:20","arrivalDate":"5 Nov","arrivalTime":"17:45"},{"flightNumber":"LO0522","origin":"Ruzyne(PRG)","destination":"Frederic Chopin(WAW)","departureDate":"7 Nov","departureTime":"18:20","arrivalDate":"7 Nov","arrivalTime":"19:40"},{"flightNumber":"LO3921","origin":"Frederic Chopin(WAW)","destination":"John Paul II - Balice(KRK)","departureDate":"7 Nov","departureTime":"20:40","arrivalDate":"7 Nov","arrivalTime":"21:35"}],"etickets":"","bookingReferences":"KUFJNA","totalPrice":"118.00 EUR","ancillaryPriceInfo":[]},"text":"Booking confirmation","html":"Booking confirmation"}
        await sgMail.send(msg);
        logger.debug(`#2 Email to ${recipientName} <${recipientEmail}> was sent`)
    }
}

/**
 * Each email that will be send (by sendgrid) requires input data (e.g.pax name, email address, eTicket, list of segments).
 * This data should be provided to sendgrid API as json object.
 * This function extracts data from booking confirmation and converts that to a format required by sendgrid email template.

 * @param paxID (optional) ID of passenger to whom we want to send email to (if not provided, this function will return template data for each passenger otherwise only for passenger specified with paxID)
 * @param confirmation booking confirmation (as received from /createWithOffer)
 * @returns {{bookingReferences: *, passengers: {name, email: *}[], price: *, recipientName: string, etickets: *, recipientEmail: any, segments: *}[]}
 */
const prepareEmailTemplateInput = (confirmation, paxID) => {
    const {order: {price, passengers, itinerary , options, reservationNumber}, travelDocuments} = confirmation;
    let segments, bookings, etickets;

    if(itinerary)   //itinerary is populated only for flight bookings (hotel booking will not have it)
        segments = itinerary.segments;
    if(travelDocuments) {       //same with travelDocuments
     bookings=travelDocuments.bookings;
     etickets=travelDocuments.etickets
    }

    //hotel bookings store booking confirmation in 'reservationNumber'
    if(reservationNumber){
        bookings=[reservationNumber]
    }

    let recipients = [];
    if (paxID) {
        recipients.push(passengers[paxID])
    } else {
        recipients = Object.keys(passengers).map(paxID => passengers[paxID])
    }
    let segmentInfo=[];
    if(segments) {
        //simplify segment info and enrich airport iata code with it's full name (LHR->Heathrow(LHR))
        segmentInfo=Object.keys(segments).map(key=>formatSegmentTemplate(segments[key]))
        // segmentInfo = segments.map(segment => formatSegmentTemplate(segment));
    }
    //extract passengers list that will be included in booking confirmation email
    let paxList = Object.keys(passengers).map(paxId => {
        let pax = passengers[paxId];
        return {
            name: formatSalutation(pax),
            birthdate: pax.birthdate,
            email: findEmail(pax.contactInformation),
            contactInformation: pax.contactInformation
        }
    });

    //get total price
    let totalPrice ;
    if(price){
        totalPrice = formatPrice(price.public, price.currency)
    }

    //if there were ancillaries - extract info about them also
    let ancillaryPriceInfo=[];
    if(options){
        ancillaryPriceInfo=options.map(option=>{
            let {code, name, description, price} = option;
            let {public:fare, currency} = price;
            return {
                code:code,
                name:name,
                description:description,
                price:formatPrice(fare, currency)
            }
        })
    }
    let templates = recipients.map(recipient => {
        //from list of contact info find first correct email address to be used
        let recipientEmail = findEmail(recipient.contactInformation);
        // ["Mr", "John", "Andrew", "SMITH"] --> Mr John Andrew Smith
        let recipientName = formatSalutation(recipient);


        return {
            recipientEmail: recipientEmail,
            recipientName: recipientName,
            price: price,
            passengers: paxList,
            segments: segmentInfo,
            etickets: etickets?etickets.join(', '):undefined,
            bookingReferences: bookings?bookings.join(', '):undefined,
            totalPrice: totalPrice,
            ancillaryPriceInfo:ancillaryPriceInfo
        }
    })
    return templates;
}
/**
 * From the list of contact details, find email address.
 * Example input: ["anna@smith.com","+32123456789"] should return "anna@smith.com"
 * @param contactInformation
 * @returns first valid email address (or undefined if not found)
 */
const findEmail = (contactInformation) => {
    if (!contactInformation)
        return undefined;
    return contactInformation.find(rec => rec.search(/@/) > -1)
}

const formatSegmentTemplate = (segment) => {
    let departureDateTime = parseJSON(segment.departureTime);
    let arrivalDateTime = parseJSON(segment.arrivalTime);
    return {
        flightNumber: segment.operator.flightNumber,
        origin: formatAirportName(segment.origin.iataCode),
        destination: formatAirportName(segment.destination.iataCode),
        departureDate: format(departureDateTime,'d LLL'),
        departureTime: format(departureDateTime,'HH:mm'),
        arrivalDate: format(arrivalDateTime,'d LLL'),
        arrivalTime: format(arrivalDateTime,'HH:mm'),
    }
}

const formatAirportName = (iataCode) => {
    let airportInfo = getAirportByIataCode(iataCode);
    if (airportInfo)
        return `${airportInfo.airport_name}(${iataCode})`;
    else
        return iataCode;
}

const formatSalutation = (pax) => {
    let elements = [pax.civility, ...pax.firstnames, ...pax.lastnames];
    //make sure first letter is capital (e.g. smith->Smith, SMITH->Smith)
    let salutation = elements.join(' ').split(' ').map(word => {
        return _.upperFirst(_.toLower(word))
    })
    return salutation.join(' ');
}

const formatPrice = (price, currency) => {
    return `${price} ${currency}`;
}

module.exports = {
    prepareEmailTemplateInput, findEmail, sendBookingConfirmations
}

