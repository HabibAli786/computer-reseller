'use strict'

const Cart = require('../cart')

describe('add()', () => {

	test('insert item into db', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const item = {name: 'Acer', price: 1999, path: 'path/to/the/end'}
		// ACT
		const items = await cart.add(item)
		// ASSERT
		expect(items).toEqual(true)
		done()
	})

	test('insert wrong type name attribute item into db', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const item = {name: 848, price: 199, path: 'welcome/image'}
		// ACT
		await expect(cart.add(item))
		// ASSERT
			.rejects.toEqual( Error('name must be a string') )
		done()
	})

	test('insert wrong type path attribute into db', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const item = {name: 'Acer', price: 832, path: true}
		// ACT
		await expect(cart.add(item))
		// ASSERT
			.rejects.toEqual( Error('path must be a string') )
		done()
	})

	test('insert duplicate item', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const item = {name: 'Acer', price: 832, path: 'random/image'}
		const item2 = {name: 'Acer', price: 832, path: 'random/image'}
		// ACT
		await cart.add(item)
		await expect(cart.add(item2))
		// ASSERT
			.rejects.toEqual( Error('Item already added to cart') )
		done()
	})
})

describe('addOptions()', () => {

	test('add three option to product', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const op1 = 23
		const op2 = 23
		const op3 = 32
		// ACT
		const items = await cart.addOptions(op1, op2, op3)
		// ASSERT
		expect(items).toEqual(true)
		done()
	})

	test('add option one to product', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const op1 = 23
		const op2 = null
		const op3 = null
		// ACT
		const items = await cart.addOptions(op1, op2, op3)
		// ASSERT
		expect(items).toEqual(true)
		done()
	})

	test('add option two to product', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const op1 = null
		const op2 = 23
		const op3 = null
		// ACT
		const items = await cart.addOptions(op1, op2, op3)
		// ASSERT
		expect(items).toEqual(true)
		done()
	})

	test('add option three to product', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		const op1 = null
		const op2 = null
		const op3 = 23
		// ACT
		const items = await cart.addOptions(op1, op2, op3, 'Acer')
		// ASSERT
		expect(items).toEqual(true)
		done()
	})
})

describe('getItems()', () => {

	test('get all items from db', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		await cart.add({name: 'Acer', price: 1999, path: 'path/to/the/end'})
		await cart.addOptions(10, 20, 30, 'Acer')
		// ACT
		const items = await cart.getItem()
		// ASSERT
		expect(items).toEqual([{'Op1Price': 10, 'Op2Price': 20, 'Op3Price': 30, 'Total': null,
			'id': 1,'name': 'Acer','path': 'path/to/the/end','price': 1999,}])
		done()
	})

})

describe('total()', () => {

	test('enter a normal total cost', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		// ACT
		const items = await cart.total(20, 30, 40, 100)
		// ASSERT
		expect(items).toEqual(190)
		done()
	})

	test('enter cost without first option', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		// ACT
		const items = await cart.total(null, 10, 10, 100)
		// ASSERT
		expect(items).toEqual(120)
		done()
	})

	test('enter cost without second option', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		// ACT
		const items = await cart.total(10, null, 10, 100)
		// ASSERT
		expect(items).toEqual(120)
		done()
	})

	test('enter cost without third option', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		// ACT
		const items = await cart.total(10, 10, null, 100)
		// ASSERT
		expect(items).toEqual(120)
		done()
	})

	test('enter cost with string type price', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		// ACT
		const items = await cart.total(10, 10, null, '100')
		// ASSERT
		expect(items).toEqual(120)
		done()
	})
})


describe('deleteItems()', () => {

	test('delete all items from db', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		// ACT
		const items = await cart.deleteItems()
		// ASSERT
		expect(items).toEqual([])
		done()
	})
})

describe('removeItem()', () => {

	test('delete an item from db', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		await cart.add({name: 'Acer', price: 1999, path: 'path/to/the/end'})
		// ACT
		const items = await cart.removeItem('Acer')
		// ASSERT
		expect(items).toEqual(true)
		done()
	})

	test('delete an item from db without name', async done => {
		expect.assertions(1)
		// ARRANGE
		const cart = await new Cart()
		// ACT
		await expect(cart.removeItem())
		// ASSERT
			.rejects.toEqual( Error('name is not defined') )
		done()
	})
})
