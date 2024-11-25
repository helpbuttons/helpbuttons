import { PigeonProps } from 'pigeon-maps';
import React from 'react';
// import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import { Button } from 'shared/entities/button.entity';
import CardButtonMap from '../CardButtonMap';
import { buttonColorStyle } from 'shared/buttonTypes';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';

interface MarkerButtonProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  button: Button;
  handleMarkerClicked: any;
  color: string;
}

interface MarkerButtonIconProps extends PigeonProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  image: string;
  title: string;
  onClick?: any;
  cssColor: string;
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
   
  const handleMarkerClicked = (button: Button) => {
    props.handleMarkerClicked(button);
  };

  return (
    <>
    l
      <MarkerButtonIcon
        {...props}
        cssColor={props.color}
        image={props.button.image}
        title={props.button.title}
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
      <CardButtonMap button={props.button} />
    </div>
  );
}

export function MarkerButtonIcon(props: MarkerButtonIconProps) {
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
          <div className="avatar-medium marker-button__image">
            <ImageWrapper
              imageType={ImageType.avatarMed}
              src={props.image}
              alt={props.title}
            />
          </div>

          <span className="marker-button__arrow"></span>
          {props.title && 
            <div className="marker-button__tags marker-button-selector-title">
              <div className="marker-button__link-tag">
                {props.title}
              </div>
            </div>
          }
        </figure>
      </div>
    </div>
  );
}

