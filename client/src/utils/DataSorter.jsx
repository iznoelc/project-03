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
    console.log("SORT TYPE:", Type);

    switch (Type){
        case "tags":{
            returnArray = sortTags(Ascending, returnArray);
            break;
        };
        case "name":{
            
            returnArray = sortName(Ascending, returnArray);
            break;
        };
        case "creator":{
            
            returnArray = sortCreator(Ascending, returnArray);
            break;
        };
        case "date":{
            
            returnArray = sortDate(Ascending, returnArray);
            break;
        }
    }

    return returnArray;
}



function sortName(Ascending, DataArray){
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = (a.name || "").toLowerCase();
        let stringB = (b.name || "").toLowerCase();
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
        let stringA = (a.creator || "").toLowerCase();
        let stringB = (b.creator || "").toLowerCase();
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }

    return returnArray;
}

function sortTags(Ascending, DataArray){ // Sorts by the location of each job
    let returnArray = [...DataArray];

    
    returnArray.sort((a, b) => {
        let stringA = (a.tags[0] || "").toLowerCase();
        let stringB = (b.tags[0] || "").toLowerCase();
        if (stringA == stringB){
            stringA = (a.tags[1] || "").toLowerCase();
            stringB = (b.tags[1] || "").toLowerCase();
            if (stringA == stringB){
                stringA = (a.tags[2] || "").toLowerCase();
                stringB = (b.tags[2] || "").toLowerCase();
            }
        }
        return stringA.localeCompare(stringB);
    });

    if (!Ascending) returnArray.reverse();


    return returnArray;
}

function sortDate(Ascending, DataArray){
    let returnArray = [...DataArray];

    returnArray.sort((a,b) => {
        let stringA = (a.createdAt || "").toLowerCase();
        let stringB = (b.createdAt || "").toLowerCase();
        return stringA.localeCompare(stringB);
    });
    if(!Ascending){
        returnArray.reverse();
    }
    

    return returnArray;

}

export default DataSorter;