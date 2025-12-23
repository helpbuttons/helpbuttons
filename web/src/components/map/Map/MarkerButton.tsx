import { PigeonProps } from 'pigeon-maps';
import React, { useState } from 'react';
// import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import { Button } from 'shared/entities/button.entity';
import CardButtonMap from '../CardButtonMap';
import { buttonColorStyle, useButtonTypes } from 'shared/buttonTypes';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';

interface MarkerButtonProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  button: Button;
  handleMarkerClicked: any;
  color: string;
  showCard?: boolean;

}

interface MarkerButtonIconProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  image: string;
  title: string;
  onClick?: any;
  cssColor: string;
  button?: Button;
  showCard?: boolean;

}

interface MarkerButtonPopupProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  button: Button;
}
export function MarkerButton(props: MarkerButtonProps) {
  const width = 100;
  const height = 100;

  // const { cssColor } = buttonTypes.find((buttonType) => {
  //   return buttonType.name === props.button.type;
  // });
  const cssColor = 'red' // TODO
  const [showCard, setshowCard] = useState(true);

  const handleMarkerClicked = (button: Button) => {
    if(showCard)
    {props.handleMarkerClicked(button);
    setshowCard(false);}
    else
    {setshowCard(true);}
  };

  const handleCardClicked = (button: Button) => {
    props.handleMarkerClicked(button);
  };

  return (
    <>
      <MarkerButtonIcon
        {...props}
        cssColor={props.color}
        image={props.button.image}
        title={props.button.title}
        button={props.button}
        showCard={showCard}
        onClick={() => handleMarkerClicked(props.button)}
      />
    </>
  );
}

export function MarkerButtonPopup(props: MarkerButtonPopupProps) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${props.left}px, ${props.top}px)`,
        backgroundColor: 'transparent',
        ...(props.style || {}),
      }}
      className={
        props.className
          ? `${props.className} pigeon-click-block`
          : 'pigeon-click-block'
      }
    >
      <CardButtonMap button={props.button} buttonTypes={undefined}/>
    </div>
  );
}

export function MarkerButtonIcon(props: MarkerButtonIconProps) {
      const buttonTypes = useButtonTypes();
  
  return (
    <div style={buttonColorStyle(props.cssColor)}>
      <div
        style={{
          position: 'absolute',
          transform: `translate(${props.left}px, ${props.top}px)`,
          ...(props.style || {}),
        }}
        className={
          props.className
            ? `${props.className} pigeon-click-block`
            : 'pigeon-click-block'
        }
      >
        <figure
          id="markerButton"
          onClick={props.onClick}
          className="marker-button marker-button-selector"
        >
          {props.title  && !props.showCard && 
            <div className="marker-button__tags marker-button-selector-title">
              <div className="marker-button__link-tag">
                {props.title}
              </div>
            </div>
          }

          {/* {!props.title && 
            <div className=" marker-button__image--fix">
              <ImageWrapper
                imageType={ImageType.avatarMed}
                src={props.image}
                alt={props.title}
              />
            </div>
          } */}

          {props.title && !props.showCard &&                    
            <div className=" marker-button__image">
              <ImageWrapper
                imageType={ImageType.avatarMed}
                src={props.image}
                alt={props.title}
              />
            </div>
          }
          <span className="marker-button__arrow"></span>
        </figure>
        {props.showCard && 
          <figure className='marker-button--card'>
            <CardButtonMap button={props.button} buttonTypes={buttonTypes} onClick={props.onClick}/>
          </figure>
        }
      </div>
    </div>
  );
}


export function LocationKeyIcon(props) {
  return (
    <div >
      <div
        style={{
          position: 'absolute',
          transform: `translate(${props.left}px, ${props.top}px)`,
          ...(props.style || {}),
        }}
        className={'pigeon-click-block'}
      >
        <figure
          id="markerButton"
          className="marker-button marker-button-selector"
          onClick={props.onClick}
        >
          {props.title && 
            <div className=" marker-key-location marker-button-selector-title">
              <div className="marker-key-location__name">
                {props.title}
              </div>
            </div>
          }
          <span className="marker-button__arrow marker-key-location__arrow"></span>

        </figure>
      </div>
    </div>
  );
}
