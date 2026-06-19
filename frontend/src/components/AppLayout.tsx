import { Link } from "react-router-dom";
import Navbar from "./Navbar";

type AppLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backTo?: string | false;
  actions?: React.ReactNode;
};

const AppLayout = ({ title, subtitle, children, backTo = "/dashboard", actions }: AppLayoutProps) => (
  <div className="page-wrapper">
    <Navbar />
    <div className="container page-content">
      {backTo !== false && (
        <Link to={backTo} className="back-link">
          &larr; Natrag na početnu
        </Link>
      )}
      <div className="page-header flex-between">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  </div>
);

export default AppLayout;
