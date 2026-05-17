export const fetchWithSignal = async (url, controllerRef, showMessageSetter) => {
  const timeoutDelay = 5000;

  if (controllerRef.current) {
    controllerRef.current.abort();
  }

  const newController = new AbortController();
  controllerRef.current = newController;
  const timer = setTimeout(() => showMessageSetter(true), timeoutDelay);

  try {
    const response = await fetch(url, {
      signal: newController.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Fetch request was aborted.");
      throw err;
    }
    console.log("Fetch error:", err);
    throw err;
  } finally {
    clearTimeout(timer);
    showMessageSetter(false);
    controllerRef.current = null;
  }
};
