#!/usr/bin/env node

//Auth Routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')

/* IMPORT CUSTOM MODULES */
const Admin = require('../admin')

const router = new Router()

/* DATABASE IMPORTS */
const dbAdmin = './modules/admin_service/admin.db'

/**
 * Displays the admin login page
 *
 * @name Admin-Login Page
 * @route {GET} /admin-login
 */
router.get('/admin-login', async ctx => {
	try {
		if(ctx.session.admin === true) return ctx.redirect('/admin')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		if(ctx.query.user) data.user = ctx.query.user
		await ctx.render('admin_service/views/admin-login', data)
	} catch(err) {
		await ctx.render('admin_service/views/error', {message: err.message})
	}
})

/**
 * Script to authenticate admin
 *
 * @name Admin-login Script
 * @route {POST} /admin-login
 */
router.post('/admin-login', async ctx => {
	try {
		const body = ctx.request.body
		const admin = await new Admin(dbAdmin)
		await admin.login(body.user, body.pass)
		ctx.session.admin = true
		return ctx.redirect('/admin/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('admin_service/views/error', {message: err.message})
	}
})

/**
 * The admin account page
 *
 * @name Admin page
 * @route {GET} /admin
 */
router.get('/admin', async ctx => {
	try {
		if(ctx.session.admin !== true) return ctx.redirect('/admin-login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('admin_service/views/admin')
	} catch(err) {
		await ctx.render('admin_service/views/error', {message: err.message})
	}
})

module.exports = router.middleware()
