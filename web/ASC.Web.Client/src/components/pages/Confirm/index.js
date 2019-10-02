import React, { Suspense, lazy } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Loader } from "asc-web-components";
import ConfirmRoute from "../../../helpers/confirmRoute";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

const ActivateUserForm = lazy(() => import("./sub-components/activateUser"));
const CreateUserForm = lazy(() => import("./sub-components/createUser"));
const ChangePasswordForm = lazy(() => import("./sub-components/changePassword"));
const ActivateEmailForm = lazy(() => import("./sub-components/activateEmail"));
const ChangeEmailForm = lazy(() => import("./sub-components/changeEmail"));
const ChangePhoneForm = lazy(() => import("./sub-components/changePhone"));

const Confirm = ({ match, language }) => {

  i18n.changeLanguage(language);

  //console.log("Confirm render");
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense
        fallback={<Loader className="pageLoader" type="rombs" size={40} />}
      >
        <Switch>
          <ConfirmRoute
            path={`${match.path}/LinkInvite`}
            component={CreateUserForm}
          />
          <ConfirmRoute
            path={`${match.path}/Activation`}
            component={ActivateUserForm}
          />
          <ConfirmRoute
            exact
            path={`${match.path}/EmailActivation`}
            component={ActivateEmailForm}
          />
          <ConfirmRoute
            exact
            path={`${match.path}/EmailChange`}
            component={ChangeEmailForm}
          />
          <ConfirmRoute
            exact
            path={`${match.path}/PasswordChange`}
            component={ChangePasswordForm}
          />
          <Route
            exact
            path={`${match.path}/PhoneActivation`}
            component={ChangePhoneForm}
          />
          <Redirect to={{ pathname: "/" }} />
        </Switch>
      </Suspense>
    </I18nextProvider >
  );
};

function mapStateToProps(state) {
  return {
    language: state.auth.user.cultureName || state.auth.settings.culture,
  };
}

export default connect(mapStateToProps)(Confirm);
