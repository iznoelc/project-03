/**
    DataSorter.jsx
    Allows use of sorting functions
    Input 1: Type : String - Name, Creator, Tags
    Input 2: Type : Bool - True = Ascending, False = Descending
    Input 3: Type : DataArray
    @author Landon Chapin
**/
function DataSorter (Type, Ascending, DataArray){
    let returnArray = [...DataArray];

    switch (Type){
        case "Tags":{
            returnArray = sortTags(Ascending, returnArray);
            break;
        };
        case "Name":{
            returnArray = sortName(Ascending, returnArray);
            break;
        };
        case "Creator":{
             returnArray = sortCreator(Ascending, returnArray);
            break;
        };
    }

    return returnArray;
}



function sortName(Ascending, DataArray){
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = a.name;
        let stringB = b.name;
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }
    

    return returnArray;

}


function sortCreator(Ascending, DataArray){ // Sorts by the location of each job
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = a.creator;
        let stringB = b.creator;
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }

    return returnArray;
}

function sortTags(Ascending, DataArray){ // Sorts by the location of each job
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = a.name;
        let stringB = b.name;
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }

    return returnArray;
}

export default DataSorter;