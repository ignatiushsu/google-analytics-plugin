// BENCHMARK JAVASCRIPT EXECUTION TEST

// Benchmark Snippet 1 - start
// Insert after $(document).ready(function){
var iterations = 10;
var totalTime = 0;
// Record the starting time, in UTC milliseconds.
var start = new Date().getTime();
for (i = 0; i < iterations; i++)
{
// Benchmark Snippet 1 - end


// Benchmark Snippet 2 - start
// Insert prior to closing });
}
var end = new Date().getTime();
totalTime = (end - start); 
alert(' Total Iterations = ' + iterations + ' \n Avg Time/Iteration = ' + totalTime / iterations + ' ms');
// Benchmark Snippet 2 - end



// JAVASCRIPT CLICK EVENT EXECUTION TEST

// Click Event Snippet 1 - start
// Insert after click event
var start = new Date().getTime();
// Click Event Snippet 1 - end

// Click Event Snippet 2 - start
// Insert prior to closing click event });
var end = new Date().getTime();
alert((end-start) + ' ms (js execution time)');
// Click Event Snippet 2 - end
