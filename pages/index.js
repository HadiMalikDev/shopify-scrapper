import React from "react";
import Spinner from "../components/Spinner";

export default function Index() {
  const [apps, setApps] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [links, setLinks] = React.useState([]);
  const [link, setLink] = React.useState("");
  //Sets the largestReviews and highestAverageReviews values
  const [comparisonMap, setComparisonMap] = React.useState(() => new Map());
  const compareApps = () => {
    const map = new Map();
    map.set("largestReviews", 0);
    map.set("highestAverageReviews", 0);

    apps.forEach((app) => {
      let { totalReviews, averageReviewScore } = app;
      averageReviewScore = Number.parseFloat(averageReviewScore);
      const prevLargestScore = map.get("largestReviews");
      if (totalReviews > prevLargestScore) {
        map.set("largestReviews", totalReviews);
      }
      const prevHighestReview = map.get("highestAverageReviews");
      if (averageReviewScore > prevHighestReview) {
        map.set("highestAverageReviews", averageReviewScore);
      }
    });
    setComparisonMap(map);
  };
  const addLink = () => {
    const formatted = link.trim();
    if (links.includes(formatted)) alert("Duplicate App detected");
    else setLinks((links) => [...links, formatted]);
  };
  React.useEffect(() => compareApps(), [apps]);
  React.useEffect(() => {
    if (!link) return;
    setLink("");
    setLoading(true);
    //Get last added app
    async function getApp() {
      const result = await fetch(`/api/info?url=${links[links.length - 1]}`, {
        method: "GET",
      });
      if (result.ok) {
        const app = await result.json();
        setApps((prev) => [...prev, app]);
      } else {
        alert("Please enter a valid shopify app url");
      }
    }
    getApp()
      .then(() => {})
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [links]);

  return (
    <div className="container">
      <h1>Shopify App Comparison</h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="app-container--input">
            <input
              type="text"
              placeholder="Shopify app url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <button onClick={() => addLink()} disabled={!link}>
              Add App
            </button>
          </div>
          <div className="apps">
            {apps.length ? (
              <table>
                <thead>
                  <tr>
                    <td></td>
                    {apps.map((app, index) => (
                      <td key={`${app.imageLogo} ${index}`}>
                        <img alt="app logo" src={app.imageLogo} />
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Mapping over the apps, filling the table row by row */}
                  {Object.keys(apps[0]).map((key, index) =>
                    key == "imageLogo" || key == "creatorUrl" ? (
                      <></>
                    ) : (
                      <tr key={`${key} ${index}`}>
                        <td>{key.split(/(?=[A-Z])/).join(" ")}</td>
                        {apps.map((app, appIndex) => (
                          <td
                            key={`${appIndex} ${key} ${index}`}
                            className={`${
                              (comparisonMap.get("largestReviews") ==
                                app.totalReviews &&
                                key == "totalReviews") ||
                              (comparisonMap.get("highestAverageReviews") ===
                                Number.parseFloat(app.averageReviewScore) &&
                                key == "averageReviewScore")
                                ? "highlight"
                                : ""
                            }`}
                          >
                            {key == "creator" ? (
                              <a rel="noreferrer" target="_blank" href={app["creatorUrl"]}>
                                {app[key]}
                              </a>
                            ) : key == "similarApps" ? (
                              app[key].map((similarApp,i) => (
                                <a key={`${similarApp.link} ${i}`} rel="noreferrer" target="_blank" href={similarApp.link}>
                                  {similarApp.name}
                                </a>
                              ))
                            ) : (
                              app[key]
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </div>
  );
}
