import { ImageContainer } from "elements/ImageWrapper"
import { isStaticApp } from "shared/environment"

export default function NetworkLogo({network}) {
  
return <>{network && (<ImageContainer
                  src={network.logo}
                  alt={network.name}
                  width={68}
                  height={68}
                  localUrl={!!isStaticApp()}
                />)
              }
              </>
}