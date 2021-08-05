'use strict'

const sqlite = require('sqlite-async')
const fs = require('fs-extra')
const { promisify } = require('util')


const readFile = promisify(fs.readFile)

module.exports = class Catologue {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = await readFile('./modules/catologue_service/sql/products.sql', 'utf8')
			const statement = await readFile('./modules/catologue_service/sql/item.sql', 'utf8')
			await this.db.run(sql)
			await this.db.run(statement)
			return this
		})()
	}

	async getItems() {
		const sql = 'SELECT * FROM Products;'
		const data = await this.db.all(sql)
		return data
	}

	async displayItem(id) {
		try {
			const sql = `SELECT * FROM Products WHERE id = ${id};`
			const result = await this.db.get(sql)
			if(!result) throw new Error('This item does not exist')
			return result
		} catch(err) {
			throw err
		}
	}

	async search(item) {
		try {
			if(!item) throw new Error('did not specify an item')
			const sql = `SELECT * FROM Products WHERE name LIKE '%${item}%'`
			const result = await this.db.all(sql)
			return result
		} catch(err) {
			throw err
		}
	}
}
