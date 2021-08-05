
'use strict'

const Product = require('../catologue')
// const Item = require('../item')
// const mock = require('mock-fs')


describe('getItems()', () => {

	test('get all items from db', async done => {
		expect.assertions(1)
		// ARRANGE
		const product = await new Product()
		// ACT
		const products = await product.getItems()
		// ASSERT
		expect(products).toEqual([{'Feature1': 'Intel', 'Feature2': '8GB', 'Feature3': '2Tb SSD', 'Op1Price': 100,
			'Op2Price': 20, 'Op3Price': 30, 'Option1': 'Windows', 'Option2': 'SoundCard', 'Option3': 'Fan1',
			'Path2': null, 'Path3': null,
			'description': 'DUMMY DATA', 'id': 1, 'name': 'HP Pavilion', 'path': '/random/path/to', 'price': 230, }])
		done()
	})
})

describe('displayItem()', () => {

	test('return a item specified', async done => {
		expect.assertions(1)
		// ARRANGE
		const product = await new Product()
		// ACT
		const products = await product.displayItem(1)
		// ASSERT
		expect(products).toEqual({'Feature1': 'Intel', 'Feature2': '8GB', 'Feature3': '2Tb SSD', 'Op1Price': 100,
			'Op2Price': 20, 'Op3Price': 30, 'Option1': 'Windows', 'Option2': 'SoundCard', 'Option3': 'Fan1',
			'Path2': null, 'Path3': null,
			'description': 'DUMMY DATA', 'id': 1, 'name': 'HP Pavilion', 'path': '/random/path/to', 'price': 230, })
		done()
	})

	test('search for item that does not exit', async done => {
		expect.assertions(1)
		// ARRANGE
		const product = await new Product()
		// ACT
		await expect(product.displayItem(2))
		// ASSERT
			.rejects.toEqual( Error('This item does not exist') )
		done()
	})

})

describe('search()', () => {

	test('search for a product', async done => {
		expect.assertions(1)
		// ARRANGE
		const product = await new Product()
		// ACT
		const products = await product.search('HP Pavilion')
		// ASSERT
		expect(products).toEqual([{'Feature1': 'Intel', 'Feature2': '8GB', 'Feature3': '2Tb SSD', 'Op1Price': 100,
			'Op2Price': 20, 'Op3Price': 30, 'Option1': 'Windows', 'Option2': 'SoundCard', 'Option3': 'Fan1',
			'Path2': null, 'Path3': null,
			'description': 'DUMMY DATA', 'id': 1, 'name': 'HP Pavilion', 'path': '/random/path/to', 'price': 230, }])
		done()
	})

	test('search without specificing anything', async done => {
		expect.assertions(1)
		// ARRANGE
		const product = await new Product()
		// ACT
		await expect(product.search())
		// ASSERT
			.rejects.toEqual( Error('did not specify an item') )
		done()
	})
})
