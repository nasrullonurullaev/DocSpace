﻿import PencilReactSvgUrl from "ASSETS_DIR/images/pencil.react.svg?url";
import ChangeMailReactSvgUrl from "ASSETS_DIR/images/change.mail.react.svg?url";
import ChangeSecurityReactSvgUrl from "ASSETS_DIR/images/change.security.react.svg?url";
import FolderReactSvgUrl from "ASSETS_DIR/images/folder.react.svg?url";
import EnableReactSvgUrl from "ASSETS_DIR/images/enable.react.svg?url";
import RemoveReactSvgUrl from "ASSETS_DIR/images/remove.react.svg?url";
import RessingDataReactSvgUrl from "ASSETS_DIR/images/ressing_data.react.svg?url";
import DelDataReactSvgUrl from "ASSETS_DIR/images/del_data.react.svg?url";
import TrashReactSvgUrl from "ASSETS_DIR/images/trash.react.svg?url";
import InfoReactSvgUrl from "ASSETS_DIR/images/info.react.svg?url";
import RestoreAuthReactSvgUrl from "ASSETS_DIR/images/restore.auth.react.svg?url";
import DisableReactSvgUrl from "ASSETS_DIR/images/disable.react.svg?url";
import ProfileReactSvgUrl from "PUBLIC_DIR/images/profile.react.svg?url";
import RefreshReactSvgUrl from "PUBLIC_DIR/images/refresh.react.svg?url";
import InviteAgainReactSvgUrl from "PUBLIC_DIR/images/invite.again.react.svg?url";
import ChangeToEmployeeReactSvgUrl from "PUBLIC_DIR/images/change.to.employee.react.svg?url";
import DeleteReactSvgUrl from "PUBLIC_DIR/images/delete.react.svg?url";
import React from "react";
import { makeAutoObservable } from "mobx";
import { Trans } from "react-i18next";

import config from "PACKAGE_FILE";

import toastr from "@docspace/components/toast/toastr";

import history from "@docspace/common/history";
import { combineUrl } from "@docspace/common/utils";
import {
  AppServerConfig,
  EmployeeStatus,
  FilterSubject,
} from "@docspace/common/constants";
import { resendUserInvites } from "@docspace/common/api/people";
import { getCategoryUrl } from "SRC_DIR/helpers/utils";
import { CategoryType } from "SRC_DIR/helpers/constants";
import RoomsFilter from "@docspace/common/api/rooms/filter";

const { proxyURL } = AppServerConfig;

const PROXY_HOMEPAGE_URL = combineUrl(proxyURL, "/");

const PROFILE_SELF_URL = combineUrl(PROXY_HOMEPAGE_URL, "/accounts/view/@self");

class AccountsContextOptionsStore {
  authStore = null;

  peopleStore = null;

  constructor(peopleStore) {
    makeAutoObservable(this);
    this.authStore = peopleStore.authStore;

    this.peopleStore = peopleStore;
  }

  getUserContextOptions = (t, options, item) => {
    const contextMenu = options.map((option) => {
      switch (option) {
        case "separator-1":
          return { key: option, isSeparator: true };
        case "separator-2":
          return { key: option, isSeparator: true };

        case "profile":
          return {
            id: "option_profile",
            key: option,
            icon: ProfileReactSvgUrl,
            label: t("Common:Profile"),
            onClick: this.onProfileClick,
          };

        case "change-name":
          return {
            id: "option_change-name",
            key: option,
            icon: PencilReactSvgUrl,
            label: t("PeopleTranslations:NameChangeButton"),
            onClick: this.toggleChangeNameDialog,
          };
        case "change-email":
          return {
            id: "option_change-email",
            key: option,
            icon: ChangeMailReactSvgUrl,
            label: t("PeopleTranslations:EmailChangeButton"),
            onClick: () => this.toggleChangeEmailDialog(item),
          };
        case "change-password":
          return {
            id: "option_change-password",
            key: option,
            icon: ChangeSecurityReactSvgUrl,
            label: t("PeopleTranslations:PasswordChangeButton"),
            onClick: () => this.toggleChangePasswordDialog(item),
          };
        case "change-owner":
          return {
            id: "option_change-owner",
            key: option,
            icon: RefreshReactSvgUrl,
            label: t("Translations:OwnerChange"),
            onClick: () => this.toggleChangeOwnerDialog(item),
          };
        case "room-list":
          return {
            key: option,
            icon: FolderReactSvgUrl,
            label: "Room list",
            onClick: () => this.openUserRoomList(item),
          };
        case "enable":
          return {
            id: "option_enable",
            key: option,
            icon: EnableReactSvgUrl,
            label: t("PeopleTranslations:EnableUserButton"),
            onClick: () => this.onEnableClick(t, item),
          };
        case "disable":
          return {
            id: "option_disable",
            key: option,
            icon: RemoveReactSvgUrl,
            label: t("PeopleTranslations:DisableUserButton"),
            onClick: () => this.onDisableClick(t, item),
          };

        case "reassign-data":
          return {
            id: "option_reassign-data",
            key: option,
            icon: RessingDataReactSvgUrl,
            label: t("PeopleTranslations:ReassignData"),
            onClick: () => this.onReassignDataClick(item),
          };
        case "delete-personal-data":
          return {
            id: "option_delete-personal-data",
            key: option,
            icon: DelDataReactSvgUrl,
            label: t("PeopleTranslations:RemoveData"),
            onClick: () => this.onDeletePersonalDataClick(t, item),
          };
        case "delete-user":
          return {
            id: "option_delete-user",
            key: option,
            icon: TrashReactSvgUrl,
            label: t("DeleteProfileEverDialog:DeleteUser"),
            onClick: () => this.toggleDeleteProfileEverDialog(item),
          };

        case "details":
          return {
            id: "option_details",
            key: option,
            icon: InfoReactSvgUrl,
            label: t("Common:Info"),
            onClick: this.onDetailsClick,
          };

        case "invite-again":
          return {
            id: "option_invite-again",
            key: option,
            icon: InviteAgainReactSvgUrl,
            label: t("LblInviteAgain"),
            onClick: () => this.onInviteAgainClick(t, item),
          };
        case "reset-auth":
          return {
            id: "option_reset-auth",
            key: option,
            icon: RestoreAuthReactSvgUrl,
            label: t("PeopleTranslations:ResetAuth"),
            onClick: () => this.onResetAuth(item),
          };
        default:
          break;
      }

      return undefined;
    });

    return contextMenu;
  };

  getUserGroupContextOptions = (t) => {
    const { onChangeType, onChangeStatus } = this.peopleStore;

    const {
      hasUsersToMakeEmployees,
      hasUsersToActivate,
      hasUsersToDisable,
      hasUsersToInvite,
      hasUsersToRemove,
      hasFreeUsers,
    } = this.peopleStore.selectionStore;
    const {
      setSendInviteDialogVisible,
      setDeleteDialogVisible,
    } = this.peopleStore.dialogStore;

    const { isOwner } = this.authStore.userStore.user;

    const { setIsVisible, isVisible } = this.peopleStore.infoPanelStore;

    const options = [];

    const adminOption = {
      id: "context-menu_administrator",
      className: "context-menu_drop-down",
      label: t("Common:DocSpaceAdmin"),
      title: t("Common:DocSpaceAdmin"),
      onClick: (e) => onChangeType(e, t),
      action: "admin",
      key: "cm-administrator",
    };
    const managerOption = {
      id: "context-menu_manager",
      className: "context-menu_drop-down",
      label: t("Common:RoomAdmin"),
      title: t("Common:RoomAdmin"),
      onClick: (e) => onChangeType(e, t),
      action: "manager",
      key: "cm-manager",
    };
    const userOption = {
      id: "context-menu_user",
      className: "context-menu_drop-down",
      label: t("Common:User"),
      title: t("Common:User"),
      onClick: (e) => onChangeType(e, t),
      action: "user",
      key: "cm-user",
    };

    isOwner && options.push(adminOption);

    options.push(managerOption);

    hasFreeUsers && options.push(userOption);

    const headerMenu = [
      {
        key: "cm-change-type",
        label: t("ChangeUserTypeDialog:ChangeUserTypeButton"),
        disabled: !hasUsersToMakeEmployees,
        icon: ChangeToEmployeeReactSvgUrl,
        items: options,
      },
      {
        key: "cm-info",
        label: t("Common:Info"),
        disabled: isVisible,
        onClick: () => setIsVisible(true),
        icon: InfoReactSvgUrl,
      },
      {
        key: "cm-invite",
        label: t("Common:Invite"),
        disabled: !hasUsersToInvite,
        onClick: () => setSendInviteDialogVisible(true),
        icon: InviteAgainReactSvgUrl,
      },
      {
        key: "cm-enable",
        label: t("Common:Enable"),
        disabled: !hasUsersToActivate,
        onClick: () => onChangeStatus(EmployeeStatus.Active),
        icon: EnableReactSvgUrl,
      },
      {
        key: "cm-disable",
        label: t("PeopleTranslations:DisableUserButton"),
        disabled: !hasUsersToDisable,
        onClick: () => onChangeStatus(EmployeeStatus.Disabled),
        icon: DisableReactSvgUrl,
      },
      {
        key: "cm-delete",
        label: t("Common:Delete"),
        disabled: !hasUsersToRemove,
        onClick: () => setDeleteDialogVisible(true),
        icon: DeleteReactSvgUrl,
      },
    ];

    return headerMenu;
  };

  getModel = (item, t) => {
    const { selection } = this.peopleStore.selectionStore;

    const { options } = item;

    const contextOptionsProps =
      options && options.length > 0
        ? selection.length > 1
          ? this.getUserGroupContextOptions(t)
          : this.getUserContextOptions(t, options, item)
        : [];

    return contextOptionsProps;
  };

  openUserRoomList = (user) => {
    const filter = RoomsFilter.getDefault();

    filter.subjectId = user.id;
    filter.subjectFilter = FilterSubject.Member;

    const filterParamsStr = filter.toUrlParams();
    const url = getCategoryUrl(CategoryType.Shared);

    window.open(
      combineUrl(PROXY_HOMEPAGE_URL, `${url}?${filterParamsStr}`),
      "_blank"
    );
  };

  onProfileClick = () => {
    history.push(PROFILE_SELF_URL);
  };

  toggleChangeNameDialog = () => {
    const { setChangeNameVisible } = this.peopleStore.targetUserStore;

    setChangeNameVisible(true);
  };

  toggleChangeEmailDialog = (item) => {
    const {
      setDialogData,
      setChangeEmailDialogVisible,
    } = this.peopleStore.dialogStore;
    const { id, email } = item;

    setDialogData({
      email,
      id,
    });

    setChangeEmailDialogVisible(true);
  };

  toggleChangePasswordDialog = (item) => {
    const {
      setDialogData,
      setChangePasswordDialogVisible,
    } = this.peopleStore.dialogStore;
    const { email } = item;
    setDialogData({
      email,
    });

    setChangePasswordDialogVisible(true);
  };

  toggleChangeOwnerDialog = () => {
    const { setChangeOwnerDialogVisible } = this.peopleStore.dialogStore;

    setChangeOwnerDialogVisible(true);
  };

  onEnableClick = (t, item) => {
    const { id } = item;

    const { changeStatus } = this.peopleStore;

    changeStatus(EmployeeStatus.Active, [id]);
  };

  onDisableClick = (t, item) => {
    const { id } = item;

    const { changeStatus } = this.peopleStore;

    changeStatus(EmployeeStatus.Disabled, [id]);
  };

  onReassignDataClick = (item) => {
    const { userName } = item;

    toastr.warning("Work at progress");

    // history.push(
    //   combineUrl(
    //     AppServerConfig.proxyURL,
    //     config.homepage,
    //     `/reassign/${userName}`
    //   )
    // );
  };

  onDeletePersonalDataClick = (t, item) => {
    toastr.success(t("PeopleTranslations:SuccessDeletePersonalData"));
  };

  toggleDeleteProfileEverDialog = (item) => {
    const {
      setDialogData,
      setDeleteProfileDialogVisible,
      closeDialogs,
    } = this.peopleStore.dialogStore;
    const { id, displayName, userName } = item;

    closeDialogs();

    setDialogData({
      id,
      displayName,
      userName,
    });

    setDeleteProfileDialogVisible(true);
  };

  onDetailsClick = () => {
    const { setIsVisible } = this.peopleStore.infoPanelStore;
    setIsVisible(true);
  };

  onInviteAgainClick = (t, item) => {
    const { id, email } = item;
    resendUserInvites([id])
      .then(() =>
        toastr.success(
          <Trans
            i18nKey="MessageEmailActivationInstuctionsSentOnEmail"
            ns="People"
            t={t}
          >
            The email activation instructions have been sent to the
            <strong>{{ email: email }}</strong> email address
          </Trans>
        )
      )
      .catch((error) => toastr.error(error));
  };

  onResetAuth = (item) => {
    toastr.warning("Work at progress");
    console.log(item);
  };
}

export default AccountsContextOptionsStore;
