"use client";

import { useEffect } from "react";

export default function ClientMetadataUpdater() {
  useEffect(() => {
    const storedPublicDomainData = localStorage.getItem("public-domain-data");

    if (storedPublicDomainData) {
      const parsedPublicDomainData = JSON.parse(storedPublicDomainData);

      const title = parsedPublicDomainData.key || null;
      const description = parsedPublicDomainData.description || null;
      const favicon = parsedPublicDomainData.iconLight || null;

      if (title) {
        document.title = title;
      }

      if (description) {
        let descriptionMeta = document.querySelector(
          "meta[name='description']"
        );

        if (!descriptionMeta) {
          descriptionMeta = document.createElement("meta");
          descriptionMeta.setAttribute("name", "description");
          document.head.appendChild(descriptionMeta);
        }
        descriptionMeta.setAttribute("content", description);
      }

      if (favicon) {
        let faviconLink = document.querySelector("link[rel='icon']");

        if (!faviconLink) {
          faviconLink = document.createElement("link");
          faviconLink.setAttribute("rel", "icon");
          document.head.appendChild(faviconLink);
        }
      }
    }
  }, []);

  return null;
}
