const dotenv = require('dotenv').config();  //load .env
const {searchByExactAirportCode,searchByCityName, searchByAirportName, airportLookup} = require('../../../api/_lib/lookup-manager');
const expect = require('chai').expect;

describe('lookup-manager', function () {
    describe('#searchByExactAirportCode()', function () {
        it('should find airport by exact airport code', async ()=> {
            let result = await searchByExactAirportCode('JFK');
            expect(result).to.have.length(1);
            expect(result[0].airport_iata_code).to.equal('JFK')
        });
    });

    describe('#searchByCityName()', function () {
        it('should find by city names, case insensitive', async ()=> {
            let result = await searchByCityName('New york');
            expect(result).to.have.length(6);
            result.forEach(rec=>{
                expect(rec.city_name.toLowerCase()).to.equal('new york')
            })

            result = await searchByCityName('NEW YORK');
            expect(result).to.have.length(6);
            result.forEach(rec=>{
                expect(rec.city_name.toLowerCase()).to.equal('new york')
            })
        });

        it('should find by city names, city name should START with query (search with ^)', async ()=> {
            let result = await searchByCityName('york');
            result.forEach(rec=>{
                expect(rec.city_name.toLowerCase()).not.to.equal('new york')
            })
        });

    });

    describe('#searchByAirportName()', function () {
        it('should find by airport names, case insensitive', async () => {
            let result = await searchByAirportName('Heathrow');
            expect(result).to.have.length(1);
            result.forEach(rec => {
                expect(rec.airport_name.toLowerCase()).to.equal('heathrow')
            })
            result = await searchByAirportName('throw');
            expect(result).to.have.length(0);
        });
    });
    describe('#airportLookup()', function () {
        it('should find by airport names, case insensitive', async () => {
            let result = await airportLookup('MOSCOW');
            result.forEach(rec=>{
                console.log(rec.airport_iata_code,rec.airport_name, rec.weight);
                if(rec.metroairports){
                    rec.metroairports.forEach(metro=>{
                        console.log("\t\t",metro.airport_iata_code,metro.airport_name, metro.weight);
                    })
                }
            })
        });
    });

});
