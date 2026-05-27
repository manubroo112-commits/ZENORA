import { Download, MonitorSmartphone, Share, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
}

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("zenora-install-dismissed") === "true");
  const [installed, setInstalled] = useState(false);

  const isIOS = useMemo(() => /iphone|ipad|ipod/i.test(navigator.userAgent), []);

  useEffect(() => {
    setInstalled(isStandalone());

    const beforeInstall = (event) => {
      event.preventDefault();
      setPromptEvent(event);
      setDismissed(false);
    };

    const appInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", appInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", appInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  const close = () => {
    localStorage.setItem("zenora-install-dismissed", "true");
    setDismissed(true);
  };

  if (installed || dismissed || (!promptEvent && !isIOS)) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        className="install-card glass"
      >
        <button className="install-close" onClick={close} aria-label="Dismiss install prompt">
          <X size={15} />
        </button>
        <div className="install-icon">
          <MonitorSmartphone size={21} />
        </div>
        <div>
          <h2>Install ZENORA</h2>
          {promptEvent ? (
            <p>Add it to your desktop or phone as a standalone app.</p>
          ) : (
            <p>On iPhone or iPad, tap Share, then Add to Home Screen.</p>
          )}
        </div>
        {promptEvent ? (
          <button className="primary-button install-action" onClick={install}>
            <Download size={17} /> Install app
          </button>
        ) : (
          <div className="ios-install-hint">
            <Share size={16} /> Share menu
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}
