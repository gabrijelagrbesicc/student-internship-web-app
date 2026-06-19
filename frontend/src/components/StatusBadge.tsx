import { statusLabel } from "../types";

const StatusBadge = ({ status }: { status: string }) => (
  <span className="status-badge">{statusLabel(status)}</span>
);

export default StatusBadge;
