// src/routes/ClientRoutes.js
import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "../pages/client/HomePage";
import PrivacyPolicy from "../pages/client/PrivacyPolicy";
import TermsAndConditions from "../pages/client/TermsAndConditions";
import ClientLayout from "../layouts/ClientLayout";

function ClientRoutes() {
    return (
        <ClientLayout>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/privacy" component={PrivacyPolicy} />
                <Route path="/terms" component={TermsAndConditions} />
            </Switch>
        </ClientLayout>
    );
}

export default ClientRoutes;
