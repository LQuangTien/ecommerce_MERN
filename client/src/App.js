import logo from "./logo.svg";
import "./App.css";
import HomePage from "./containers/HomePage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProductPage from "./containers/ProductsPage";
import Layout from "./components/Layout";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/:slug" component={ProductPage} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
