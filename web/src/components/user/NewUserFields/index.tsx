import FieldUploadImage from "elements/Fields/FieldImageUpload";
import FieldPassword from "elements/Fields/FieldPassword";
import FieldText from "elements/Fields/FieldText";

export default function NewUserFields({register, errors, control, setValue}) {
  return (
    <>
      <FieldText
        name="email"
        label="Email"
        classNameInput="squared"
        placeholder="email@email.em"
        validationError={errors.email}
        {...register('email', { required: true })}
      ></FieldText>
      <FieldText
        name="name"
        label="Name"
        classNameInput="squared"
        placeholder="name"
        validationError={errors.name}
        {...register('name', { required: true })}
      ></FieldText>
      <FieldPassword
        name="password"
        label="Password"
        classNameInput="squared"
        placeholder="Type your password"
        validationError={errors.password}
        {...register('password', { required: true, minLength: 8 })}
      ></FieldPassword>
      150x150px
      <FieldUploadImage
        name="avatar"
        label="Choose avatar"
        control={control}
        width={150}
        height={150}
        validationError={errors.avatar}
        setValue={setValue}
        {...register('avatar', { required: true })}
      />
    </>
  );
}
