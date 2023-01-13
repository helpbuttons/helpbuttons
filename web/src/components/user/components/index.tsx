import ImageWrapper, { ImageType, ImageContainer } from "elements/ImageWrapper"

export default function UserAvatar({user}) {
  
return <>{user && (
                <ImageContainer
                  src={"api" + user.avatar}
                  alt={user.name}
                  width={50}
                  height={50}
                  localUrl
                />
                // <ImageWrapper imageType={ImageType.avatar} src={user.avatar} alt="avatar"/>
                )
              }
              </>
}