import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    const div = document.createElement("div");
    div.setAttribute("data-portal-container", "");
    document.body.appendChild(div);
    setPortalContainer(div);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  return portalContainer ? createPortal(children, portalContainer) : null;
};

export default Portal;
