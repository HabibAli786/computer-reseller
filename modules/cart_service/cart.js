'use strict'

const sqlite = require('sqlite-async')
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

module.exports = class Cart {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = await readFile('./modules/cart_service/sql/cart_tb.sql', 'utf8')
			await this.db.run(sql)
			return this
		})()
	}

	async add(item) {
		try {
			item.price = parseInt(item.price)
			if(typeof item.name !== 'string') throw new Error('name must be a string')
			if(typeof item.path !== 'string') throw new Error('path must be a string')
			let sql = `SELECT COUNT(path) as records FROM Items WHERE path="${item.path}";`
			const result = await this.db.get(sql)
			if(result.records !== 0) throw new Error('Item already added to cart')
			sql = `INSERT INTO Items(name, price, path) VALUES("${item.name}", "${item.price}", "${item.path}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async addOptions(option1, option2, option3, name) {
		if(!option1) option1 = null
		if(!option2) option2 = null
		if(!option3) option3 = null
		const sql = `UPDATE Items SET Op1Price="${option1}", Op2Price="${option2}", 
			Op3Price="${option3}" WHERE name="${name}";`
		await this.db.run(sql)
		return true
	}

	async getItem() {
		const sql = 'SELECT * FROM Items;'
		const data = await this.db.all(sql)
		return data
	}

	async deleteItems() {
		const sql = 'DELETE FROM Items;'
		const del = 'delete from sqlite_sequence where name="Items";'
		await this.db.run(del)
		const data = await this.db.all(sql)
		return data
	}

	async total(option1, option2, option3, price , name) {
		if(!option1) option1 = 0
		if(!option2) option2 = 0
		if(!option3) option3 = 0
		option1 = parseInt(option1)
		option2 = parseInt(option2)
		option3 = parseInt(option3)
		price = parseInt(price)
		const total = option1 + option2 + option3 + price
		const sql = `UPDATE Items SET Total="${total}" WHERE name="${name}";`
		await this.db.run(sql)
		return total
	}

	async removeItem(name) {
		try {
			if(!name) throw new Error('name is not defined')
			const sql = `DELETE FROM Items WHERE name="${name}";`
			const del = 'delete from sqlite_sequence where name="Items";'
			await this.db.run(del)
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

}
