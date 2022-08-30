import React from "react";

export default function AppDetails({ app }) {
  const {
    averageReviewScore,
    commonThemes,
    creator,
    creatorUrl,
    imageLogo,
    launchDate,
    title,
    totalReviews,
    similarApps,
  } = app;
  return (
    <div className="app-container">
      <div className="app-container--header">
        <img src={imageLogo} alt="logo" />
        <h2>{title}</h2>
      </div>
      <div className="app-container-app-details">
        <table>
          <tbody>
            <tr>
              <td>Total Reviews </td>
              <td>{totalReviews}</td>
            </tr>
            <tr>
              <td>Average Score </td>
              <td>{averageReviewScore}</td>
            </tr>
            <tr>
              <td>Created by </td>
              <td>{creator}</td>
            </tr>
            <tr>
              <td>Launched At </td>
              <td>{launchDate}</td>
            </tr>
            <tr>
              <td>Creater Website </td>
              <td>
                <a href={creatorUrl} target="_blank">
                  {creatorUrl}
                </a>
              </td>
            </tr>
            <tr>
              <td>Common Themes</td>
              <td>
                {commonThemes.map((theme, index) =>
                  index == commonThemes.length - 1 ? theme : theme + " , "
                )}
              </td>
            </tr>
            <tr>
              <td>Similar Apps</td>
              <td>
                {similarApps.map(({ link, name }) => (
                  <a href={link} target="_blank">{name}</a>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
