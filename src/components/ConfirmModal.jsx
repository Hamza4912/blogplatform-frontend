function ConfirmModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "25px",
          borderRadius: "8px",
          maxWidth: "350px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <p style={{ marginBottom: "20px" }}>{message}</p>
        <button
          onClick={onConfirm}
          style={{
            backgroundColor: "#d9534f",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: "#eee",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConfirmModal;