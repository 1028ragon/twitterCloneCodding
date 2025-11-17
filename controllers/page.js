/* 컨트롤러: renderProfile,	renderJoin,	renderMain
 rMain과	같이	라우터	마지막에	위치해	클라이언트에	응답을	보내는	미들웨어 */

exports.renderProfile = (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
};

exports.renderJoin = (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
};

exports.renderMain = (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: 'NodeBird',
    twits: [],
  });
};

// 라우터 -호출-> 컨트롤러 -호출-> 서비스
// 컨트롤러 : 요청과 응답이 뭔지 알음
// 서비스 : 요청과 응답을 모름