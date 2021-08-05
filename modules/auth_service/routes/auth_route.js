#!/usr/bin/env node

//Auth Routes File

'use strict'

/* MODULE IMPORTS */
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('../user')

const router = new Router()

/* DATABASE IMPORTS */
const dbName = './modules/auth_service/website.db'

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('auth_service/views/register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.register(body.user, body.pass, body.address)
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('auth_service/views/error', {message: err.message})
	}
})

/**
 * Displays the login page
 *
 * @name Login Page
 * @route {GET} /login
 */
router.get('/login', async ctx => {
	try {
		if(ctx.session.authorised === true) return ctx.redirect('/account')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		if(ctx.query.user) data.user = ctx.query.user
		await ctx.render('auth_service/views/login', data)
	} catch(err) {
		throw err
	}
})

/**
 * Script to authenticate user
 *
 * @name Login Script
 * @route {POST} /login
 */
router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.username = body.user
		return ctx.redirect('/account/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('auth_service/views/error', {message: err.message})
	}
})

/**
 * The user account page
 *
 * @name Account page
 * @route {GET} /account
 */
router.get('/account', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const name = ctx.session.username
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('auth_service/views/account', {username: name})
	} catch(err) {
		await ctx.render('auth_service/views/error', {message: err.message})
	}
})

module.exports = router.middleware()
