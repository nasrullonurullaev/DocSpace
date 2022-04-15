import React from "react";
import { Provider as MobxProvider } from "mobx-react";
import { I18nextProvider } from "react-i18next";
import stores from "../../../store/index";
import store from "studio/store";
import SelectFolderInput from "./index";
import i18n from "./i18n";
const { auth: authStore } = store;

const SelectFolderModalWrapper = (props) => <SelectFolderInput {...props} />;

class SelectFolderInputWrapper extends React.Component {
  componentDidMount() {
    authStore.init(true);
  }

  render() {
    return (
      <MobxProvider auth={authStore} {...stores}>
        <I18nextProvider i18n={i18n}>
          <SelectFolderModalWrapper {...this.props} />
        </I18nextProvider>
      </MobxProvider>
    );
  }
}

export default SelectFolderInputWrapper;
