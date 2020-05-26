// Define the core mapping of characteristics
const seatCharacteristicMapping = {
    '1' : 'Restricted seat',
    '1A': 'Seat not allowed for infant',
    '1D': 'Restricted recline seat',
    '1W': 'Window seat without window',
    'A' : 'Aisle seat',
    'B' : 'Seat with bassinet facility',
    'E' : 'Exit Row seat',
    'W' : 'Window seat',
    'PS': 'Premium seat',
    'IE': 'Seat not suitable for child',
    'K' : 'Bulkhead seat',
    'H' : 'Seat with facilities for handicapped/incapacitated passenger',
    'I' : 'Seat suitable for adult with an infant',
    'N' : 'Middle seat', 
    'LA': 'Seat close to Lavatory',
    'GN': 'Seat close to Galley',
    'CL': 'Seat close to Closet',
}

// Convert a list of seat characteristics
export function mapSeatCharacteristicsDescription(codes) {
    return codes.reduce((acc, code) => {
        if(code in seatCharacteristicMapping) {
            acc.push(seatCharacteristicMapping[code])
        } else {
            console.warn(`Unmapped Seat Characteristic: ${code}`); 
        }
        return acc;
    },[]);
}

// FUnction to map a passenger type to a description
export const mapPassengerTypeDescription = (passengerType) => {
    switch(passengerType) {
        // Infants
        case 'INF':
            return 'Infant without Seat';
        case 'INS':
            return 'Infant'; // with seat
        
        // Childs
        case 'CHD':
            return 'Child';
        case 'UNN':
            return 'Unaccompanied Child';

        // Adults
        case 'ADT':
        default:
            return 'Adult' 
    }
}

// Function to determine if a seat is retricted for a passenger type
export function isSeatRestrictedForPassenger(codes, type) {
    // Child Restrictions
    if(['CHD', 'UNN'].includes(type)) {
        return codes.includes('IE');
    }
    
    // Infant restrictions
    else if(['INF', 'INS'].includes(type)) {
        return codes.includes('1A');
    }
    
    // Other passengers are not restricted
    else {
        return false;
    }
}