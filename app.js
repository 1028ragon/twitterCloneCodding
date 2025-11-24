// 필요한 모듈들 불러오기
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path'); // 경로 관련 
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv'); // .env 로드
const passport = require('passport'); // 로그인, 인증 관련 라이브러리

dotenv.config(); // .env 파일 내용을 prosess.env에 넣어둠

// 라우터 및 기타 모듈 불러오기
const pageRouter = require('./routes/page'); // 페이지 이동 관련 라우터
const authRouter = require('./routes/auth'); // 로그인, 회원가입 등 인증 라우터
const { sequelize } = require('./models'); // sequelize 연결
const passportConfig = require('./passport');

const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001); // 서버 포트 설정
app.set('view engine', 'html'); // 템플릿 엔진 설정

// nunjucks 템플릿 엔진 연결
nunjucks.configure('views', {
  express: app,
  watch: true, // 코드 변경 시 자동으로 템플릿 재렌더링
});

//sequelize DB 연결
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

// 미들웨어 등록 영역
app.use(morgan('dev')); 
app.use(express.static(path.join(__dirname, 'public'))); // public 폴더 정적 파일 제공
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // form 데이터 파싱
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 파싱
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

// passport 초기화
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송

// 라우터 연결
app.use('/', pageRouter); // 기본 페이지 라우터
app.use('/auth', authRouter); // 인증 관련 라우터

// 404 에러 처리
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); // 다음 에러 처리 미들웨어로 전달
});

// 공통 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message; // 개발환경이 아니라면 에러 숨기기
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});