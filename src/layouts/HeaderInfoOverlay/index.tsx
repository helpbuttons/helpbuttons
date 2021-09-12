///mobile home info overlay with network descripttion, andd dropddown for networks selection
import Image from 'next/image'
import logo from '../../../public/assets/svg/logo/logo3-01.svg'


export default function HeaderInfoOverlay(){
  return(
      <div >
        <a href="#!"><img src="" alt=""/><Image src={logo} alt="icon"/></a>
        <span>Nombre de Red</span>
        <span>Descripción de Red</span>
      </div>
  )
}
