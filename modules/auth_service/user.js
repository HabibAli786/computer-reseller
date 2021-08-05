'use strict'

const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users \
				(id INTEGER PRIMARY KEY AUTOINCREMENT,user TEXT,pass TEXT, address Text);'
			await this.db.run(sql)
			return this
		})()
	}

	async register(user, pass, address) {
		try {
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			await this.checkAddress(address)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, pass, address) VALUES("${user}", "${pass}", "${address}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async checkAddress(address) {
		try {
			const validate = isNaN(address)
			if(!address) throw new Error('Address must be supplied')
			if(!validate) throw new Error('Full address must be supplied not just a number')
			return address
		} catch(err) {
			throw err
		}
	}

	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)
			sql = `SELECT pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${username}"`)
			return true
		} catch(err) {
			throw err
		}
	}
}
