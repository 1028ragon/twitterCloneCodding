const express = require('express');
// 컨트롤러 불러옴
const { renderProfile, renderJoin, renderMain } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
  // 라우터에서 공통적으로 쓰이는 변수 res.locals.로 선언
  res.locals.user = null; 
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next();
});


// 마지막 미들웨어는 컨트롤러 라고 불림
router.get('/profile', renderProfile);

router.get('/join', renderJoin);

router.get('/', renderMain);

module.exports = router;
