var express = require("express");
var router = express.Router();
const { pool } = require("../database/db");
const { default: apiResponse } = require("../utils/api-response");
const {
  getAllUsers,
  getUserById,
  insertUser,
  getUserByName,
  getUserByEmail,
  updateUser,
  deleteUser,
  softDeleteUser,
} = require("../services/user-service");

/* FETCH users listing. */
router.get("/", async (req, res, next) => {
  try {
    // const result = await pool.query("SELECT * FROM USERS");
    const result = await getAllUsers();
    return res
      .status(200)
      .json(apiResponse(true, "Success fetching users data!", result.rows));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse(false, err.message));
  }
});

/* ADD new user */
router.post("/", async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res
        .status(400)
        .json(apiResponse(false, "Name field is required!"));
    }
    if (!req.body.email) {
      return res
        .status(400)
        .json(apiResponse(false, "Email field is required!"));
    }

    const { name, email } = req.body;

    const isNameExist = (await getUserByName(name)).rowCount > 0;
    const isEmailExist = (await getUserByEmail(email)).rowCount > 0;

    if (isNameExist) {
      return res.status(400).json(apiResponse(false, "Name already exist!"));
    }

    if (isEmailExist) {
      return res.status(400).json(apiResponse(false, "email already exist!"));
    }

    const result = await insertUser(name, email);

    return res
      .status(201)
      .json(apiResponse(true, "Success added new user!", result.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse(false, err.message));
  }
});

/* DELETE user by id */
router.delete("/del/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const isUserExist = (await getUserById(userId)).rowCount > 0;

    if (!isUserExist) {
      return res
        .status(404)
        .json(apiResponse(false, `Cannot find user with id:${userId}`));
    }

    const result = await deleteUser(userId);
    res
      .status(200)
      .json(
        apiResponse(
          true,
          `Success deleted user with id:${userId}!`,
          result.rows[0]
        )
      );
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse(false, err.message));
  }
});

/* FETCH user by id */
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await getUserById(userId);

    if (result.rowCount <= 0) {
      return res
        .status(404)
        .json(
          apiResponse(
            true,
            `Cannot find user with id:${userId}`,
            result.rows[0]
          )
        );
    }

    return res
      .status(200)
      .json(
        apiResponse(
          true,
          `Success fetching user with id:${userId}`,
          result.rows[0]
        )
      );
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse(false, err.message));
  }
});

/* UPDATE user by id*/
router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    let name;
    let email;

    if (req.body.name) {
      name = req.body.name;
    }

    if (req.body.email) {
      email = req.body.email;
    }

    const result = await updateUser(name, email, userId);

    return res
      .status(201)
      .json(
        apiResponse(
          true,
          `Success updated user with id:${userId}!`,
          result.rows[0]
        )
      );
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse(false, err.message));
  }
});

/* SOFT DELETE user by id */
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const isUserExist = (await getUserById(userId)).rowCount > 0;

    if (!isUserExist) {
      return res
        .status(404)
        .json(apiResponse(false, `Cannot find user with id:${userId}`));
    }

    const result = await softDeleteUser(userId);
    res
      .status(200)
      .json(
        apiResponse(
          true,
          `Success soft deleted user with id:${userId}!`,
          result.rows[0]
        )
      );
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiResponse(false, err.message));
  }
});

module.exports = router;
