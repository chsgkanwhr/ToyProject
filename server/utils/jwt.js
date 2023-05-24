const jwt = require("jsonwebtoken");

// 토큰 생성
const sign = async (idx, type) => {
  return jwt.sign({ idx }, process.env.JWT_SECRET, {
    expiresIn: type === "daily" ? "7d" : "180d",
  });
};

// 토큰 인증
const verify = async (token) => {
  try {
    const decoed = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, idx: decoed.idx };
  } catch (error) {
    console.log("인증 실패");
    if (error.name === "TokenExpiredError") {
      return { valid: false, error: "expired" };
    }

    return { valid: false, error: "invalid" };
  }
};

module.exports = { sign, verify };
