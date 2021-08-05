
'use strict'

const Accounts = require('../user')

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		const register = await account.register('doej', 'password', '198 Billing Road')
		// ASSERT
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await account.register('doej', 'password' , '198 Billing Road')
		await expect( account.register('doej', 'password', '198 Billing Road') )
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

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await account.register('doej', 'password', '198 Billing Road')
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
		await account.register('doej', 'password', '198 Billing Road')
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
		await account.register('doej', 'password', '198 Billing Road')
		await expect( account.login('doej', 'bad') )
		// ASSERT
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('checkAddress()', () => {

	test('enter a valid delivery address', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		const valid = await account.checkAddress('198 New Road')
		// ASSERT
		await expect(valid).toBe('198 New Road')
		done()
	})

	test('enter an empty delivery address', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await expect( account.checkAddress('') )
		// ASSERT
			.rejects.toEqual( Error('Address must be supplied') )
		done()
	})

	test('enter a address with just a number', async done => {
		expect.assertions(1)
		// ARRANGE
		const account = await new Accounts()
		// ACT
		await expect( account.checkAddress('198') )
		// ASSERT
			.rejects.toEqual( Error('Full address must be supplied not just a number') )
		done()
	})
})
