#!/usr/bin/env node

//Cart routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')

/* IMPORT CUSTOM MODULES */
const Cart = require('../cart')

const router = new Router()

const cartdb = './modules/cart_service/cart.db'

/**
 * shopping cart page
 *
 * @name Cart Page
 * @route {GET} /cart
 */
router.get('/cart', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const cart = await new Cart(cartdb)
		const list = await cart.getItem()
		await ctx.render('cart_service/views/cart', {items: list})
	} catch (err) {
		await ctx.render('catologue_service/views/error', {message: err.message})
	}
})

/**
 * The script to process items for cart
 *
 * @name Cart Script
 * @route {POST} /cart
 */
router.post('/cart', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const cart = await new Cart(cartdb)

		const item = ctx.request.body
		const op1 = ctx.request.body.option1
		const op2 = ctx.request.body.option2
		const op3 = ctx.request.body.option3

		await cart.add(item)
		await cart.addOptions(op1, op2, op3, ctx.request.body.name)
		// Function to create
		await cart.total(op1, op2, op3, ctx.request.body.price, ctx.request.body.name)

		// const items = await cart.getItem()
		// console.log(items)
		ctx.redirect('/')
	} catch (err) {
		await ctx.render('catologue_service/views/error', {message: err.message})
	}
})

router.post('/item-delete', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const name = ctx.request.body.name
		const cart = await new Cart(cartdb)
		await cart.removeItem(name)
		ctx.redirect('/cart')
	} catch (err) {
		await ctx.render('catologue_service/views/error', {message: err.message})
	}
})

module.exports = router.middleware()
