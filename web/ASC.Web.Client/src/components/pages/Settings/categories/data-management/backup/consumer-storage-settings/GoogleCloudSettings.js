import React from "react";
import { inject, observer } from "mobx-react";
import TextInput from "@appserver/components/text-input";
import { onChangeTextInput } from "./InputsMethods";

const bucket = "bucket";
const filePath = "filePath";
class GoogleCloudSettings extends React.Component {
  static formNames = () => {
    return { bucket: "" };
  };

  constructor(props) {
    super(props);
    const {
      selectedStorage,
      setRequiredFormSettings,
      setIsThirdStorageChanged,
      isNeedFilePath,
    } = this.props;
    const filePathField = isNeedFilePath ? [filePath] : [];
    setRequiredFormSettings([bucket, ...filePathField]);
    setIsThirdStorageChanged(false);
    this.isDisabled = selectedStorage && !selectedStorage.isSet;

    this.bucketPlaceholder =
      selectedStorage && selectedStorage.properties[0].title;
  }

  onChangeText = (e) => {
    const {
      formSettings,
      setFormSettings,
      setIsThirdStorageChanged,
    } = this.props;
    const newState = onChangeTextInput(formSettings, e);
    setIsThirdStorageChanged(true);
    setFormSettings(newState);
  };
  render() {
    const {
      errorsFieldsBeforeSafe: isError,
      formSettings,
      isLoadingData,
      isLoading,
      isNeedFilePath,
      t,
    } = this.props;

    return (
      <>
        <TextInput
          name={bucket}
          className="backup_text-input"
          scale
          value={formSettings.bucket}
          hasError={isError?.bucket}
          onChange={this.onChangeText}
          isDisabled={isLoadingData || isLoading || this.isDisabled}
          placeholder={this.bucketPlaceholder || ""}
          tabIndex={1}
        />

        {isNeedFilePath && (
          <TextInput
            name="filePath"
            className="backup_text-input"
            scale
            value={formSettings.filePath}
            onChange={this.onChangeText}
            isDisabled={isLoadingData || isLoading || this.isDisabled}
            placeholder={t("Path")}
            tabIndex={2}
            hasError={isError?.filePath}
          />
        )}
      </>
    );
  }
}

export default inject(({ backup }) => {
  const {
    setFormSettings,
    setRequiredFormSettings,
    formSettings,
    errorsFieldsBeforeSafe,
    setIsThirdStorageChanged,
  } = backup;

  return {
    setFormSettings,
    setRequiredFormSettings,
    formSettings,
    errorsFieldsBeforeSafe,
    setIsThirdStorageChanged,
  };
})(observer(GoogleCloudSettings));
