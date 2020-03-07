import React from 'react';
import Dog from './dog.js';
import MeetThem from './meetThem.js'
import style from 'styled-components'

const StyledDiv = style.div`
  width: 100%;
  height: 320px;
  position absolute;  
  left: 50%;
  min-width: 732px;
  margin-left: ${props => (props.width/2 - props.displayNum * 157 > 0 ? (-(props.displayNum * 157)+'px') : -(props.width/2-20)+'px')};  
  `;

function Dogs(props) {

  const dogs = props.dogs;

  //if no location is given
  if (!props.location.on && props.location.latitude === 0) {
    console.log('on is false')
    const refinedDogs = dogs.slice(0,4);

    const dogList = refinedDogs.map((dog) => {
      return <Dog dog={dog} key={dog._id}/>
    })
  
    return (
      <StyledDiv>
        <div className='dogList'>
          {dogList}
          <MeetThem dogs={props.dogs} breedId={props.breedId} />
        </div>
      </StyledDiv>
    );
  
    //if user location is given
  } else {
    console.log('on is true')
    //for now going to make the cut-off for nearby 200miles given the mock data

      //calculates the distance between two coordinates
    function findDistance(userLat, userLong, dogLat, dogLong) {
      var degDist = Math.sqrt(Math.pow(userLong-dogLong, 2) + Math.pow(userLat-dogLat, 2));

      //Note: 1 degree of latitude or longitude is approximately 69.2 miles 
      var mileDist = degDist*69.2

      return mileDist;
    }
      
    const locateDogs = props.dogs.map((dog)=>{
      var latAndLongitude = dog.location.split('/');
      var dist = findDistance(props.location.latitude, props.location.longitude, Number(latAndLongitude[0]), Number(latAndLongitude[1]));
      dog.dist = dist;
      return dog;
    });

    function sortByDistance(array) {
      var firstSwapIndex = 0;
      var swapped;
      var sorterCount = 0;
      var sorter = function(firstSwapIndex) {
        swapped = false;
        sorterCount+=1;

        for (var i = firstSwapIndex; i < array.length - 1; i++) { 
          if (array[i].dist > array[i+1].dist) {
            var temporary = array[i];
            array[i] = array[i+1];
            array[i+1] = temporary;
            //check if this is the first swap of the loop
            if (!swapped) {
              firstSwapIndex = 0 //going to have to look into this wanted to bypass some of the earlier numbers if a swap came later but duplicates make this idea break
            }
            //set swapped to true
            swapped = true;
            }
        }
        //if there are any swaps run the looping function again with the new position variable
        if (swapped || sorterCount === 0) {
          sorter(firstSwapIndex);
        }
        //else return the array
        return array;
      };
      return (sorter(firstSwapIndex));
    };

    var nearbyDogs = sortByDistance(locateDogs);
    var onlyNearbyDogs = [];

    //later when refactoring should put this before the sort to make 'n' smaller
    for (var i = 0; i < nearbyDogs.length; i++) {
      if (nearbyDogs[i].dist < 200) {
        onlyNearbyDogs.push(nearbyDogs[i]);
      }
    }

    
    var displayNum;

    if (props.display.width >= 1250) {
      displayNum = 4;
    } else if (props.display.width < 1250 && window.innerWidth >= 995) {
      displayNum = 3;
    } else {
      displayNum = 2;
    }
    
    const refinedDogs = onlyNearbyDogs.slice(0, displayNum);

    const dogList = refinedDogs.map((dog) => {
      return <Dog dog={dog} key={dog._id}/>
    })
  
    return (
      <StyledDiv displayNum={displayNum} width={window.innerWidth}>
        <div className='dogList'>
          {dogList}
          <MeetThem dogs={onlyNearbyDogs} breedId={props.breedId} breed={props.breed} displayNum={displayNum}/>
        </div>
      </StyledDiv>
    );
  };

  

  

}

export default Dogs;