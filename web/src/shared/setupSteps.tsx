import router from "next/router";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";

export enum SetupSteps {
    CREATE_ADMIN_FORM = '/Setup/CreateAdminForm',
    FIRST_OPEN = '/Setup/FirstOpen',
    NETWORK_CREATION = '/Setup/NetworkCreation',
    SETUP_LOGIN = '/Setup/Login',
  }