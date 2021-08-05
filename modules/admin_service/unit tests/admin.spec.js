'use strict'

const Accounts = require('../../admin_service/admin')

describe('login()', () => {

	test('log in with valid credentials', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await account.register('doej', 'password')
		const valid = await account.login('doej', 'password')
		// ASSERT
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await expect( account.login('roej', 'password') )
		// ASSERT
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await account.register('doej', 'password')
		await expect( account.login('doej', 'bad') )
		// ASSERT
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		const register = await account.register('doej', 'password')
		// ASSERT
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await account.register('doej', 'password')
		await expect( account.register('doej', 'password') )
		// ASSERT
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await expect( account.register('', 'password') )
		// ASSERT
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await expect( account.register('doej', '') )
		// ASSERT
			.rejects.toEqual( Error('missing password') )
		done()
	})

})
