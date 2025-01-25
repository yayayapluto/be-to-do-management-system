var express = require("express");
var router = express.Router();
const { pool } = require("../database/db");
const { default: apiResponse } = require("../utils/api-response");

/* FETCH users listing. */
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM USERS");
    res
      .status(200)
      .json(apiResponse(true, "Success fetching users data!", result.rows));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, err.message));
  }
});

/* FETCH user by id */
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(`user with id:${userId}`);
    const result = await pool.query(`SELECT * FROM USERS WHERE id=${userId}`);
    res
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
    res.status(500).json(apiResponse(false, err.message));
  }
});

/* ADD new user */
router.post("/", async (req, res, next) => {
  try {
    console.log(`req body:`, req.body);
    const { name, email } = req.body;

    const query = `
      INSERT INTO USERS(name, email) 
      VALUES($1, $2) 
      RETURNING id, name, email, created_at, deleted_at
    `;

    const values = [name, email];

    const result = await pool.query(query, values);

    if (!result.rowCount) {
      return res
        .status(500)
        .json({ message: "Cannot insert into database, try again later" });
    }

    res
      .status(201)
      .json(apiResponse(true, "Success added new user!", result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, err.message));
  }
});

/* UPDATE user by id*/
router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    let updateQuery = "UPDATE USERS SET";

    if (req.body.name) {
      const name = req.body.name;
      console.log(`REQ BODY name:${name}`);
      updateQuery += ` name='${name}'`;
    }

    if (req.body.email) {
      const email = req.body.email;
      console.log(`REQ BODY email:${email}`);
      updateQuery += ` email='${email}'`;
    }

    updateQuery += ` WHERE id=${userId} RETURNING id, name, email, created_at, deleted_at`;

    const result = await pool.query(updateQuery);

    if (!result) {
      res.json("cannot update into database, try again later");
    }

    res
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
    res.status(500).json(apiResponse(false, err.message));
  }
});

/* DELETE user by id */
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deleteQuery = "DELETE FROM USERS WHERE id=$1";
    const result = await pool.query(deleteQuery, [userId]);
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
    res.status(500).json(apiResponse(false, err.message));
  }
});

module.exports = router;
