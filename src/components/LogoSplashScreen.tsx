import { useEffect } from "react";

const LogoSplashScreen = () => {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-site-intro")) return;

    let openTimer: number;
    let finishTimer: number;
    const finish = () => {
      root.removeAttribute("data-site-intro");
      try { sessionStorage.setItem("3dmakes:intro-seen", "1"); } catch { /* Storage can be disabled. */ }
      window.dispatchEvent(new Event("3dmakes:intro-complete"));
    };
    const uncover = () => {
      if (!document.querySelector("#root main")) return;
      observer.disconnect();
      // Let the mounted route paint beneath the cover before opening it.
      openTimer = window.setTimeout(() => {
        root.setAttribute("data-site-intro", "leaving");
        finishTimer = window.setTimeout(finish, 380);
      }, 120);
    };
    const observer = new MutationObserver(uncover);
    observer.observe(document.getElementById("root")!, { childList: true, subtree: true });
    uncover();

    return () => {
      observer.disconnect();
      window.clearTimeout(openTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  return null;
};

export default LogoSplashScreen;

