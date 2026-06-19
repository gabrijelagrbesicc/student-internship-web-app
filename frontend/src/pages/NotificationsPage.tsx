import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import { API_BASE, authHeaders, type Notification } from "../types";

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "upravo sada";
  if (mins < 60) return `prije ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `prije ${hours} h`;
  const days = Math.floor(hours / 24);
  return `prije ${days} ${days === 1 ? "dan" : "dana"}`;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get<Notification[]>(`${API_BASE}/api/notifications/my`, {
        headers: authHeaders(),
      });
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju obavijesti.");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE}/api/notifications/read-all`, {}, { headers: authHeaders() });
      fetchNotifications();
    } catch (error) {
      console.error(error);
      alert("Greška pri označavanju obavijesti.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unread = notifications.filter((n) => !n.procitano).length;

  return (
    <AppLayout
      title="Obavijesti"
      subtitle={
        unread > 0 ? `${unread} nepročitanih obavijesti` : "Sve obavijesti su pročitane"
      }
      actions={
        unread > 0 ? (
          <button type="button" className="btn btn-secondary btn-sm" onClick={markAllAsRead}>
            Označi sve pročitano
          </button>
        ) : undefined
      }
    >
      {loading ? (
        <p>Učitavanje...</p>
      ) : notifications.length === 0 ? (
        <div className="card">
          <p>Nema obavijesti.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item${!n.procitano ? " unread" : ""}`}
            >
              <p>{n.poruka}</p>
              <small>
                {timeAgo(n.created_at)}
                {!n.procitano && <span className="notification-new">• novo</span>}
              </small>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default NotificationsPage;
