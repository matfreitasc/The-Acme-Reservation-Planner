/*
 * Database Schema
 * customer = {
 *   id: uuid,
 *   name: string,
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
