/*
 * Database Schema
 * customer = {
 *   id: uuid,
 *   name: string,
 *   password: string,
 *}
 * restaurant = {
 *   id: uuid,
 *   name: string,
 *}
 * reservation = {
 *   id: uuid,
 *  date: date not null,
 * party_count: integer not null,
 * restaurant_id: uuid REFERENCES restaurants table not null,
 * customer_id: uuid REFERENCES customers table not null,
 */


const pg = require('pg')
const client = new pg.Client(
	process.env.DATABASE_URL ||
		'postgres://localhost/the_acme_reservation_planner'
)
const uuid = require('uuid')

const createTables = async () => {
	const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS customers;
    CREATE TABLE customers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL
    );
    CREATE TABLE restaurants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL
    );
    CREATE TABLE reservations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      date timestamp not null default CURRENT_TIMESTAMP,
      party_count INTEGER NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
      customer_id UUID REFERENCES customers(id) NOT NULL
    );
  `
	await client.query(SQL)
}

const createCustomer = async ({ username, password }) => {
	const id = uuid.v4()
	const SQL = 'INSERT INTO customers (id, name, password) VALUES ($1, $2, $3)'
	await client.query(SQL, [id, username, password])
	return { id, username }
}

const createRestaurant = async ({ name }) => {
	const id = uuid.v4()
	const SQL = 'INSERT INTO restaurants (id, name) VALUES ($1, $2)'
	await client.query(SQL, [id, name])
	return { id, name }
}

const fetchCustomers = async () => {
	const SQL = 'SELECT * FROM customers'
	const response = await client.query(SQL)
	return response.rows
}

const fetchRestaurants = async () => {
	const SQL = 'SELECT * FROM restaurants'
	const response = await client.query(SQL)
	return response.rows
}
const fetchReservations = async () => {
	const SQL = 'SELECT * FROM reservations'
	const response = await client.query(SQL)
	return response.rows
}

const createReservation = async ({ partyCount, restaurantId, customerId }) => {
	const id = uuid.v4()
	const SQL =
		'INSERT INTO reservations (id, party_count, restaurant_id, customer_id) VALUES ($1, $2, $3, $4) RETURNING *'
	const response = await client.query(SQL, [
		id,
		partyCount,
		restaurantId,
		customerId,
	])
	return response.rows[0]
}

const destroyReservation = async ({ id }) => {
	const SQL = 'DELETE FROM reservations WHERE id = $1'
	await client.query(SQL, [id])
	return { id }
}

module.exports = {
	client,
	createTables,
	createCustomer,
	createRestaurant,
	fetchCustomers,
	fetchRestaurants,
	fetchReservations,
	createReservation,
	destroyReservation,
}
