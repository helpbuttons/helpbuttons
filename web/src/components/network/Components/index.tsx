import { ImageContainer } from "elements/ImageWrapper"

export default function NetworkLogo({network}) {
  
return <>{network && (<ImageContainer
                  src={network.logo}
                  alt={network.name}
                  width={68}
                  height={68}
                />)
              }
              </>
}