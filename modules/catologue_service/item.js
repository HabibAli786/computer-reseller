'use strict'

const sqlite = require('sqlite-async')
const fs = require('fs-extra')
const { promisify } = require('util')
const mime = require('mime-types')

const readFile = promisify(fs.readFile)

module.exports = class Item {

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


	async addItem(name, price, desc) {
		try {
			if(!name || !price || !desc) throw new Error('This entry is not valid')
			const sql = `INSERT INTO Products (Name, Description, Price) 
						VALUES("${name}", "${desc}", "${price}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async addImage(path, type, name) {
		try {
			if(!path || !type || !name) return true
			const extension = mime.extension(type)
			const filePath = `public/computers/${name}.${extension}`
			await this.checkDuplicate(filePath)
			await fs.copy(path, `public/computers/${name}.${extension}`)
			return true
		} catch(err) {
			throw err
		}
	}

	async addImagePaths(path1, path2, path3, product) {
		try {
			if(!product) throw new Error('Product must be supplied')
			if(!path1) throw new Error('image path 1 is not specified')
			const sql = `UPDATE Products SET Path="computers/${path1}", Path2="computers/${path2}", 
				Path3="computers/${path3}" WHERE name="${product}";`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async checkDuplicate(path) {
		// const check = await fs.access(path, fs.constants.F_OK)
		return new Promise((resolve, reject) => {
			fs.access(path, fs.constants.F_OK, error => {
				if (error) resolve(true)
				reject('this file does exist')
			})
		})
	}

	async formatImage(image) {
		try {
			if(!image) throw new Error('Image is not defined')
			const {path, type, name} = image
			const filename = name.split('.').slice(0, -1).join('.')
			const data = {pathName: path, typeName: type, fileName: filename }
			return data
		} catch(err) {
			throw err
		}
	}

	async addOptionNames(name1, name2, name3, product) {
		// Code goes here
		const sql = `UPDATE Products SET Option1="${name1}", Option2="${name2}", 
			Option3="${name3}" WHERE name="${product}";`
		await this.db.run(sql)
		return true
	}

	async addOptionPrices(price1, price2, price3, product) {
		// Code goes here
		const sql = `UPDATE Products SET Op1Price="${price1}", Op2Price="${price2}", 
			Op3Price="${price3}" WHERE name="${product}";`
		await this.db.run(sql)
		return true
	}
}
