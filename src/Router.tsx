import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Group from "./pages/Group";
import User from "./pages/User";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import NewUser from "./pages/NewUser";
import ShopSelect from "./pages/ShopSelect";
import UpdatePassword from "./pages/UpdatePassword";
import NewInvoice from "./pages/NewInvoice";
import Invoice from "./pages/Invoice";

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/check-user" exact component={NewUser} />
        <Route path="/shop-select" exact component={ShopSelect} />
        <Route path="/update-password" exact component={UpdatePassword} />
        <Route
          path="/"
          render={() => (
            <MainLayout>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/inventory" component={Inventory} />
              <Route exact path="/invoice" component={Invoice} />
              <Route exact path="/group" component={Group} />
              <Route exact path="/user" component={User} />
              <Route exact path="/shop" component={Shop} />
              <Route exact path="/invoice-section" component={NewInvoice} />
            </MainLayout>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}
