import React from "react";

interface IConfirmProps {
  isOpen: boolean;
  title: string;
  body: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<IConfirmProps> = ({
  isOpen,
  title,
  body,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="py-4">{body}</p>
          <div className="modal-action">
            <button className="btn btn-secondary" onClick={onCancel}>
              キャンセル
            </button>
            <button className="btn btn-outline btn-primary" onClick={onConfirm}>
              はい
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
