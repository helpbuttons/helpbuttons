///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfoOverlay with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React, { Component } from 'react';
import HeaderInfoOverlay from "../HeaderInfoOverlay";
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'
import Filters from "../Filters";
import FiltersMobile from "../FiltersMobile"; //just for mobile
import { Observable,
  of,
  from,
  fromEvent,
  interval,
  asyncScheduler,
  Subject,
  BehaviourSubject
 } from 'rxjs';


const searchObservable  = Observable.create( observer => { //creates observable from the elements pass inside

  observer.next('A'); //next adds elements to the observable
  observer.next('B');
  obser
  observer.next('C');

});


const observ1 = of('hello'); // makes observable out of any elekemt we pass
const observ2 = from('hello'); // Emits individual part of the passed element. Each element of an array or each letter of a string etc/

const observEvent = fromEvent(document,'click'); //pass the DOM element and the event we want to listen to, it will create an observable wainting for that event in there
observEvent.subscribe(print); // print is a funcition that order to output on the DOM,
const observTimeInterval = interval(500); //creates observable that executes output every interval of miliseconds
observTimeInterval.subscribe(print);


const observ1 = of('hello', asyncScheduler); // makes to execute the observable in the next iteration of the loop.


const cold  = Observable.create( o => { //create observable that generates random number

  o.next(Math.random());

});


//SHARE

import { share, shareReplay, publish  } from "rxjs/operators";

const hot = cold.pipe(share()); //share is for using the observable value with another varibale
const hot = cold.pipe(shareReplay(1)); //share first given number by the observable with the rest of the new variable


//SUBJECTS - is a type of observable that can be modified after subscription. you specified the content the AFTER THE susbscription

const subject = new Subject();

subject.subscribe(print); //inside the subscriptiion comes the action
subject.next('hello');

subject.subscribe(print); //this subscripber prints nothing because has notthing behind

/////

const subject = new BehaviourSubject(); // outputs the last casted  value to the observable, even if it has no more added elelemnts behind a new subscribe
subject.subscribe(print); //inside the subscriptiion comes the action
subject.next('hello');
subject.next('madrid');
subject.subscribe(print); //prints madrid

//// OPERATORS

import { map, filter, take, scan, map, tap } from "rxjs/operators";

const source = from([1,2,3,4,5]);

const modified = source.pipe( //pipes operators in order.

  scan((acc,val) => acc + val), // stores and keep variables on the flow of the observable, so you can accumulate the values and operate with them.
  map(n => Math.pow(n,2)), //map execute a function for each element of the observable
  filters (v => v > 10), //emits only the ones that fit the rule greater than 10
  take(3); //take only limit the number of elements to take

);

modified.suscribe(print);

////// TAP

const modified = source.pipe(

  scan((acc,val) => acc + val),
  tap(print); //allows to output like a suscription in the middle of the pipe.
  map(n => Math.pow(n,2)),
  tap( async v => { //EVEN EXECUTE OUTPUT TO BACKEND IN THE MIDDLE OF THE PIPE.
      await Promise.resolve();
      alert(v);
  })

);

//////// BACKPRESSURE
import { fromEvent } from "rxjs";
import { debounceTime, throttleTime,  bufferCount } from "rxjs/operators";

const eventObservable = fromEvent(document, 'mouseover'); //outputs event every per second when movings the Mouse

const debouncedObservable = eventObservable.pipe(debounceTime(1000)); /// waits time after the event stoops happening
const throttleObservable = eventObservable.pipe(throttleTime(1000)); /// triggers when the first event happens and waits time till it allows to accept events again
const debouncedObservable = eventObservable.pipe(bufferCount(40)); /// triggers when the amount of events is reached

debouncedObservable.subscribe(print);


////////SWITCHMAP
import { switchMap } from "rxjs/operators";

const user$ = of({ uid: Math.random() });

const orders$ = user$.pipe(
    switchMap( user => { //allows to pipe orders based on an internal value that needs to be waited, like in this case the user id from other observable.
      return fetchOrders(user.uid);
    })
);

orders$.subscribe(print);


/////////COMBINE

import { combineLatest, merge } from "rxjs";
import { delay } from "rxjs/operators";

const randomAsyncObservable  = Observable.create( o => { //create observable that generates random number

  o.next(Math.random());

});

const delayedAsyncObservable = randomAsyncObservable.pipe(delay(1000));

const comboObservable = combineLatest( //emits in order all the obsrvables as an array (if delay, it will pause)
  [
    delayedAsyncObservable, randomAsyncObservable, randomAsyncObservable, randomAsyncObservable
  ]
)

const mergeObservable = merge( //emits in order of execution all the obsrvables as an array (if delay, it will render after)
  [
    delayedAsyncObservable, randomAsyncObservable, randomAsyncObservable, randomAsyncObservable
  ]
)

////////ERRORS

const subject = new Subject();

sub.pipe(
  catchError(err => of ('somethign error')), //catch if error happens with the observable and adds to observable so can be printed
  retry(2); ///retrys the pipe if failed, useful in http calls
)
.subscribe(print);

sub.next('good');
sub.error('broken'); //shoows error in the console if error happens


//////MEMORY LEAKS
import {interval, timer} from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';

const source = interval (100);

const suscription = source.subscribe(v => {
    print(v);
    if(v => 10)
    suscription.unsuscribe();
});

const exampleTakeWhile = source.pipe(
  takeWhile(v => v <= 10); /// it will unsuscribe automatically after it reaches the condition, so we don't have memory leaks.

)

const exampleTakeUntil = source.pipe(
  takeUntil(timer(2000)); /// it will unsuscribe automatically when the specified time completes
)

exampleTakeUntil.subscribe(print);



export default class NavHeader extends React.Component {



  constructor() {
      super();
      this.state = {
        name: "React",
        tag: '',
        search: "",
        setSearch: "",
        results: "",
        setResults: "",
        showHideFilters: true,
        showHideFiltersMobile: false,
        showHideExtraFilters: false,
        showHideInfoOverlay: false

      };

      this.hideComponent = this.hideComponent.bind(this);

    }



  hideComponent(name) {
      console.log(name);
      switch (name) {
        case "showHideFilters":
          this.setState({ showHideFilters: !this.state.showHideFilters });
          break;
        case "showHideFiltersMobile":
          this.setState({ showHideFiltersMobile: !this.state.showHideFiltersMobile });
          console.log(this.state.showHideFiltersMobile);
          break;
        case "showHideExtraFilters":
          this.setState({ showHideExtraFilters: !this.state.showHideExtraFilters });
          break;
        default:
          null;
      }
    }

  render() {

    const { showHideFilters, showHideFiltersMobile, showHideExtraFilters, showHideInfoOverlay } = this.state;


    return(

      <>

        <form className="nav-header__content">

            <button className="btn-circle">

              <div className="btn-circle__content">

                <div className="btn-circle__icon">
                  <CrossIcon />
                </div>

              </div>

            </button>

            <div className="nav-header__content-message">

              <input onFocus={() => this.setState({ showHideFiltersMobile: true })} onBlur={() => this.setState({ showHideFiltersMobile: false })} className="form__input nav-header__content-input" placeholder="Search tags"></input>

            </div>

        </form>

        <Filters />

        { showHideFiltersMobile ? <FiltersMobile />  : null}

        { showHideInfoOverlay ? <HeaderInfoOverlay />  : null}


      </>

    )

  }

}
