import { useEffect, useState } from "react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  isVisible: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "info",
  isVisible,
  onClose,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsFadingOut(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleClick = () => {
      setIsFadingOut(true);
      // アニメーション完了後に非表示にする
      setTimeout(() => {
        onClose();
      }, 300);
    };

    if (isVisible) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`alert alert-${type} fixed top-5 left-20 right-20 p-4 z-50 flex justify-center bg-opacity-30 w-[calc(100%-160px)] animate-fade-in ${
        isFadingOut ? "animate-fade-out" : ""
      }`}
      style={{ backgroundColor: "rgba(0, 169, 104, 0.7)" }}
    >
      <div className="text-white text-lg font-bold">{message}</div>
    </div>
  );
};

export default Alert;
