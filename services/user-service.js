const { pool } = require("../database/db");

/* QUERY for fetch all users */
const getAllUsers = async () => {
  const query = "SELECT * FROM USERS";
  const result = await pool.query(query);
  return result;
};

/* QUERY for fetch user by id */
const getUserById = async (id) => {
  const query = "SELECT * FROM USERS WHERE id=$1";
  const result = await pool.query(query, [id]);
  return result;
};

/* QUERY for fetch user by name */
const getUserByName = async (name) => {
  const query = "SELECT * FROM USERS WHERE name=$1";
  const result = await pool.query(query, [name]);
  return result;
};

/* QUERY for fetch user by email  */
const getUserByEmail = async (email) => {
  const query = "SELECT * FROM USERS WHERE email=$1";
  const result = await pool.query(query, [email]);
  return result;
};

/* QUERY for insert user */
const insertUser = async (name, email) => {
  const query =
    "INSERT INTO USERS(name,email) VALUES($1,$2) RETURNING id, name, email, created_at, deleted_at";
  const result = await pool.query(query, [name, email]);
  return result;
};

/* QUERY for update user */
const updateUser = async (name, email, id) => {
  let query = "UPDATE USERS SET ";

  if (name) {
    query += ` name='${name}'`;
  }

  if (email) {
    query += `, email='${email}'`;
  }

  query += " WHERE id=$1 RETURNING id, name, email, created_at, deleted_at";

  const result = await pool.query(query, [id]);
  return result;
};

/* QUERY for delete user */
const deleteUser = async (id) => {
  const query = "DELETE FROM USERS WHERE id=$1";
  const result = await pool.query(query, [id]);
  return result;
};

/* QUERY for soft delete user */
const softDeleteUser = async (id) => {
  const query = "UPDATE USERS SET deleted_at=$1 WHERE id=$2 RETURNING id, name, email, created_at, deleted_at";
  const result = await pool.query(query, ["NOW()", id]);
  return result;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
  insertUser,
  updateUser,
  softDeleteUser,
  deleteUser,
};
