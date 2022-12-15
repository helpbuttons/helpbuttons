import router from "next/router";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";

export enum SetupSteps {
    SYSADMIN_CONFIG = '/Setup/SysadminConfig',
    CREATE_ADMIN_FORM = '/Setup/CreateAdminForm',
    FIRST_OPEN = '/Setup/FirstOpen',
    INSTANCE_CREATION = '/Setup/InstanceCreation',
  }

export function setupNextStep(step: SetupSteps) {
  localStorageService.save( LocalStorageVars.SETUP_STEP, step);
  router.replace(step);
}