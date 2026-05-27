import { statusLabel } from "../types";

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`status-badge status-${status}`}>{statusLabel(status)}</span>
);

export default StatusBadge;
