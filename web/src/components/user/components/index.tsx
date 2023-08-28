import ImageWrapper, {
  ImageType,
  ImageContainer,
} from 'elements/ImageWrapper';

export default function UserAvatar({ user }) {
  return (
    <>
      {user && (
        <ImageWrapper
          imageType={ImageType.avatarBig}
          src={user.avatar}
          alt="avatar"
        />
      )}
    </>
  );
}
