const pool = require("../utils/db");
const axios = require("axios");

exports.getBoard = async (req, res) => {
  try {
    const [boards] = await pool.query(
      `select bor.idx as 'idx', users.nick as 'author', title, date(bor.crea_dt) as 'time' from crud.boards bor left join crud.users users on bor.author = users.idx and bor.del='N'`
    );
    res.status(200).json({ success: true, boards });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};

exports.getDetailBoard = async (req, res) => {
  try {
    const { idx } = req.query;
    const [value] = await pool.query(
      `select idx, content, title, date(crea_dt) as 'time' from crud.boards where del='N' and idx=?`,
      [idx]
    );
    console.log(value);
    res.status(200).json({ success: true, value });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};

exports.registBoard = async (req, res) => {
  try {
    const { title, content } = req.body;
    await pool.query(
      `insert into crud.boards(title, content, crea_dt, del) values(?,?,now(),'N')`,
      [title, content]
    );
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { idx } = req.body;
    await pool.query(`update crud.boards set del='Y' where idx=?`, [idx]);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { idx, title, content } = req.body;
    await pool.query(`update crud.boards set title=?, content=? where idx=?`, [
      title,
      content,
      idx,
    ]);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};
