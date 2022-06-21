import React from "react";
import { withTranslation } from "react-i18next";
import Button from "@appserver/components/button";
import AmazonSettings from "../../../consumer-storage-settings/AmazonSettings";
class AmazonStorage extends React.Component {
  constructor(props) {
    super(props);
    const { selectedStorage } = this.props;

    const formSettings = {};

    // this.namesArray = AmazonSettings.formNames();
    // this.namesArray.forEach((elem) => (formSettings[elem] = ""));

    for (const [key, value] of Object.entries(AmazonSettings.formNames())) {
      formSettings[key] = value;
    }

    this.requiredFields = AmazonSettings.requiredFormsName();
    console.log("formSettings", formSettings);

    this.state = {
      formSettings,
      formErrors: {},
    };

    this.isDisabled = selectedStorage && !selectedStorage.isSet;
  }

  onChangeTextInput = (event) => {
    const { formSettings } = this.state;
    const { target } = event;
    const value = target.value;
    const name = target.name;
    console.log("name", name, "value", value);
    this.setState({ formSettings: { ...formSettings, [name]: value } });
  };

  onChangeCheckbox = (e) => {
    const { formSettings } = this.state;
    const { target } = e;
    const value = target.checked;
    const name = target.name;
    this.setState({ formSettings: { ...formSettings, [name]: value } });
  };

  onSelectSSEMode = (name, nonCheckName) => {
    const { formSettings } = this.state;
    console.log("name", name, "nonCheckName", nonCheckName);
    this.setState({
      formSettings: {
        ...formSettings,
        [name]: true,
        [nonCheckName]: false,
      },
    });
  };

  onSelectAdditionalInfo = (name, value) => {
    const { formSettings } = this.state;

    this.setState({ formSettings: { ...formSettings, [name]: value } });
  };
  onMakeCopy = () => {
    const { formSettings } = this.state;
    const { onMakeCopyIntoStorage, isInvalidForm } = this.props;

    const requiredSettings = {};
    this.requiredFields.forEach(
      (el) => (requiredSettings[el] = formSettings[el])
    );

    if (formSettings.region !== "0") {
      const optional = this.requiredFields[0];
      delete requiredSettings[optional];
    }

    if (
      (formSettings.kms && formSettings.managedkeys === "0") ||
      formSettings.sse === "2" ||
      formSettings.sse === "0"
    ) {
      delete requiredSettings["customKey"];
    }
    if (formSettings.sse !== "2") {
      delete requiredSettings["clientKey"];
    }
    console.log("requiredSettings", requiredSettings);
    const isInvalid = isInvalidForm(requiredSettings);

    const hasError = isInvalid[0];
    const errors = isInvalid[1];

    if (hasError) {
      this.setState({ formErrors: errors });
      return;
    }
    let newSettings = { ...formSettings };

    if (newSettings.sse === "0") {
      delete newSettings["kms"];
      delete newSettings["s3"];
    }

    const arraySettings = Object.entries(newSettings);
    console.log("arraySettings", arraySettings);
    // onMakeCopyIntoStorage(arraySettings);
    this.setState({ formErrors: {} });
  };
  render() {
    const { formSettings, formErrors } = this.state;
    const {
      t,
      isLoadingData,
      isMaxProgress,
      selectedStorage,
      buttonSize,
    } = this.props;
    console.log("formSettings", formSettings);
    return (
      <>
        <AmazonSettings
          formSettings={formSettings}
          onChange={this.onChangeTextInput}
          onChangeCheckbox={this.onChangeCheckbox}
          onSelectAdditionalInfo={this.onSelectAdditionalInfo}
          onSelectSSEMode={this.onSelectSSEMode}
          isLoadingData={isLoadingData}
          isError={formErrors}
          selectedStorage={selectedStorage}
          t={t}
        />

        <div className="manual-backup_buttons">
          <Button
            label={t("Common:Duplicate")}
            onClick={this.onMakeCopy}
            primary
            isDisabled={!isMaxProgress || this.isDisabled}
            size={buttonSize}
          />
          {!isMaxProgress && (
            <Button
              label={t("Common:CopyOperation") + "..."}
              isDisabled={true}
              size={buttonSize}
              style={{ marginLeft: "8px" }}
            />
          )}
        </div>
      </>
    );
  }
}
export default withTranslation(["Settings", "Common"])(AmazonStorage);
