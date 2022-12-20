import { ImageContainer } from "elements/ImageWrapper"
import { Network } from "shared/entities/network.entity"

export default function NetworkLogo({network}) {
  
return <>{network && (<ImageContainer
                  src={"api" + network.logo}
                  alt={network.name}
                  width={50}
                  height={50}
                  localUrl
                />)
              }
              </>
}