import AdminPanel from "@/components/AdminPanel";
import { AccountShell } from "@/components/anteprima/accountUi";

const AdminPanelPage = () => {
  return (
    <AccountShell>
      <div className="container-custom py-8 md:py-12">
        <h1 className="sr-only">Pannello amministrazione — 3DMAKES</h1>
        <AdminPanel />
      </div>
    </AccountShell>
  );
};

export default AdminPanelPage;
