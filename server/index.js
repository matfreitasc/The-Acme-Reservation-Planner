const express = require('express')
const app = express()
app.use(express.json())

const {
	client,
	createCustomer,
	createRestaurant,
	createReservation,
	fetchCustomers,
	fetchRestaurants,
	destroyReservation,
	createTables,
	fetchReservations,
} = require('./db')

app.get('/api/customers', async (req, res, next) => {
	try {
		res.send(await fetchCustomers())
	} catch (error) {
		next(error)
	}
})

app.get('/api/restaurants', async (req, res, next) => {
	try {
		res.send(await fetchRestaurants())
	} catch (error) {
		next(error)
	}
})
app.get('/api/reservations', async (req, res, next) => {
	try {
		res.send(await fetchReservations())
	} catch (error) {
		next(error)
	}
})

app.post('/api/restaurants', async (req, res, next) => {
	try {
		res.send(await createRestaurant(req.body))
	} catch (error) {
		next(error)
	}
})

app.post('/api/customers/:id/reservations', async (req, res, next) => {
	try {
		res.send(
			await createReservation({ ...req.body, customerId: req.params.id })
		)
	} catch (error) {
		next(error)
	}
})

app.delete(
	'/api/customers/:customer_id/reservations/:id',
	async (req, res, next) => {
		try {
			res.send(await destroyReservation(req.params))
		} catch (error) {
			next(error)
		}
	}
)

app.use((err, req, res, next) => {
	console.log(err)
	res.status(err.status || 500).send({ error: err.message ? err.message : err })
})

const init = async () => {
	const port = process.env.PORT || 3000
	await client.connect()
	console.log('connected to database')

	await createTables()
	console.log('created tables')

	const [customers1, customers2, customers3] = await Promise.all([
		createCustomer({ username: 'moe', password: 'moe' }),
		createCustomer({ username: 'larry', password: 'larry' }),
		createCustomer({ username: 'curly', password: 'curly' }),
	])
	console.log('created customers')

	const [restaurants1, restaurants2, restaurants3] = await Promise.all([
		createRestaurant({ name: 'restaurant1' }),
		createRestaurant({ name: 'restaurant2' }),
		createRestaurant({ name: 'restaurant3' }),
	])
	console.log('created restaurants')

	console.table(await fetchCustomers())
	console.log('fetching restaurants')
	console.table(await fetchRestaurants())

	const reservations = await Promise.all([
		createReservation({
			partyCount: 2,
			restaurantId: restaurants1.id,
			customerId: customers1.id,
		}),
		createReservation({
			partyCount: 3,
			restaurantId: restaurants2.id,
			customerId: customers2.id,
		}),
		createReservation({
			partyCount: 4,
			restaurantId: restaurants3.id,
			customerId: customers3.id,
		}),
	])
	console.log('Fetching reservations')
	console.table(reservations)

	app.listen(port, () => console.log(`listening on port ${port}`))
}

init()
