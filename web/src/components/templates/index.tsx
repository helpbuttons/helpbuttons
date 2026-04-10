import { eventTemplate } from "./event";
import { priceTemplate } from "./price";
import { schedulerTemplate } from "./scheduler";

export interface CustomTemplate {
    icon: any,
    explain: string,
    text: string,
    name: string,
    templateField: any,
    configurationForm: any,
    fieldView: any,
}
export const customTemplates : CustomTemplate[] = [priceTemplate, eventTemplate, schedulerTemplate]

export const customTemplateIcon = (name) => {
    return customTemplates.find((_template) => _template.name == name)?.icon
}

export const findCustomTemplate = (name) => {
    return customTemplates.find((_template) => _template.name == name)
}