const express = require("express");
const app = express();

const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { response } = require("express");

const url = "https://r6.tracker.network/profile/pc/";

//// root site
app.get("/", (req, res) => {
  res.json({ message: "this is the root endpoint goto /api/:username" });
});

//express stuff
app.get("/:name", (req, res) => {
  findBaseInfo(req.params.name).then((body) => {
    const $ = cheerio.load(body);
    //user name
    const name = $(".trn-profile-header__name > span:first-child").text();
    //profile views
    const proView = $(".trn-profile-header__name > span:nth-child(2)").text();
    //level
    const level = $(".trn-defstat__data .trn-defstat__value")
      .eq(0)
      .text()
      .trim();
    //best mmr rating
    const mmrRating = $(".trn-defstat__data .trn-defstat__value")
      .eq(1)
      .text()
      .trim();
    //rank text
    const rankText = $(".trn-defstat__value").eq(2).text().trim();
    //average seasonal mmr
    const avgMmr = $(".trn-defstat__value").eq(3).text().trim();
    //one top operator
    const topOpImage = $(".top-operators .trn-defstat__value img:nth-child(1)")
      .attr("src")
      .trim();
    //

    const info = {
      name,
      proView,
      level,
      mmrRating,
      rankText,
      avgMmr,
      topOpImage,
    };
    res.json(info);
  });
});
//
//
function findBaseInfo(searchTerm) {
  return fetch(`${url}${searchTerm}`).then((response) => response.text());
}
//
app.listen(process.env.PORT || 5000, () => {
  console.log(`server started at port ${port}`);
});
