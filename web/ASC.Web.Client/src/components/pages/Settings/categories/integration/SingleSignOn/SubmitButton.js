import React from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import Box from "@appserver/components/box";
import Button from "@appserver/components/button";

import ResetConfirmationModal from "./sub-components/ResetConfirmationModal";

const SubmitResetButtons = (props) => {
  const { t } = useTranslation(["SingleSignOn", "Settings", "Common"]);
  const {
    onSubmit,
    isSsoEnabled,
    openResetModal,
    resetForm,
    confirmationResetModal,
    isSubmitLoading,
    hasErrors,
    hasChanges,
  } = props;

  return (
    <Box alignItems="center" displayProp="flex" flexDirection="row">
      <Button
        className="save-button"
        label={t("Common:SaveButton")}
        onClick={() => onSubmit(t)}
        primary
        size="small"
        tabIndex={23}
        isDisabled={hasErrors || !hasChanges}
        isLoading={isSubmitLoading}
      />
      <Button
        label={t("Settings:RestoreDefaultButton")}
        onClick={isSsoEnabled ? openResetModal : resetForm}
        size="small"
        tabIndex={24}
        isDisabled={isSubmitLoading}
      />
      {confirmationResetModal && <ResetConfirmationModal />}
    </Box>
  );
};

export default inject(({ ssoStore }) => {
  const {
    onSubmit,
    isSsoEnabled,
    openResetModal,
    resetForm,
    confirmationResetModal,
    isSubmitLoading,
    hasErrors,
    hasChanges,
  } = ssoStore;

  return {
    onSubmit,
    isSsoEnabled,
    openResetModal,
    resetForm,
    confirmationResetModal,
    isSubmitLoading,
    hasErrors,
    hasChanges,
  };
})(observer(SubmitResetButtons));
