const express = require('express');
const passport = require('passport');

// 로그인 여부를 체크하는 미들웨어
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
// 로직 처리 컨트롤러 함수
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
router.get('/kakao/callback', passport.authenticate('kakao', { // passport.authenticate('kakao') 가 카카오에서 온 데이터를 검증
  failureRedirect: '/?error=카카오로그인 실패', // 실패하면 "/?error=카카오로그인 실패" 로 이동
}), (req, res) => {
  res.redirect('/'); // 성공 시에는 /로 이동
});

module.exports = router;