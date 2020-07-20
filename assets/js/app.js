// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";
  
  // Retrieve data from the CSV file and execute everything below
  d3.csv("./assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
  
    // parse data
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
      d.abbr = d.abbr;
      d.age = +d.age;
      d.income = +d.income;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
    });
  
    // xLinearScale and yLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data,chosenYAxis);
  
    // // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    //   .domain([0, d3.max(data, d => d.healthcare)])
    //   .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      //.classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      //.classed("y-axis",true)
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("g");
    
    var circlesXY = circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("opacity", ".5");
    
    var circlesText = circlesGroup.append("text")
      .text(d => d.abbr)
      .attr("dx", d=> xLinearScale(d[chosenXAxis]))
      .attr("dy",d=> yLinearScale(d[chosenYAxis]))
      .style("text-anchor","middle")
      .style("fill","white");

    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");  
  
    // append y axis
    var ylabelsGroup = chartGroup.append("g");

    var healthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 60 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value","healthcare")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 40 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value","smokes")
      .classed("inactive", true)
      .text("Smokes (%)");
    
    var obeseLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value","obesity")
      .classed("inactive", true)
      .text("Obesity (%)");
  
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
   
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
    //     // get value of selection
        var value = d3.select(this).attr("value");
          if (value !== chosenXAxis) {
    
            // replaces chosenXAxis with value
            chosenXAxis = value;
            console.log(chosenXAxis)
    
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(data, chosenXAxis);
    
            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x or y values
            circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

            circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);
  
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);
    
            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
              povertyLabel
                .classed("active", true)
                .classed("inactive", false);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenXAxis === "age") {
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", true)
                .classed("inactive", false);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else {
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }
          };
    })
    ylabelsGroup.selectAll("text")
      .on("click", function() {
    //     // get value of selection
        var value = d3.select(this).attr("value");
          if (value !== chosenYAxis) {
            // replaces chosenXAxis with value
            chosenYAxis = value;
            console.log(chosenYAxis)
    
            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(data, chosenYAxis);
    
            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);
    
             // updates circles with new x or y values
            circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);
  
            circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
              obeseLabel
                .classed("active", true)
                .classed("inactive", false);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenYAxis === "smokes") {
              obeseLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", true)
                .classed("inactive", false);
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            } else {
              obeseLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            }

          }
    })
   
      // });
  }).catch(function(error) {
    console.log(error);
    });
