const dotenv = require('dotenv').config();  //load .env
const dict = require('../../api/_lib/dictionary-data-cache');
const {TABLES} = require('../../api/_lib/dictionary-data-cache');
const assert = require('assert');

describe('dictionary-data-cache', function () {
    describe('#getTableRecordByKey()', function () {
        it('should return existing currency(GBP)', function () {
            let result = dict.getTableRecordByKey(TABLES.CURRENCIES, 'GBP');
            assert.notEqual(result, undefined);
            assert.equal(result.currency_name, 'Pound Sterling')
        });
        it('should not return existing currency (GBP) if key case(uppercase) does not match specified letter case (lowercase)', function () {
            let result = dict.getTableRecordByKey(TABLES.CURRENCIES, 'gbp');
            assert.equal(result, undefined);
        });
        it('should return undefined on non existing currency XXX', function () {
            let result = dict.getTableRecordByKey(TABLES.CURRENCIES, 'XYZ');
            assert.equal(result, undefined);
        });
    });
    describe('#findTableRecords()', function () {
        it('should find matching currencies ', function () {
            let result = dict.findTableRecords(TABLES.CURRENCIES, 'Pound', 'currency_name', 10);
            assert.ok(result.length>2);
        });
        it('should return same results using  upper or  lower case query', function () {
            let resultLowercase = dict.findTableRecords(TABLES.CURRENCIES, 'POUND', 'currency_name');
            let resultUppercase = dict.findTableRecords(TABLES.CURRENCIES, 'pound', 'currency_name');
            assert.deepEqual(resultLowercase,resultUppercase);
        });
        it('should restrict amount of results to max specified', function () {
            let result = dict.findTableRecords(TABLES.CURRENCIES, 'Pound', 'currency_name');
            let max = result.length-1;
            let result2 = dict.findTableRecords(TABLES.CURRENCIES, 'Pound', 'currency_name',max);
            assert.ok(result2.length === max);
        });
    });

    describe('#getCurrencyByCode()', function () {
        it('should return existing currency by currency code ', function () {
            let result = dict.getCurrencyByCode('PLN');
            assert.notEqual(result,undefined);
            assert.equal(result.currency_code,'PLN')
        });
        it('should return undefined if currency does not exist', function () {
            let result = dict.getCurrencyByCode('XYZ');
            assert.equal(result,undefined);
        });
    });

    describe('#getAirlineByIataCode()', function () {
        it('should return existing airline by IATA code ', function () {
            let result = dict.getAirlineByIataCode('SN');
            assert.notEqual(result,undefined);
            assert.equal(result.airline_iata_code,'SN')
            assert.equal(result.airline_name,'Brussels Airlines')
        });
    });

    describe('#getAirportByIataCode()', function () {
        it('should return existing airport by IATA code ', function () {
            let result = dict.getAirportByIataCode('JFK');
            assert.notEqual(result,undefined);
            assert.equal(result.airport_iata_code,'JFK')
        });
    });
    describe('#getCountryByCountryCode()', function () {
        it('should return existing airport by IATA code ', function () {
            let result = dict.getCountryByCountryCode('PL');
            assert.notEqual(result,undefined);
            assert.equal(result.country_code,'PL')
            assert.equal(result.country_name,'Poland')
        });
    });
    describe('#findAirport()', function () {
        it('should find an airports with matching airport name', function () {
            let result = dict.findAirport('Pulkovo');
            assert.equal(result[0].airport_name,'Pulkovo');
        });

        it('should find an airports with matching airport iata code', function () {
            let result = dict.findAirport('jfk');
            assert.equal(result[0].airport_iata_code,'JFK');
        });

        it('should find an airports with matching city name', function () {
            let result = dict.findAirport('Wroclaw');
            assert.equal(result[0].city_name,'Wroclaw');
        });

        it('should find an airports with matching city code', function () {
            let result = dict.findAirport('KRK');
            assert.equal(result[0].city_code,'KRK');
        });

    });
    describe('#findCity()', function () {
        it('should find city with matching city name', function () {
            let result = dict.findCity('krak');
            assert.equal(result[0].city_name,'Kraków');
        });
        it('should find city with partial name (narrow down search results)', function () {
            let result = dict.findCity('New');
            let result2 = dict.findCity('New ');
            let result3 = dict.findCity('New y');
            assert.ok(result.length>result2.length);
            assert.ok(result2.length>result3.length);
        });
    });
});
