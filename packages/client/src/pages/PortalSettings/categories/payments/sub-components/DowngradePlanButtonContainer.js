import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import Button from "@docspace/components/button";
import styled from "styled-components";
import DowngradePlanDialog from "../../../../../components/dialogs/DowngradePlanDialog";

const StyledBody = styled.div`
  button {
    width: 100%;
  }
`;

const DowngradePlanButtonContainer = ({
  isDisabled,
  isLoading,
  isLessCountThanAcceptable,
  t,
  onUpdateTariff,
  addedManagersCount,
  usedTotalStorageSizeCount,
  allowedStorageSizeByQuota,
  managersCount,
}) => {
  const [
    isVisibleDowngradePlanDialog,
    setIsVisibleDowngradePlanDialog,
  ] = useState(false);

  const isPassesByQuota = () => {
    if (addedManagersCount > managersCount) return false;
    if (usedTotalStorageSizeCount > allowedStorageSizeByQuota) return false;
    return true;
  };
  const onDowngradeTariff = () => {
    if (!isPassesByQuota()) {
      setIsVisibleDowngradePlanDialog(true);
      return;
    }

    onUpdateTariff && onUpdateTariff();
  };

  const onClose = () => {
    isVisibleDowngradePlanDialog && setIsVisibleDowngradePlanDialog(false);
  };

  return (
    <StyledBody>
      {isVisibleDowngradePlanDialog && (
        <DowngradePlanDialog
          visible={isVisibleDowngradePlanDialog}
          onClose={onClose}
        />
      )}
      <Button
        label={t("DowngradeNow")}
        size={"medium"}
        primary
        isDisabled={isLessCountThanAcceptable || isLoading || isDisabled}
        onClick={onDowngradeTariff}
        isLoading={isLoading}
      />
    </StyledBody>
  );
};

export default inject(({ auth, payments }) => {
  const { currentQuotaStore } = auth;
  const {
    isLoading,
    isLessCountThanAcceptable,
    allowedStorageSizeByQuota,
    managersCount,
  } = payments;
  const { addedManagersCount, usedTotalStorageSizeCount } = currentQuotaStore;
  return {
    isLoading,
    isLessCountThanAcceptable,
    addedManagersCount,
    usedTotalStorageSizeCount,
    allowedStorageSizeByQuota,
    managersCount,
  };
})(observer(DowngradePlanButtonContainer));
