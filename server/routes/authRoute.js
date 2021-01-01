const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");

const {
  register,
  accountActivation,
  login,
  getAccessToken,
  forgotPassword,
  resetPassword,
  getUserInfo,
  getUsersAllInfo,
  logout,
  updateUser,
  updateUsersRole,
  deleteUser,
} = require("../controllers/auth.js");

router.post("/create", register);
router.post("/login", login);
router.post("/account-activation", accountActivation);
router.post("/refresh_token", getAccessToken);
router.post("/forgot", forgotPassword);
router.post("/reset", auth, resetPassword);
router.get("/info", auth, getUserInfo);
router.get("/all_info", auth, authAdmin, getUsersAllInfo);
router.get("/logout", logout);
router.patch("/update", auth, updateUser);
router.patch("/update_role/:id", auth, authAdmin, updateUsersRole);
router.delete("/delete/:id", auth, authAdmin, deleteUser);

module.exports = router;
