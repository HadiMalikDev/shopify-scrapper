const cheerio = require("cheerio");

export default async function handler(req, res) {
  let shopifyAppUrl = req.query.url || "";
  shopifyAppUrl = shopifyAppUrl.trim();
  if (!shopifyAppUrl.startsWith("https://apps.shopify.com"))
    return res.status(400).json({ error: "Enter a shopify app url" });
  try {
    const shopifyPageContent = await loadSimplePageContents(shopifyAppUrl);
    const htmlPage = cheerio.load(shopifyPageContent);
    const shopifyData = getShopifyAppContent(htmlPage);
    return res.status(200).json({ ...shopifyData });
  } catch (error) {
    return res.status(400).json({ error: "Could not enter data" });
  }
}
const loadSimplePageContents = async (shopifyAppUrl) => {
  const result = await fetch(shopifyAppUrl);
  if (result.ok) {
    return await result.text();
  }
};

const formatTotalReviews = (reviews) => {
  return parseInt(reviews.trim().split(" ")[0].replace(",", ""));
};
const formatReviewScore = (score) => {
  return score.trim().split(" ")[0];
};

//Returns {title,totalReviews,averageReviewScore,creater,createrUrl,launchDate,commonThemes,similarApps}
/**
 * @param {cheerio.CheerioAPI} htmlContents HtmlFileContents
 */
const getShopifyAppContent = (htmlContents) => {
  const title = htmlContents(".vc-app-listing-hero__heading").text();
  let totalReviews = htmlContents(
    ".ui-review-count-summary--new-app-listing-page"
  ).text();
  totalReviews = formatTotalReviews(totalReviews);
  let averageReviewScore = htmlContents(".vc-star-rating").attr("aria-label");
  averageReviewScore = formatReviewScore(averageReviewScore);
  const creator = htmlContents(".vc-app-listing-hero__by-line > a").text();
  const creatorUrl = htmlContents(".vc-app-listing-hero__by-line > a").attr(
    "data-page-url"
  );
  const launchDate = htmlContents(
    ".vc-app-listing-about-section__published-date__text"
  )
    .first()
    .text();

  const commonThemes = getCommonThemes(htmlContents);
  const similarApps = getSimilarApps(htmlContents);
  const imageLogo = htmlContents(".vc-app-listing-about-section__icon").attr(
    "src"
  );
  return {
    title,
    totalReviews,
    averageReviewScore,
    creator,
    creatorUrl,
    launchDate,
    similarApps,
    imageLogo,
  };
};
/**
 * @param {cheerio.CheerioAPI} htmlContents HtmlFileContents
 */
const getCommonThemes = (htmlContents) => {
  const commonThemesElements = htmlContents(
    `a[data-element-group="review-topic-cloud"]`
  );
  return commonThemesElements
    .map(function (i, el) {
      return htmlContents(this).text();
    })
    .toArray();
};
/**
 * @param {cheerio.CheerioAPI} htmlContents HtmlFileContents
 */
const getSimilarApps = (htmlContents) => {
  const similarAppsElements = htmlContents(
    ".vc-app-listing-similar-apps__item > .ui-app-card > a"
  );
  return similarAppsElements
    .map(function (i, el) {
      return {
        name: htmlContents(this).find("p").text(),
        link: htmlContents(this).attr("href"),
      };
    })
    .toArray();
};
