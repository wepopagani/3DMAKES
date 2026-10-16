import AdminUsersList from "@/components/AdminUsersList";
import { AccountShell, WorkspaceHeader } from "@/components/anteprima/accountUi";
import { useNavigate } from "react-router-dom";

const AdminClients = () => {
  const navigate = useNavigate();

  return (
    <AccountShell>
      <div className="container-custom py-8 md:py-12">
        <WorkspaceHeader
          title="Gestione clienti"
          subtitle="Visualizza e gestisci tutti i clienti registrati."
          onBack={() => navigate("/admin")}
          backLabel="Torna al pannello"
        />
        <div className="rounded-[1.75rem] border border-white/80 bg-white p-4 shadow-[0_18px_50px_-32px_rgba(26,42,74,0.55)] md:p-6 [&_button]:rounded-full">
          <AdminUsersList />
        </div>
      </div>
    </AccountShell>
  );
};

export default AdminClients;
