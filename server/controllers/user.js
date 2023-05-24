const pool = require("../utils/db");
const crypto = require("crypto");
const { sign } = require("../utils/jwt");

exports.signup = async (req, res) => {
  try {
    const { id, pwd, nick } = req.body;

    // 중복 체크
    const [check] = await pool.query(
      `select exists(select idx from crud.users where id=? and del='N') as 'check'`,
      [id]
    );
    if (check[0].check === 1) {
      res
        .status(200)
        .json({ success: true, msg: "이미 가입된 아이디 입니다." });
      return;
    }

    // 비밀번호 해시화
    const salt = crypto.randomBytes(64).toString("base64");
    const hash = crypto
      .pbkdf2Sync(pwd, salt, 10000, 64, "sha512")
      .toString("hex");

    await pool.query(
      `insert into crud.users(id, pwd, nick, crea_dt, salt) values (?,?,?,now(),?)`,
      [id, hash, nick, salt]
    );

    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};

exports.login = async (req, res) => {
  try {
    const { id, pwd } = req.body;

    const [result] = await pool.query(
      `select nick, pwd, salt from crud.users where id=? and del='N'`,
      [id]
    );

    if (result[0] === undefined) {
      res.status(200).json({
        success: true,
        msg: "아이디 또는 비밀번호가 잘못되었습니다.",
      });
      return;
    }

    const hash = crypto
      .pbkdf2Sync(pwd, String(result[0].salt), 10000, 64, "sha512")
      .toString("hex");

    if (hash !== result[0].pwd) {
      res.status(200).json({
        success: true,
        msg: "아이디 또는 비밀번호가 잘못되었습니다.",
      });
      return;
    }

    if (hash === result[0].pwd) {
      const accessToken = await sign(result[0].idx, "daily");
      const refreshToken = await sign(result[0].idx, "refresh");
      await pool.query(
        `update crud.users set refresh_token=? where id=? and del='N'`,
        [refreshToken, id]
      );
      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        nick: result[0].nick,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};
