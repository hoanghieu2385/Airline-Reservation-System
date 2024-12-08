// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ClerkRoutes from "./routes/ClerkRoutes";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/admin" component={AdminRoutes} />
                <Route path="/clerk" component={ClerkRoutes} />
                <Route path="/" component={ClientRoutes} />
            </Switch>
        </Router>
    );
}

export default App;
