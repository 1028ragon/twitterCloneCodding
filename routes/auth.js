const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join); 

// POST /auth/login
router.post('/login', isNotLoggedIn, login); // 로그인 안한사람이 하는거

// GET /auth/logout
router.get('/logout', isLoggedIn, logout); // 로그인 한사람이 하는거

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
  res.redirect('/'); // 성공 시에는 /로 이동
});

module.exports = router;