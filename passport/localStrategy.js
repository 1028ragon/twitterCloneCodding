const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // 이메일/비밀번호로 로그인하게끔
const bcrypt = require('bcrypt'); // 해싱 라이브러리

const User = require('../models/user'); // DB의 user모델

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
  }, async (email, password, done) => {
    try {  // 1) 이메일로 가입된 유저가 있는지 DB에서 찾기
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {  // 2) 비밀번호가 일치하는지 bcrypt.compare로 체크
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          done(null, exUser); // 비번 일치
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); // 비번 틀림
        }
      } else { // 유저 자체가 존재하지 않음
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {  // DB 오류 등 예상치 못한 에러
      console.error(error);
      done(error);
    }
  }));
};