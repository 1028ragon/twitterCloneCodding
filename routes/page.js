const express = require('express');
// 컨트롤러 불러오기(각 라우트에서 실행할 함수들)
const { renderProfile, renderJoin, renderMain } = require('../controllers/page');

const router = express.Router(); 

// 모든 라우터 요청 전에 공통적으로 실행되는 미들웨어
router.use((req, res, next) => {
  // 라우터에서 공통적으로 쓰이는 변수는 res.locals.로 선언
  res.locals.user = null;  // 로그인한 사용자 정보
  res.locals.followerCount = 0; // 팔로워 수 기본값
  res.locals.followingCount = 0; // 내가 팔로잉 하는 사람 수 기본값
  res.locals.followingIdList = []; // 내가 팔로잉 하는 사람들 ID 목록
  next();
});

// 실제 요청 처리 라우터
// 마지막 미들웨어는 컨트롤러 라고 불림

// /profile 요청이 들어오면 renderProfile 컨트롤러 실행
router.get('/profile', renderProfile);

// /join 요청이 들어오면 renderJoin 컨트롤러 실행
router.get('/join', renderJoin);

// 메인 페이지 요청이 들어오면 renderMain 실행
router.get('/', renderMain);

// 라우터 내보내기 
module.exports = router;
