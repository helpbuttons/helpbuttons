import ImageWrapper, { ImageType, ImageContainer } from "elements/ImageWrapper"

export default function UserAvatar({user}) {
  
return <>{user && (
                <ImageWrapper imageType={ImageType.avatar} src={user.avatar} alt="avatar"/>
                )
              }
              </>
}