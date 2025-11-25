const passport = require('passport');
const local = require('./localStrategy'); // 로컬 로그인 (이메일/비밀번호)
const kakao = require('./kakaoStrategy'); // 카카오 로그인 전략
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 로그인 성공 -> 세션에 user.id 저장
  });
  // serializeUser에서 저장한 id로 DB에서 사용자 정보를 다시 조회함
  // 세션에 저장된 id를 실제 사용자 정보로 복원하는 과정
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then(user => done(null, user)) // 조회된 user 객체를 req.user에 넣어줌
      .catch(err => done(err));
  });

  local(); // localStrategy.js 안의 LocalStrategy 설정 실행
  kakao(); // kakaoStrategy.js(아직 안만들음) 안의 KakaoStrategy 설정 실행
};