require('dotenv').config();  //load .env
const {ShoppingCart} = require('../../api/_lib/shopping-cart');
const assert = require('assert');
const {v4} = require('uuid');



describe('ShoppingCart', function () {
    describe('#getCart()', function () {
        it('should return empty cart if nothing was added yet', async ()=> {
            let shoppingCart = new ShoppingCart(v4());
            let cart = await shoppingCart.getCart();
            assert.notEqual(cart,undefined);
            assert.equal(cart.totalPrice,0)
        });
    });
    describe('#addItemToCart()', function () {
        it('should add first item, store it and return items in a cart', async ()=> {
            let shoppingCart = new ShoppingCart(v4());
            let item = {text: 'sample flight details'}
            let cart = await shoppingCart.addItemToCart('flight', item, 123);
            assert.equal(cart.totalPrice,123);
            record = cart.items['flight'].item;
            assert.notEqual(record,undefined);
            assert.equal(record.text,'sample flight details')
        });

        it('should overwrite item if it was added again', async ()=> {
            let shoppingCart = new ShoppingCart(v4());
            let flight1 = {text: 'flight AAA'}
            let flight2 = {text: 'flight BBB'}
            let insurance = {text: 'insurance XYZ'}
            let cart2 = await shoppingCart.addItemToCart('flight', flight1, 1);
            assert.equal(cart2.totalPrice,1);
            record = cart2.items['flight'].item;
            assert.equal(record.text,'flight AAA')
            cart2 = await shoppingCart.addItemToCart('flight', flight2, 100);
            assert.equal(cart2.totalPrice,100);
            record = cart2.items['flight'].item;
            assert.equal(record.text,'flight BBB')

            cart2 = await shoppingCart.addItemToCart('insurance', insurance, 5);
            assert.equal(cart2.totalPrice,105);
            record = cart2.items['insurance'].item;
            assert.equal(record.text,'insurance XYZ')
        });

    });

    describe('#removeItemFromCart()', function () {
        it('should remove existing item', async ()=> {
            let shoppingCart = new ShoppingCart(v4());
            let flight = {text: 'flight AAA'}
            let insurance = {text: 'insurance XYZ'}
            let cart = await shoppingCart.addItemToCart('flight', flight, 3);
            cart = await shoppingCart.addItemToCart('insurance', insurance, 3);
            assert.equal(cart.totalPrice,6);
            assert.equal(cart.items['insurance'].item.text,'insurance XYZ');
            assert.equal(cart.items['flight'].item.text,'flight AAA');
            cart = await shoppingCart.removeItemFromCart('insurance');
            assert.equal(cart.totalPrice,3);
            assert.equal(cart.items['flight'].item.text,'flight AAA');
            assert.equal(cart.items['insurance'],undefined);

        });

    });
    describe('#getItemFromCart()', function () {
        it('should return existing item from cart', async ()=> {
            let shoppingCart = new ShoppingCart(v4());
            let flight = {text: 'flight AAA'};
            let cart = await shoppingCart.addItemToCart('flight', flight, 3);
            let item = await shoppingCart.getItemFromCart('flight');
            assert.deepEqual(item,flight);
        });
        it('should return null if item does not exist', async ()=> {
            let shoppingCart = new ShoppingCart(v4());
            let item = await shoppingCart.getItemFromCart('flight');
            assert.equal(item,null);
        });

    });
});

