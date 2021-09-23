///Accordion section component for displaying long section data
import React, { Component } from 'react';


export default class Accordion extends React.Component {

  render() {

        return (

            <>
              <button id="section_name" className="accordion">Section 1</button>
                <div className="panel">
                  {this.props.children}
                </div>
            </>

        );
  }

}
