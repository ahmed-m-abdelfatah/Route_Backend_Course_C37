const searchEmailQuery = 'SELECT userEmail FROM users WHERE userEmail = ?';
const insertUserQuery =
  'INSERT INTO users (userName, userAge, userPhone, userEmail, userPassword) VALUES (?, ?, ?, ?, ?)';
const getUserSignQuery =
  'SELECT * FROM users WHERE userEmail = ? AND userPassword = ?';
const updateUserQuery =
  'UPDATE users SET userName = ?, userAge = ?, userPhone = ?, userEmail = ?, userPassword = ? WHERE id = ?';
const searchIdQuery = 'SELECT * FROM users WHERE id = ?';

const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
const getAllUsersQuery = 'SELECT * FROM users';
const getAllUsersWithQueryParamsStartsWith = key => {
  return `SELECT * FROM users WHERE userName LIKE '${key}%'`;
};
const getAllUsersWithQueryParamsEndsWith = key => {
  return `SELECT * FROM users WHERE userName LIKE '%${key}'`;
};
const clearUsersTable = 'DELETE FROM users';
const isThereDataQuery = 'SELECT * FROM users';
const resetIdToOne = 'ALTER TABLE users AUTO_INCREMENT = 1';
const getAllUsersWithAgeBetweenQuery = (min, max) => {
  return `SELECT * FROM users WHERE userAge BETWEEN ${min} AND ${max}`;
};
const getAllUsersWithNameStartWithAAndAgeLessThan30Query = (
  nameStartWith,
  ageLessThan,
) => {
  return `SELECT * FROM users WHERE userName LIKE '${nameStartWith}%' AND userAge < ${ageLessThan}`;
};

module.exports = {
  searchEmailQuery,
  insertUserQuery,
  getUserSignQuery,
  updateUserQuery,
  searchIdQuery,
  deleteUserQuery,
  getAllUsersQuery,
  getAllUsersWithQueryParamsStartsWith,
  getAllUsersWithQueryParamsEndsWith,
  clearUsersTable,
  isThereDataQuery,
  resetIdToOne,
  getAllUsersWithAgeBetweenQuery,
  getAllUsersWithNameStartWithAAndAgeLessThan30Query,
};
