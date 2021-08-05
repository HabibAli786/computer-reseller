#!/usr/bin/env node

//Catologue routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

/* IMPORT CUSTOM MODULES */
const Catologue = require('../catologue')
const Item = require('../item')

const router = new Router()

const catologuedb = './modules/catologue_service/catologue.db'

/**
 * computer page
 *
 * @name Computer Page
 * @route {GET} /computer/:id
 */
router.get('/computer/:id', async ctx => {
	try {
		const computer = await new Catologue(catologuedb)
		const data = await computer.displayItem(ctx.params.id)
		await ctx.render('catologue_service/views/computer', {computer: data})
	} catch (err) {
		await ctx.render('catologue_service/views/error', {message: err.message})
	}
})

/**
 * The script to get the computer
 *
 * @name Computer Script
 * @route {POST} /computer
 */
router.post('/computer', koaBody, async ctx => {
	try {
		if(ctx.session.admin !== true) return ctx.redirect('/admin-login?msg=you need to log in')
		const body = ctx.request.body
		const item = await new Item(catologuedb)

		const image = await item.formatImage(ctx.request.files.image)
		await item.addImage(image.pathName, image.typeName, image.fileName)
		const image2 = await item.formatImage(ctx.request.files.image2)
		await item.addImage(image2.pathName, image2.typeName, image2.fileName)
		const image3 = await item.formatImage(ctx.request.files.image3)
		await item.addImage(image3.pathName, image3.typeName, image3.fileName)

		await item.addItem(body.name, body.price, body.description)
		await item.addImagePaths(image.fileName, image2.fileName, image3.fileName, body.name)

		await item.addOptionNames(body.Op1, body.Op2, body.Op3, body.name)
		await item.addOptionPrices(body.Op1Price, body.Op2Price, body.Op3Price, body.name)

		await ctx.redirect('/')
	} catch (err) {
		await ctx.render('catologue_service/views/error')
	}
})

router.post('/search', async ctx => {
	const item = ctx.request.body.item
	const computer = await new Catologue(catologuedb)
	const result = await computer.search(item)
	await ctx.render('catologue_service/views/home', {computers: result})
})

module.exports = router.middleware()
