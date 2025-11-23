// 로그인 여부 판단

exports.isLoggedIn = (req, res, next) => { // 로그인 했는지 판단하는 미들웨어
  if (req.isAuthenticated()) { // passport 통해서 로그인 했니?
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => { // 로그인 안했는지 판단하는 미들웨어
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`); // localhost:8001?error=메세지
  }
};