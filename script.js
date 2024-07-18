//Access DOM elements of the calculator
let input = document.getElementById('input');
let expressionDiv = document.getElementById('expression');
let answerDiv = document.getElementById('answer');

//expression and output variables
let expression = '';
let answer ='';

//event handler for button click
function buttonClick(event){
    //get values from clicked button
    let target = event.target;
    let action = target.dataset.action;
    let value = target.dataset.value;  
    
    //for demonstration purposes, show on console
    //console.log("Action", action);
    //console.log("Value", value);

    //switch statement to control flow
    switch(action){
        case 'number':
            expressionBuilder(value);
            break;
        
        //if any of the operator buttons are clicked more than once,
        //then display only one i.e. do not show ++///---***
        case 'addition':
        case 'subtraction':
        case 'multiplication':
        case 'division':
            //expression is null AND answer has a value
            //then build expression from current answer 
            if (expression === '' && answer !== ''){
                expressionFromAnswer(value);
            }
            //expression has a value AND button is not an operator
            //then append the button to the expression
            else if (expression !== '' && !isOperator()){
                expressionBuilder(value);
            }
            break;

            //equals button
            case 'submit':
                submit();
                break;

            //toggle between positive and negative
            case 'negate':
                negate();
                break;

            case 'modulus':
                convertToPercentage();
                break;

            case 'decimal':
                convertTodecimal(value);
                break;
            
            case 'clear':
                clear();
                break;

            case 'clearEntry':
                clearEntry();
                break;
    }
    refreshDisplay(expression,answer);
}

//regular expression is used to check for operators
//"-" can be used in building the regular expression 
//thus, use an escape char "/-" to check for - sign
function expressionBuilder(value){
    if (value === '.'){
        //get index of operator in the expression
        let operatorIndex = expression.search (/[+\-*/]/);

        //get index of last decimal in the expression
        let decimalIndex = expression.lastIndexOf('.');

        //get the index of the last number
        let numberIndex = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/')
        );
        //check if this is the first decimal in the current 
        //number or if the expression is empty
        if (
            (decimalIndex < operatorIndex ||
            decimalIndex < numberIndex ||
            decimalIndex === -1) &&            
            (expression === '' || 
                expression.slice (numberIndex + 1).indexOf('-') 
                === -1)
            ){
                expression += value;
            }          
    } else {
        expression += value;
    }          
}

//display
function refreshDisplay(expression , answer){
    expressionDiv.textContent = expression;
    answerDiv.textContent = answer;
}

//event listener for buttonClick
input.addEventListener('click', buttonClick);

//clear memory
function clear(){
    expression = '';
    answer = '';
}

//clear last entry
//string method 'slice' to lop off last character
function clearEntry(){
    expression = expression.slice(0,-1);
}

//get the last character of the expression string
//parseInt is used to check if the last character (i.e. the sliced character)
//can be converted to a number
//isNaN checks and returns true if it is a number
function isOperator(){
    return isNaN(parseInt(expression.slice(-1)));
}

//append current answer and value to expression
function expressionFromAnswer(value){
    expression += answer + value;
}

function submit(){
    answer = scanExpression();
    expression = '';
}

//checks if answer isNaN or infinite.
//then return space
//check answer and insert decimal
function scanExpression(){
    let scan = eval(expression);
    return isNaN(scan) || !isFinite(scan) 
    ? '' 
    : scan < 1
        ? parseFloat(scan.toFixed(10))
        : parseFloat(scan.toFixed(2));
}  

/*alternative
function scanExpression() {
    try {
        let scanResult = eval(expression);
        if (isNaN(scanResult) || !isFinite(scanResult)) {
            return '';
        } else if (scanResult < 1) {
            return parseFloat(scanResult.toFixed(10));
        } else {
            return parseFloat(scanResult.toFixed(2));
        }
    } catch (e) {
        return '';
    }
}
*/

function negate(){
    //negate the answer if expression is empty and answer is present
    if (expression === '' && answer !== ''){
        answer = -answer;
    }
    //toggle the sign of the expression if not negative and not null
    else if (!expression.startsWith('-') && expression !== ('')){
        expression = '-' + expression;
    }
    //remove negative sign if already negative
    else if (expression.startsWith('-')){
        expression = expression.slice(1);
    }
}

//modulus 
function convertToPercentage(){
    //call scanExpression to eval to expression
    if (expression !== ''){
        answer = scanExpression();
        expression = '';
        if (!isNaN(answer) && isFinite(answer)){
            answer /= 100;
        } 
        else {
            answer = '';
        }
    }
    //expression is empty but there is an answer
    else if (answer !== ''){
        answer = parseFloat(answer) / 100;
    }
}

//check if last char in expression is not already decimal
//and not an operator
function convertTodecimal(value){
    if (!expression.endsWith('.') && !isNaN(expression.slice(-1))){
        expressionBuilder(value);
    }
}





