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