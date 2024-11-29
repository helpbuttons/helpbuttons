// export const templates = [
//     require('../plugins/templates/form/defs')
// ]i
import { TemplateFormDefinitions} from '../plugins/templates/form/defs';

export const templates = () => {
    // FormTemplate.getConfigurationAddField()
    
    return [
        TemplateFormDefinitions()
    ]
}