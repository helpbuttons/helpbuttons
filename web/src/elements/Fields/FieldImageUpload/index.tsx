import { Controller, useFieldArray } from "react-hook-form";

import { useState } from "react";
import ImageUploading from "react-images-uploading";

export default function FieldUploadImage({ name, label, control }) {
  const { fields, replace, remove } = useFieldArray({
    control,
    name: name,
  });

  const onChange = (image, addUpdateIndex) => {
    remove(0)
    replace(image)
    // setImages(imageList);

    // const imageFilesList = imageList.map((imageData) => imageData.file);
    
    // if (imageFilesList.length > 0)
    //   handleChange(name, imageFilesList[0]);
  };

  return (
    <>
      <div className="form__field">
        <ImageUploading
          value={fields}
          onChange={onChange}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemove,
          }) => (
            // write your building UI
            <div className="upload__image-wrapper">
              <label
                htmlFor="files"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  onImageUpload();
                }}
              >
                {label}
              </label>
              {fields.map((image, index) => (
                <div key={index} className="image-item">
                  <Controller
                      render={({ field: { value } }) => (
                        <img src={value.data_url} alt="" width="100" />
                      )}
                      name={`${name}.${index}`}
                      control={control}
                    />
                  <div className="image-item__btn-wrapper">
                    <button type="button" onClick={() => remove(index)}>
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
      </div>
    </>
  );
}
