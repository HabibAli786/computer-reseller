#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

/* Import Routes */
const cartRoute = require('./modules/cart_service/routes/cart_route')
const authRoute = require('./modules/auth_service/routes/auth_route')
const catologueRoute = require('./modules/catologue_service/routes/catologue_route')
const adminRoute = require('./modules/admin_service/routes/admin_route')

/* IMPORT CUSTOM MODULES */
const Catologue = require('./modules/catologue_service/catologue')
const Cart = require('./modules/cart_service/cart')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views('./modules',{extension: 'handlebars'},{map: {handlebars: 'handlebars'}}))

/* ROUTES MIDDLEWARE */
router.use(cartRoute)
router.use(authRoute)
router.use(catologueRoute)
router.use(adminRoute)

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const catologuedb = './modules/catologue_service/catologue.db'
const cartdb = './modules/cart_service/cart.db'

router.get('/', async ctx => {
	try {
		const catologue = await new Catologue(catologuedb)
		const data = await catologue.getItems()
		await ctx.render('catologue_service/views/home', {computers: data})
	} catch(err) {
		await ctx.render('catologue_service/views/error', {message: err.message})
	}
})

/**
 * script to logout user
 *
 * @name Logout script
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	const cart = await new Cart(cartdb)
	await cart.deleteItems()
	ctx.session.authorised = null
	ctx.session.admin = null
	ctx.redirect('/?msg=you are now logged out')
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
