import React, { useEffect } from "react";
import axios from "axios";

export default function Video() {
  const hrefPage = window.location.href;
  const splitHrefPage = hrefPage.split("/");
  const id = splitHrefPage[4];
  console.log(id);

  useEffect(() => {
    const domain = "https:///yellowhealth.daily.co/";

    axios
      .get(`/video-call/${id}`)
      .then((res) => {
        if (res.status === 200) {
          const script = document.createElement("script");
          script.innerHTML = `window.DailyIframe.createFrame({
            iframeStyle: {
              position: "absolute",
              width: "100%",
              height: "100%",
              border: "0",
              zIndex: "9999"
            },
            showLeaveButton: true,
            showFullscreenButton: true,
          }).join({
            url: "${domain}${id}",
          });
          `;
          document.body.appendChild(script);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  return <div></div>;
}
