import { showNotification } from "@mantine/notifications";

/**
 * Displays a notification with a specified message and style based on the condition.
 *
 * @param {string} condition - "success" | "error" | "warning" | "notify"
 * @param {string} message - Notification message
 */
const showNotify = (condition: string, message: string) => {
  showNotification({
    autoClose: 5000,
    message,
    color:
      condition === "success"
        ? "green"
        : condition === "error"
          ? "red"
          : condition === "warning"
            ? "yellow"
            : condition === "notify"
              ? "blue"
              : "",
    style: {
      backgroundColor: "black",
      height: "60px",
      color: "white",
      border: "1px solid #333",
      borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
    },
    loading: false,
  });
};

export default showNotify;
