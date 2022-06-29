export class UtilsService {
    public static objectToFormData(bodyData)
    {
        const formData = new FormData();

        Object.keys(bodyData).forEach((key) => {
        if (Array.isArray(bodyData[key])) {
            if (bodyData[key].length > 0) {
            bodyData[key].map((val) => {
                formData.append(key + "[]", val)
            })
            } else {
            //formData.append(key + "[]", '') // if this is enabled it will send an array with an empty string!
            }
        } else {
            formData.append(key, bodyData[key])
        }
        });
        return formData;
    }
}