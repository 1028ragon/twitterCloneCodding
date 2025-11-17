const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

// process.env.COOKIE_SECRET 없음
dotenv.config(); // process.env
// process.env.COOKIE_SECRET 있음

const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001); // 포트 설정
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev')); // 로깅을 개발모드, 배포할땐 combined
app.use(express.static(path.join(__dirname, 'public'))); // 프론트에서 public폴더만 접근할수있게
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 처리
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/', pageRouter);

app.use((req, res, next) => { //404 not found 
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => { // 에러처리 미들웨어 4개 매개변수
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 배포모드가 아닐때는 에러 보여주기, 에러 로그를 서비스한테 넘김
  res.status(err.status || 500);
  res.render('error'); // views/error.html에 전송
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
