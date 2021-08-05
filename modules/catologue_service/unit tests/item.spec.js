'use strict'

const Item = require('../item')
const mock = require('mock-fs')


describe('addItem()', () => {

	test('add item to catologue', async done => {
		// ACT
		expect.assertions(1)
		const item = await new Item()
		// ARRANGE
		const items = await item.addItem('HP', 'Wag1', '778', '/computers/hello')
		// ASSERT
		expect(items).toEqual(true)
		done()
	})

	test('add item with empty name', async done => {
		expect.assertions(1)
		// ACT
		const item = await new Item()
		// ARRANGE
		await expect(item.addItem('', 922, 'best computer', '/to/no'))
		// ASSERT
			.rejects.toEqual( Error('This entry is not valid') )
		done()
	})

	test('add item with empty price', async done => {
		expect.assertions(1)
		// ACT
		const item = await new Item()
		// ARRANGE
		await expect(item.addItem('Hello', '', 'best computer', '/to/no'))
		// ASSERT
			.rejects.toEqual( Error('This entry is not valid') )
		done()
	})

	test('add item with empty desc', async done => {
		expect.assertions(1)
		// ACT
		const item = await new Item()
		// ARRANGE
		await expect(item.addItem('Hello', 233, '', '/to/no'))
		// ASSERT
			.rejects.toEqual( Error('This entry is not valid') )
		done()
	})

})

describe('addImage()', () => {
	test('add image to database', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
				'item.sql': 'INSERT INTO Products (name,description,price,path) VALUES("HP", "DUMMY", 230, "/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer1.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		const items = await item.addImage('./images/image.jpeg', 'image/jpeg', 'newimage')
		// ASSERT
		expect(items).toEqual(true)
		mock.restore()
		done()
	})

	test('add image that already exists', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products(name,description,price,path) VALUES("HP","DUMMY",230,"/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3]),
				'computer1.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer1.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		await expect(item.addImage('./images/computer1.jpeg', 'image/jpeg', 'computer1'))
		// ASSERT
			.rejects.toEqual('this file does exist')
		mock.restore()
		done()
	})

	test('request to add a not wanted image without path specified', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products(name,description,price,path) VALUES("HP","DUMMY",230,"/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3]),
				'computer1.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer1.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		const items = await item.addImage('./images/computer1.jpeg', '', 'newimage')
		// ASSERT
		expect(items).toEqual(true)
		mock.restore()
		done()
	})

	test('request to add a not wanted image without type specified', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products(name,description,price,path) VALUES("HP","DUMMY",230,"/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3]),
				'computer1.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer1.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		const items = await item.addImage('', 'image/jpeg', 'newimage')
		// ASSERT
		expect(items).toEqual(true)
		mock.restore()
		done()
	})

	test('request to add a not wanted image without name specified', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products(name,description,price,path) VALUES("HP","DUMMY",230,"/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3]),
				'computer1.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer1.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		const items = await item.addImage('./images/computer1.jpeg', 'image/jpeg', '')
		// ASSERT
		expect(items).toEqual(true)
		mock.restore()
		done()
	})
})

describe('addImagePaths()', () => {

	test('insert a valid paths for product', async done => {
		expect.assertions(1)
		// ARRANGE
		const item = await new Item()
		// ACT
		await item.addItem('Dell XPS', 12, 'DUMMY DATA')
		const items = await item.addImagePaths('computer2', 'computer2', 'computer3', 'DELL XPS 13')
		// ASSERT
		expect(items).toEqual(true)
		done()
	})

	test('insert paths without the first path specified', async done => {
		expect.assertions(1)
		// ARRANGE
		const item = await new Item()
		// ACT
		await expect(item.addImagePaths('', 'computer1-2', 'computer1-3', 'DELL XPS 13'))
		// ASSERT
			.rejects.toEqual( Error('image path 1 is not specified') )
		done()
	})

	test('insert paths without the product specified', async done => {
		expect.assertions(1)
		// ARRANGE
		const item = await new Item()
		// ACT
		await expect(item.addImagePaths('computer1-1', 'computer1-2', 'computer1-3', ''))
		// ASSERT
			.rejects.toEqual( Error('Product must be supplied') )
		done()
	})
})

describe('checkDuplicate()', () => {
	test('upload image that does not exist', async done => {
		// ARRANGE
		expect.assertions(1)
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products (name,description,price,path) VALUES("HP","DUMMY", 230, "/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer1.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		const items = await item.checkDuplicate('./images/images.jpeg')
		// ASSERT
		expect(items).toEqual(true)
		mock.restore()
		done()
	})

	test('upload image that existsS', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products (name,description,price,path) VALUES("HP", "DUMMY", 230, "/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer1.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		await expect(item.addImage('./images/computer1.jpeg', 'image/jpeg', 'computer1'))
		// ASSERT
			.rejects.toEqual('this file does exist')
		mock.restore()
		done()
	})
})

describe('formatImage()', () => {
	test('format a image with valid data', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products (name,description,price,path) VALUES("HP","DUMMY", 230, "/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3]),
				'image2.jpeg': Buffer.from([1,2,3]),
				'image3.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer4.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		const items = await item.formatImage({path: './images/image.jpeg', type: 'image/jpeg', name: 'image.jpeg'})
		// ASSERT
		expect(items).toEqual({'fileName': 'image', 'pathName': './images/image.jpeg', 'typeName': 'image/jpeg'})
		mock.restore()
		done()
	})

	test('format a image with valid data', async done => {
		expect.assertions(1)
		// ARRANGE
		mock({
			'modules/catologue_service/sql': {
				'products.sql': 'CREATE TABLE IF NOT EXISTS Products \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,price INTEGER,path TEXT);',
              	'item.sql': 'INSERT INTO Products (name,description,price,path) VALUES("HP","DUMMY", 230, "/path/to");'
			},
			'images': {
				'image.jpeg': Buffer.from([1,2,3]),
				'image2.jpeg': Buffer.from([1,2,3]),
				'image3.jpeg': Buffer.from([1,2,3])
			},
			'public/computers': {
				'computer4.jpeg': Buffer.from([1,2,3])
			}
		})
		// ACT
		const item = await new Item()
		await expect(item.formatImage())
		// ASSERT
			.rejects.toEqual( Error('Image is not defined') )
		mock.restore()
		done()
	})
})

describe('addOptionNames()', () => {

	test('add option names to database', async done => {
		expect.assertions(1)
		// ARRANGE
		const item = await new Item()
		// ACT
		const items = await item.addOptionNames('Fan', 'SoundCard', 'Fan2', 'DELL XPS')
		// ASSERT
		expect(items).toEqual(true)
		done()
	})
})

describe('addOptionPrices()', () => {

	test('add option prices to database', async done => {
		expect.assertions(1)
		// ARRANGE
		const item = await new Item()
		// ACT
		const items = await item.addOptionPrices(63, 73, 73, 'DELL XPS')
		// ASSERT
		expect(items).toEqual(true)
		done()
	})
})
