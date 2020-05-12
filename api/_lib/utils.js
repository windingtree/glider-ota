

function assertParameterNotEmpty(parameterName,parameterValue){
    if(parameterValue == undefined || parameterValue.length == 0)
        throw new Error(`Parameter ${parameterName} cannot be empty`);
}

module.exports={assertParameterNotEmpty}