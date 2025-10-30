import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import t from "i18n";

// '/assets/images/create_network.jpg'
export function IllustrationHead({imageSrc = null, title}) {
    return (
        <div className='form__field'>
            {imageSrc && 
                <div className='form__illustration'>
                    <ImageWrapper
                        imageType={ImageType.formIllustration}
                        alt={title} src={imageSrc} localUrl={true} />
                </div>
            }
            <div className='form__header'>
                {title}
            </div>
        </div>
    )
}